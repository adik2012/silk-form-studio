<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cleanText(mixed $value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    $value = trim($value);

    if (function_exists('mb_substr')) {
        $value = mb_substr($value, 0, $maxLength, 'UTF-8');
    } else {
        preg_match_all('/./us', $value, $characters);
        $value = implode('', array_slice($characters[0] ?? [], 0, $maxLength));
    }
    return $value;
}

function htmlText(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    preg_match_all('/./us', $value, $characters);
    return count($characters[0] ?? []);
}

function rateLimit(): void
{
    $address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = hash('sha256', $address);
    $path = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'silkform-rate-' . $key . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false) {
        respond(503, ['success' => false, 'error' => 'Не удалось проверить частоту отправки. Попробуйте позже.']);
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        respond(503, ['success' => false, 'error' => 'Не удалось проверить частоту отправки. Попробуйте позже.']);
    }

    $contents = stream_get_contents($handle);
    $state = is_string($contents) && $contents !== '' ? json_decode($contents, true) : null;
    $now = time();
    $timestamps = is_array($state) && isset($state['timestamps']) && is_array($state['timestamps'])
        ? array_values(array_filter($state['timestamps'], static fn($stamp): bool => is_int($stamp) && $stamp > $now - 15))
        : [];

    if (count($timestamps) >= 1) {
        flock($handle, LOCK_UN);
        fclose($handle);
        respond(429, ['success' => false, 'error' => 'Слишком много заявок. Повторите через несколько секунд.']);
    }

    $timestamps[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    $writeFailed = fwrite($handle, json_encode(['timestamps' => $timestamps])) === false || fflush($handle) === false;
    flock($handle, LOCK_UN);
    fclose($handle);
    if ($writeFailed) {
        respond(503, ['success' => false, 'error' => 'Не удалось проверить частоту отправки. Попробуйте позже.']);
    }
}

function writeOrder(array $row): void
{
    $path = getenv('SILKFORM_ORDERS_PATH') ?: __DIR__ . '/data/orders.csv';
    $directory = dirname($path);
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        respond(500, ['success' => false, 'error' => 'Не удалось создать каталог для заявок.']);
    }
    $handle = fopen($path, 'a+');
    if ($handle === false) {
        respond(500, ['success' => false, 'error' => 'Заявку не удалось сохранить. Пожалуйста, свяжитесь с Анной по телефону.']);
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        respond(500, ['success' => false, 'error' => 'Заявку не удалось сохранить. Пожалуйста, свяжитесь с Анной по телефону.']);
    }

    $stat = fstat($handle);
    $writeFailed = false;
    if ($stat !== false && $stat['size'] === 0) {
        $writeFailed = fputcsv($handle, ['created_at', 'order_id', 'name', 'phone', 'messenger', 'address', 'mode', 'date', 'time', 'items_json', 'subtotal', 'pickup_discount', 'promo', 'promo_discount', 'delivery', 'total', 'consultation', 'comment']) === false;
    }
    if (!$writeFailed) {
        $writeFailed = fputcsv($handle, $row) === false;
    }
    if (!$writeFailed) {
        $writeFailed = fflush($handle) === false;
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    if ($writeFailed) {
        respond(500, ['success' => false, 'error' => 'Заявку не удалось записать. Пожалуйста, свяжитесь с Анной по телефону.']);
    }
}

function sendNotification(string $telegramMessage, string $emailMessage): array
{
    $botToken = getenv('SILKFORM_TELEGRAM_BOT_TOKEN') ?: '';
    $chatId = getenv('SILKFORM_TELEGRAM_CHAT_ID') ?: '';
    if ($botToken !== '' && $chatId !== '' && function_exists('curl_init')) {
        $curl = curl_init('https://api.telegram.org/bot' . rawurlencode($botToken) . '/sendMessage');
        if ($curl === false) {
            return ['configured' => true, 'sent' => false];
        }
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query([
                'chat_id' => $chatId,
                'text' => $telegramMessage,
                'parse_mode' => 'HTML',
                'disable_web_page_preview' => 'true',
            ]),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
        ]);
        $response = curl_exec($curl);
        $status = (int)curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
        $error = curl_error($curl);
        curl_close($curl);
        if ($response === false || $status < 200 || $status >= 300) {
            error_log('Silkform Telegram notification failed: ' . ($error !== '' ? $error : 'HTTP ' . $status));
            return ['configured' => true, 'sent' => false];
        }
        return ['configured' => true, 'sent' => true];
    }

    $recipient = getenv('SILKFORM_ORDER_EMAIL') ?: '';
    if ($recipient !== '' && function_exists('mail')) {
        $subject = 'Новая заявка — ШЁЛК & ФОРМА';
        $headers = "Content-Type: text/plain; charset=UTF-8\r\n";
        $sent = mail($recipient, '=?UTF-8?B?' . base64_encode($subject) . '?=', $emailMessage, $headers);
        if (!$sent) {
            error_log('Silkform email notification failed.');
        }
        return ['configured' => true, 'sent' => $sent];
    }

    error_log('Silkform order saved; no Telegram or email notification is configured.');
    return ['configured' => false, 'sent' => false];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'error' => 'Доступен только метод POST.']);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, ['success' => false, 'error' => 'Ожидается заявка в формате JSON.']);
}

$rawBody = file_get_contents('php://input', false, null, 0, 32769);
if ($rawBody === false || strlen($rawBody) > 32768) {
    respond(413, ['success' => false, 'error' => 'Размер заявки превышает допустимый.']);
}

$data = json_decode($rawBody, true);
if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
    respond(400, ['success' => false, 'error' => 'Не удалось прочитать данные заявки.']);
}

if (!empty($data['website'])) {
    respond(200, ['ok' => true]);
}

// Держать в синхроне с SERVICES в script.js
$catalog = [
    'airtouch' => ['type' => 'service', 'name' => 'Сложное окрашивание AirTouch', 'prices' => ['short' => 15900, 'mid' => 19900, 'long' => 23900], 'durations' => ['short' => 240, 'mid' => 300, 'long' => 300]],
    'gloss' => ['type' => 'service', 'name' => 'Глубокое тонирование и глянцевый блеск', 'prices' => ['short' => 7900, 'mid' => 9900, 'long' => 11900], 'durations' => ['short' => 150, 'mid' => 180, 'long' => 210]],
    'color-correction' => ['type' => 'service', 'name' => 'Выход из чёрного и сложные смывания', 'prices' => ['short' => 17900, 'mid' => 21900, 'long' => 25900], 'durations' => ['short' => 300, 'mid' => 360, 'long' => 420]],
    'haircut' => ['type' => 'service', 'name' => 'Стрижка «форма на 2 месяца»', 'prices' => ['short' => 5900, 'mid' => 6900, 'long' => 7900], 'durations' => ['short' => 120, 'mid' => 120, 'long' => 150]],
    'reconstruction' => ['type' => 'service', 'name' => 'Салонная реконструкция Tokio Inkarami', 'prices' => ['short' => 6900, 'mid' => 8400, 'long' => 9900], 'durations' => ['short' => 120, 'mid' => 150, 'long' => 150]],
    'tokyo-box' => ['type' => 'box', 'name' => 'Бокс «Токийская реконструкция»', 'prices' => ['travel' => 7400, 'full' => 12800]],
    'blond-box' => ['type' => 'box', 'name' => 'Бокс «Блонд-алхимия»', 'prices' => ['travel' => 6800, 'full' => 11600]],
    'volume-box' => ['type' => 'box', 'name' => 'Бокс «Объём и стойкий цвет»', 'prices' => ['travel' => 6500, 'full' => 11200]],
    'silk-scrunchie' => ['type' => 'upsell', 'name' => 'Шелковая наволочка / скранч из 100% шелка Малберри', 'prices' => ['standard' => 1200]],
    'thermal-fluid' => ['type' => 'upsell', 'name' => 'Термозащитный флюид 50 мл', 'prices' => ['standard' => 1450]],
    'lebel-ampoule' => ['type' => 'upsell', 'name' => 'Ампула глубокого увлажнения Lebel к процедуре', 'prices' => ['standard' => 1500]],
    'gift-care' => ['type' => 'gift', 'name' => 'Салонный уход-реконструкция кончиков', 'prices' => ['gift' => 0]],
    'gift-scrunchie' => ['type' => 'gift', 'name' => 'Шелковый скранч Малберри', 'prices' => ['gift' => 0]],
];

$items = $data['items'] ?? null;
if (!is_array($items) || count($items) < 1 || count($items) > 30) {
    respond(422, ['success' => false, 'error' => 'Добавьте хотя бы одну позицию в запись.']);
}

$normalizedItems = [];
$subtotal = 0;
$boxTotal = 0;
$hasService = false;
$giftCount = 0;
foreach ($items as $item) {
    if (!is_array($item) || !isset($item['id'], $item['type'], $item['option'])) {
        respond(422, ['success' => false, 'error' => 'Состав заказа содержит некорректную позицию.']);
    }
    if (!is_string($item['id']) || !is_string($item['type']) || !is_string($item['option'])) {
        respond(422, ['success' => false, 'error' => 'Состав заказа содержит некорректную позицию.']);
    }
    $id = (string)$item['id'];
    $type = (string)$item['type'];
    $option = (string)$item['option'];
    $product = $catalog[$id] ?? null;
    if ($product === null || $product['type'] !== $type || !array_key_exists($option, $product['prices'])) {
        respond(422, ['success' => false, 'error' => 'Одна из позиций заказа недоступна. Обновите страницу и попробуйте снова.']);
    }
    $qty = $type === 'service' || $type === 'gift' ? 1 : filter_var($item['qty'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 20]]);
    if ($qty === false) {
        respond(422, ['success' => false, 'error' => 'Количество в заказе должно быть от 1 до 20.']);
    }

    $price = $product['prices'][$option];
    $duration = $type === 'service' ? $product['durations'][$option] : 0;
    $normalizedItems[] = [
        'id' => $id,
        'type' => $type,
        'name' => $product['name'],
        'option' => $option,
        'price' => $price,
        'qty' => $qty,
        'durationMin' => $duration,
    ];
    if ($type === 'gift') {
        $giftCount++;
    } else {
        $subtotal += $price * $qty;
    }
    if ($type === 'box') {
        $boxTotal += $price * $qty;
    }
    if ($type === 'service') {
        $hasService = true;
    }
}

if ($giftCount > 1 || ($giftCount === 1 && $subtotal < 12000)) {
    respond(422, ['success' => false, 'error' => 'Подарок доступен при сумме позиций от 12 000 ₽ — выберите его после достижения порога.']);
}

$modeInput = $data['mode'] ?? 'visit';
if (!is_string($modeInput)) {
    respond(422, ['success' => false, 'error' => 'Выбран неизвестный формат получения заказа.']);
}
$mode = $modeInput;
if (!in_array($mode, ['visit', 'pickup', 'delivery'], true)) {
    respond(422, ['success' => false, 'error' => 'Выбран неизвестный формат получения заказа.']);
}
if ($hasService && $mode !== 'visit') {
    respond(422, ['success' => false, 'error' => 'Самовывоз и доставка доступны только для заказов без услуг.']);
}
if ($mode !== 'visit' && $boxTotal === 0) {
    respond(422, ['success' => false, 'error' => 'Добавьте бокс, чтобы выбрать самовывоз или доставку.']);
}

$slot = $data['slot'] ?? [];
if (!is_array($slot)) {
    respond(422, ['success' => false, 'error' => 'Выберите корректную дату визита или получения.']);
}
$dateInput = $slot['date'] ?? '';
$timeInput = $slot['time'] ?? '';
if (!is_string($dateInput) || !is_string($timeInput)) {
    respond(422, ['success' => false, 'error' => 'Выберите корректную дату визита или получения.']);
}
$date = $dateInput;
$time = $timeInput;
$dateObject = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('Europe/Moscow'));
$dateErrors = DateTimeImmutable::getLastErrors();
if (!$dateObject || ($dateErrors !== false && ($dateErrors['warning_count'] > 0 || $dateErrors['error_count'] > 0)) || $dateObject->format('Y-m-d') !== $date) {
    respond(422, ['success' => false, 'error' => 'Выберите корректную дату визита или получения.']);
}
$today = new DateTimeImmutable('today', new DateTimeZone('Europe/Moscow'));
$maxDate = $today->modify('+180 days');
if ($dateObject > $maxDate) {
    respond(422, ['success' => false, 'error' => 'Выберите дату в ближайшие 6 месяцев.']);
}
if ($dateObject < $today || (int)$dateObject->format('N') === 1) {
    respond(422, ['success' => false, 'error' => 'Понедельник и прошедшие даты недоступны.']);
}

$consultation = filter_var($data['consultation'] ?? false, FILTER_VALIDATE_BOOLEAN);
if ($mode === 'visit') {
    if (preg_match('/^(?:1[0-9]|20):(?:00|30)$/', $time) !== 1) {
        respond(422, ['success' => false, 'error' => 'Выберите время визита с 10:00 до 20:00.']);
    }
    $serviceDurations = [];
    foreach ($normalizedItems as $item) {
        if ($item['type'] === 'service') {
            $serviceDurations[] = $item['durationMin'];
        }
    }
    rsort($serviceDurations);
    $longestDuration = $serviceDurations
        ? min(360, $serviceDurations[0] + max(0, count($serviceDurations) - 1) * 60) + ($consultation ? 15 : 0)
        : 0;
    [$hours, $minutes] = array_map('intval', explode(':', $time));
    $startMinutes = $hours * 60 + $minutes;
    if ($startMinutes < 600 || $startMinutes > 1200 - $longestDuration || $startMinutes % 30 !== 0) {
        respond(422, ['success' => false, 'error' => 'Выбранное время не подходит для длительности услуги. Выберите более ранний слот.']);
    }
} else {
    $time = '';
}

$customerInput = is_array($data['customer'] ?? null) ? $data['customer'] : [];
$name = cleanText($customerInput['name'] ?? null, 100);
$phone = cleanText($customerInput['phone'] ?? null, 32);
$phoneDigits = preg_replace('/\D/', '', $phone) ?? '';
$messenger = cleanText($customerInput['messenger'] ?? null, 120);
$address = cleanText($customerInput['address'] ?? null, 200);
$comment = cleanText($customerInput['comment'] ?? null, 1000);
$consent = filter_var($customerInput['consent'] ?? false, FILTER_VALIDATE_BOOLEAN);
if (textLength($name) < 2 || preg_match('/^7\d{10}$/', $phoneDigits) !== 1 || !$consent) {
    respond(422, ['success' => false, 'error' => 'Проверьте имя, полный номер телефона и согласие на обработку персональных данных.']);
}
if ($mode === 'delivery' && (textLength($address) < 5 || textLength($address) > 200)) {
    respond(422, ['success' => false, 'error' => 'Укажите адрес доставки.']);
}

$promoInput = $data['promo'] ?? '';
if ($promoInput !== null && !is_string($promoInput)) {
    respond(422, ['success' => false, 'error' => 'Промокод не найден.']);
}
$promo = strtoupper(cleanText($promoInput ?? '', 32));
if ($promo !== '' && $promo !== 'SILK15') {
    respond(422, ['success' => false, 'error' => 'Промокод не найден.']);
}
$pickupDiscount = $mode === 'pickup' ? (int)round($boxTotal * 0.10) : 0;
$discountBase = max(0, $subtotal - $pickupDiscount);
$promoDiscount = $promo === 'SILK15' ? (int)round($discountBase * 0.15) : 0;
$delivery = $mode === 'delivery' && $boxTotal < 7000 ? 490 : 0;
$total = max(0, $subtotal - $pickupDiscount - $promoDiscount + $delivery);
$orderId = bin2hex(random_bytes(8));
$createdAt = (new DateTimeImmutable('now', new DateTimeZone('Europe/Moscow')))->format(DateTimeInterface::ATOM);
$modeLabels = ['visit' => 'Визит в студию', 'pickup' => 'Самовывоз бокса', 'delivery' => 'Доставка бокса курьером по Москве'];

$messageLines = [
    'Заявка с сайта «ШЁЛК & ФОРМА»',
    'Номер: ' . $orderId,
    'Имя: ' . $name . ' · Телефон: ' . $phone . ' · Ник: ' . ($messenger !== '' ? $messenger : '—'),
    'Формат: ' . $modeLabels[$mode],
];
foreach ($normalizedItems as $item) {
    $messageLines[] = '— ' . $item['name'] . ' · ' . $item['option'] . ' · ' . $item['durationMin'] . ' мин · ' . number_format($item['price'] * $item['qty'], 0, ',', ' ') . ' ₽';
}
$messageLines[] = 'Позиции: ' . number_format($subtotal, 0, ',', ' ') . ' ₽';
if ($pickupDiscount > 0) {
    $messageLines[] = 'Скидка самовывоза: −' . number_format($pickupDiscount, 0, ',', ' ') . ' ₽';
}
if ($promoDiscount > 0) {
    $messageLines[] = 'Промокод SILK15: −' . number_format($promoDiscount, 0, ',', ' ') . ' ₽';
}
if ($mode === 'delivery') {
    $messageLines[] = 'Доставка: ' . ($delivery > 0 ? number_format($delivery, 0, ',', ' ') . ' ₽' : 'бесплатно');
    $messageLines[] = 'Адрес: ' . $address;
}
$messageLines[] = 'ИТОГО: ' . number_format($total, 0, ',', ' ') . ' ₽';
$messageLines[] = 'Дата/время: ' . $date . ($time !== '' ? ', ' . $time : '');
$messageLines[] = 'Консультация и тест-прядь: ' . ($consultation ? 'да' : 'нет');
$messageLines[] = 'Комментарий: ' . ($comment !== '' ? $comment : '—');
$telegramLines = array_map('htmlText', $messageLines);
$telegramLines[0] = '<b>' . $telegramLines[0] . '</b>';
$totalLine = array_search('ИТОГО: ' . number_format($total, 0, ',', ' ') . ' ₽', $messageLines, true);
if ($totalLine !== false) {
    $telegramLines[$totalLine] = '<b>' . $telegramLines[$totalLine] . '</b>';
}
$telegramMessage = implode("\n", $telegramLines);
$emailMessage = implode("\n", $messageLines);

$itemsJson = json_encode($normalizedItems, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
rateLimit();
writeOrder([
    $createdAt,
    $orderId,
    $name,
    $phoneDigits,
    $messenger,
    $address,
    $mode,
    $date,
    $time,
    $itemsJson === false ? '[]' : $itemsJson,
    $subtotal,
    $pickupDiscount,
    $promo,
    $promoDiscount,
    $delivery,
    $total,
    $consultation ? 'yes' : 'no',
    $comment,
]);

$notification = sendNotification($telegramMessage, $emailMessage);
respond(200, [
    'ok' => true,
    'success' => true,
    'order_id' => $orderId,
    'subtotal' => $subtotal,
    'pickup_discount' => $pickupDiscount,
    'promo_discount' => $promoDiscount,
    'delivery' => $delivery,
    'total' => $total,
    'notification_configured' => $notification['configured'],
    'notification_sent' => $notification['sent'],
]);
