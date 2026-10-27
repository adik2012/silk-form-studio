(() => {
  "use strict";

  const STORAGE_KEY = "silkform_cart_v1";
  const BOOKINGS_KEY = "silkform_booked_slots_v1";

  const LENGTHS = [
    { id: "short", label: "Короткие", detail: "до плеч" },
    { id: "mid", label: "Средние", detail: "до лопаток" },
    { id: "long", label: "Длинные", detail: "ниже лопаток" },
  ];

  // Держать в синхроне с SERVICES в script.js
  const SERVICES = [
    {
      id: "airtouch",
      type: "service",
      category: "color",
      badge: "Хит",
      name: "Сложное окрашивание AirTouch",
      description:
        "Рельефное вымывание фона без чётких границ: мягкое отрастание 4–6 месяцев без обязательной коррекции. В стоимость входит: диагностика, мытьё, окрашивание, тонирование на 2–3 тона, салонный уход-запечатывание, укладка.",
      stages: [
        "Диагностика",
        "AirTouch",
        "Тонирование",
        "Уход-запечатывание",
        "Укладка",
      ],
      defaultLength: "long",
      prices: { short: 15900, mid: 19900, long: 23900 },
      durations: { short: 240, mid: 300, long: 300 },
    },
    {
      id: "gloss",
      type: "service",
      category: "color",
      badge: "Спасение блонда",
      name: "Глубокое тонирование и глянцевый блеск",
      description:
        "Нейтрализуем желтизну, выравниваем тон после неудачного окрашивания, добавляем зеркальный блеск. В стоимость входит: мытьё, тонирование, глянец-уход, укладка.",
      stages: ["Мытьё", "Тонирование", "Глянец-уход", "Укладка"],
      showcase: {
        complexity: "●●●○○",
        metric: "ГЛЯНЕЦ",
        value: "Зеркальный блеск",
        care: "Глянец-уход",
      },
      defaultLength: "mid",
      prices: { short: 7900, mid: 9900, long: 11900 },
      durations: { short: 150, mid: 180, long: 210 },
    },
    {
      id: "color-correction",
      type: "service",
      category: "color",
      badge: "Авторская техника",
      name: "Выход из чёрного и сложные смывания",
      description:
        "Послойное щадящее смывание домашней краски с обязательной тест-прядью, восстановление фона, тонирование в выбранную глубину. В стоимость входит: два процедурных этапа, реконструкция Tokio Inkarami, укладка. Рекомендую бесплатную консультацию до записи.",
      stages: [
        "Тест-прядь",
        "Смывание",
        "Реконструкция",
        "Тонирование",
        "Укладка",
      ],
      showcase: {
        complexity: "●●●●●",
        metric: "ПЛАН",
        value: "Тест-прядь и диагностика",
        care: "Tokio Inkarami",
      },
      defaultLength: "mid",
      prices: { short: 17900, mid: 21900, long: 25900 },
      durations: { short: 300, mid: 360, long: 420 },
    },
    {
      id: "haircut",
      type: "service",
      category: "care",
      badge: "Авторская техника",
      name: "Стрижка «форма на 2 месяца»",
      description:
        "Геометрия под ваш рост волос, плотность и вихры, сухая и влажная техники. В стоимость входит: мытьё, стрижка, укладка и 15-минутное обучение — как собрать форму дома за 5 минут.",
      stages: ["Мытьё", "Сухая и влажная техника", "Укладка", "Обучение"],
      showcase: {
        complexity: "●●○○○",
        metric: "ФОРМА",
        value: "До 2 месяцев",
        care: "Сухая и влажная техника",
      },
      defaultLength: "short",
      prices: { short: 5900, mid: 6900, long: 7900 },
      durations: { short: 120, mid: 120, long: 150 },
    },
    {
      id: "reconstruction",
      type: "service",
      category: "care",
      badge: "Хит",
      name: "Салонная реконструкция Tokio Inkarami",
      description:
        "Четырёхшаговый протокол Lebel Tokio Inkarami: восстановление структуры волос изнутри, эффект шелка до 5 недель. В стоимость входит: диагностика, 4 этапа системы, сушка. Частый ритуал после осветления и смываний.",
      stages: ["Диагностика", "4 этапа Tokio", "Уход", "Сушка"],
      showcase: {
        complexity: "●●●○○",
        metric: "ЭФФЕКТ",
        value: "Шёлк до 5 недель",
        care: "Lebel Tokio Inkarami",
      },
      defaultLength: "long",
      prices: { short: 6900, mid: 8400, long: 9900 },
      durations: { short: 120, mid: 150, long: 150 },
    },
  ];

  const BOXES = [
    {
      id: "tokyo-box",
      type: "box",
      category: "boxes",
      badge: "Lebel Tokio Inkarami",
      set: "№1",
      brand: "LEBEL TOKIO INKARAMI",
      art: "tokio",
      name: "Бокс «Токийская реконструкция»",
      forHair:
        "повреждённые, сухие, после осветления, смываний и выхода из чёрного",
      composition:
        "шампунь Shampoo TR №1 · маска Proto Treated · несмываемый крем Silk Oil — всё Lebel",
      prices: { travel: 7400, full: 12800 },
      caption: "Домашний протокол на 6–8 недель, инструкция от Анны в подарок",
    },
    {
      id: "blond-box",
      type: "box",
      category: "boxes",
      badge: "Davines Alchemic",
      set: "№2",
      brand: "DAVINES ALCHEMIC",
      art: "alchemic",
      name: "Бокс «Блонд-алхимия»",
      forHair: "натуральный и окрашенный блонд, холодные и бежевые оттенки",
      composition:
        "шампунь Alchemic Silver · кондиционер Alchemic Silver · несмываемый крем Heart of Glass Rich Care",
      prices: { travel: 6800, full: 11600 },
      caption: "Нейтрализация желтизны между визитами, курс до 10 недель",
    },
    {
      id: "volume-box",
      type: "box",
      category: "boxes",
      badge: "Davines Volu + Minu",
      set: "№3",
      brand: "DAVINES VOLU + MINU",
      art: "volu",
      name: "Бокс «Объём и стойкий цвет»",
      forHair:
        "тонкие волосы у корней, окрашивание в 1 тон, быстрая потеря цвета и объёма",
      composition:
        "шампунь Volu · кондиционер Minu (защита цвета) · прикорневой мист Volu",
      prices: { travel: 6500, full: 11200 },
      caption: "Лёгкие текстуры: объём без утяжеления, цвет держится дольше",
    },
  ];

  const UPSELLS = [
    {
      id: "silk-scrunchie",
      name: "Шелковая наволочка / скранч из 100% шелка Малберри",
      price: 1200,
    },
    { id: "thermal-fluid", name: "Термозащитный флюид 50 мл", price: 1450 },
    {
      id: "lebel-ampoule",
      name: "Ампула глубокого увлажнения Lebel к процедуре",
      price: 1500,
    },
  ];

  const GIFT_OPTIONS = [
    { id: "gift-care", name: "Салонный уход-реконструкция кончиков" },
    { id: "gift-scrunchie", name: "Шелковый скранч Малберри" },
  ];

  const CASES = [
    {
      title: "Из двухлетнего чёрного — в холодный бежевый",
      before: "images/service-2.jpg",
      after: "images/service-2.jpg",
      tone: "chestnut",
      serviceIds: ["color-correction"],
      length: "mid",
      base: 'Домашнее окрашивание "чёрный №1" в течение 2,5 лет, 8 см натуральных корней, длина до лопаток, пористые концы, страх сжечь волосы.',
      formula:
        "Бесплатная тест-прядь за 5 дней → послойное масляное смывание Tokio Inkarami → осветление фона в 2 захода с паузами и контролем → тонирование в холодный беж → реконструкция 4 шага Tokio Inkarami.",
      duration: "360 мин (6 часов), один визит",
      price: "21 900 ₽",
      detailPrice:
        "21 900 ₽ (средние волосы) — ровно как в калькуляторе на сайте.",
    },
    {
      title: "Первый AirTouch на натуральных волосах",
      before: "images/hero-after.jpg",
      after: "images/hero-after.jpg",
      tone: "natural",
      serviceIds: ["airtouch"],
      length: "long",
      base: 'Натуральные тёмные волосы ниже лопаток, никогда не окрашивались. Клиентка боялась "испортить девственные волосы", хотела свет у лица без полного окрашивания.',
      formula:
        "AirTouch с двойным вымыванием фона → тонирование на 2 тона светлее базы → глянцевание Davines → укладка.",
      duration: "300 мин (5 часов)",
      price: "23 900 ₽",
      detailPrice: "23 900 ₽ (длинные волосы).",
    },
    {
      title: "Спасение лимонного блонда после аптечного осветления",
      before: "images/service-5.jpg",
      after: "images/service-5.jpg",
      tone: "yellow",
      serviceIds: ["gloss", "reconstruction"],
      length: "mid",
      base: "Домашнее осветление масс-маркет: лимонно-жёлтый фон, обломы 3–5 см по контуру лица, жёсткость по длине.",
      formula:
        'Щадящая коррекция фона одной процедурой → глубокое тонирование в крем-блонд → салонная реконструкция Tokio Inkarami → подбор бокса "Блонд-алхимия" и домашнего протокола.',
      duration: "330 мин (5,5 часов)",
      price: "18 300 ₽",
      detailPrice:
        "18 300 ₽ — комплекс «тонирование (средние) 9 900 ₽ + реконструкция (средние) 8 400 ₽».",
    },
  ];

  const QUIZ_QUESTIONS = [
    {
      title: "Какая у вас сейчас длина волос?",
      answers: [
        "Короткие (до плеч)",
        "Средние (до лопаток)",
        "Длинные (ниже лопаток)",
      ],
      icons: ["↟", "〰", "↡"],
    },
    {
      title: "История ваших волос за последний год?",
      answers: [
        "Натуральные, не окрашивались",
        "Окрашены в 1 тон",
        "Осветлённые или блонд",
        "Выход из чёрного или хны",
      ],
      icons: ["✧", "◉", "✦", "◌"],
    },
    {
      title: "Какой результат вы хотите получить?",
      answers: [
        "Сложный рельефный блонд AirTouch",
        "Естественное обновление цвета и блеск",
        "Глубокое восстановление и стрижка по форме",
      ],
      icons: ["✳", "✧", "⌁"],
    },
    {
      title: "Что беспокоит в качестве волос прямо сейчас?",
      answers: [
        "Сухость и ломкость кончиков",
        "Быстро смывается цвет",
        "Не держится объём у корней",
      ],
      icons: ["◇", "◍", "⌁"],
    },
  ];

  const REVIEWS = [
    {
      initial: "М",
      name: "Марина, 34",
      date: "сентябрь 2026",
      chip: "AirTouch, длинные волосы",
      text: "Шесть часов пролетели незаметно: тишина, кофе, одна я. Смету озвучили до начала — 23 900 ₽, и на кассе ни рублём больше. Впервые за десять лет окрашиваний. Блонд не пожелтел и через три месяца.",
    },
    {
      initial: "О",
      name: "Ольга, 29",
      date: "август 2026",
      chip: "Выход из чёрного + реконструкция",
      text: "Красилась в чёрный дома 2,5 года. На тест-пряди Анна честно показала, что получится за один визит из шести часов. Так и вышло: холодный беж, волосы живые, 21 900 ₽ — ровно как в калькуляторе.",
    },
    {
      initial: "Е",
      name: "Екатерина, 41",
      date: "июль 2026",
      chip: 'Стрижка + бокс «Объём и стойкий цвет»',
      text: "Впервые в жизни стрижка, которую я укладываю сама за пять минут феном. Взяла бокс Davines — цвет стал держаться заметно дольше. Забрала самовывозом со скидкой 10%.",
    },
  ];

  const FAQ = [
    [
      'Правда, что не будет доплат за густоту и «лишний грамм краски»?',
      "Правда. Цена закрепляется по длине волос при выборе в каталоге и фиксируется в смете до мытья головы. Плотность и количество краски не тарифицируются отдельно. Цена на сайте = цена на кассе.",
    ],
    [
      "Сколько держится AirTouch и когда нужна коррекция?",
      "4–6 месяцев мягкого отрастания без чёткой границы. Поддержка — тонирование 180 минут раз в 3–4 месяца. Полное перекрашивание не требуется.",
    ],
    [
      "Можно ли сделать окрашивание и уход-реконструкцию в один день?",
      "В 80% случаев да, и это выгоднее по времени: реконструкция встраивается в визит. При агрессивных смываниях (выход из чёрного) назначу реконструкцию на 10–14 день отдельным визитом по протоколу.",
    ],
    [
      "Что будет, если оттенок или форма не понравятся?",
      "Гарантия 14 дней: коррекция тона или формы бесплатно. Тест-прядь до старта снижает этот риск почти до нуля — оттенок вы видите заранее.",
    ],
    [
      "У меня неудачное домашнее окрашивание / волосы после хны / накладные пряди — возьмётесь?",
      "Начнём с бесплатной 15-минутной консультации и тест-пряди. Если риск для волос выше допустимого — честно откажу и дам план восстановления. После хны работаю только при положительной тест-пряде.",
    ],
  ];

  const getService = (id) => SERVICES.find((item) => item.id === id);
  const getBox = (id) => BOXES.find((item) => item.id === id);
  const getUpsell = (id) => UPSELLS.find((item) => item.id === id);
  const formatMoney = (value) =>
    `${Math.round(value)
      .toLocaleString("ru-RU")
      .replace(/\u00a0/g, " ")} ₽`;
  const escapeHtml = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );

  const emptyState = () => ({
    items: [],
    promo: null,
    mode: "visit",
    slot: { date: "", time: "" },
    consultation: false,
    customer: {},
  });

  function normalizeItem(item) {
    if (!item || typeof item !== "object" || typeof item.id !== "string")
      return null;
    if (item.type === "service") {
      const product = getService(item.id);
      if (!product || !product.prices[item.option]) return null;
      return {
        id: product.id,
        type: "service",
        option: item.option,
        price: product.prices[item.option],
        durationMin: product.durations[item.option],
        qty: 1,
      };
    }
    if (item.type === "box") {
      const product = getBox(item.id);
      if (!product || !product.prices[item.option]) return null;
      return {
        id: product.id,
        type: "box",
        option: item.option,
        price: product.prices[item.option],
        durationMin: 0,
        qty: Math.max(1, Math.min(20, Number(item.qty) || 1)),
      };
    }
    if (item.type === "upsell") {
      const product = getUpsell(item.id);
      if (!product) return null;
      return {
        id: product.id,
        type: "upsell",
        option: "standard",
        price: product.price,
        durationMin: 0,
        qty: Math.max(1, Math.min(20, Number(item.qty) || 1)),
      };
    }
    if (
      item.type === "gift" &&
      GIFT_OPTIONS.some((gift) => gift.id === item.id)
    ) {
      return {
        id: item.id,
        type: "gift",
        option: "gift",
        price: 0,
        durationMin: 0,
        qty: 1,
      };
    }
    return null;
  }

  const safeRead = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const itemList = Array.isArray(parsed.items) ? parsed.items : [];
      return {
        items: itemList.map((item) => normalizeItem(item)).filter(Boolean),
        promo: parsed.promo === "SILK15" ? "SILK15" : null,
        mode: ["visit", "pickup", "delivery"].includes(parsed.mode)
          ? parsed.mode
          : "visit",
        slot:
          parsed.slot && typeof parsed.slot.date === "string"
            ? {
                date: parsed.slot.date,
                time:
                  typeof parsed.slot.time === "string" ? parsed.slot.time : "",
              }
            : { date: "", time: "" },
        consultation: Boolean(parsed.consultation),
        customer: {},
      };
    } catch (error) {
      console.error("Не удалось прочитать сохранённую корзину:", error);
      return emptyState();
    }
  };

  let state = safeRead();
  let activeFilter = "all";
  let quizStep = 0;
  let quizAnswers = [null, null, null, null];
  let quizRecommendation = null;
  let toastTimer;
  let previousFocus = null;
  let activeModal = null;
  let quickProductsRendered = false;
  let giftToastShown = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  function track(name, detail = {}) {
    document.dispatchEvent(
      new CustomEvent("silkform:analytics", {
        detail: { event: name, ...detail },
      }),
    );
    if (Array.isArray(window.dataLayer))
      window.dataLayer.push({ event: name, ...detail });
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: state.items,
          promo: state.promo,
          mode: state.mode,
          slot: state.slot,
          consultation: state.consultation,
        }),
      );
    } catch (error) {
      console.error("Не удалось сохранить корзину:", error);
    }
  }

  function formatDuration(minutes) {
    return `${minutes} мин (${formatHours(minutes)})`;
  }

  function formatHours(minutes) {
    const hours = minutes / 60;
    return Number.isInteger(hours)
      ? `${hours} ч`
      : `${Math.floor(hours)} ч ${minutes % 60} мин`;
  }

  function productLabel(item) {
    if (item.type === "service") {
      const product = getService(item.id);
      const length = LENGTHS.find((option) => option.id === item.option);
      return {
        title: product.name,
        subtitle: `${length.label.toLowerCase()} волосы · ${item.durationMin} мин`,
        count: false,
      };
    }
    if (item.type === "box") {
      const product = getBox(item.id);
      return {
        title: product.name,
        subtitle:
          item.option === "travel"
            ? "Travel-сет 3×100 мл"
            : "Full-size набор 3×250 мл",
        count: true,
      };
    }
    if (item.type === "upsell")
      return {
        title: getUpsell(item.id).name,
        subtitle: "Дополнение к заказу",
        count: true,
      };
    return {
      title: GIFT_OPTIONS.find((gift) => gift.id === item.id).name,
      subtitle: "Подарок · 0 ₽",
      count: false,
    };
  }

  function renderCatalog() {
    const serviceCards = SERVICES.map((product, index) => {
      const isColor = product.category === "color";
      const flagship = index === 0;
      const selectedLength = product.defaultLength;
      const duration = product.durations[selectedLength];
      const controls = `<div class="segment-control" role="group" aria-label="Длина волос для услуги «${escapeHtml(product.name)}»">${LENGTHS.map((length) => `<button type="button" class="${length.id === selectedLength ? "is-active" : ""}" data-option="${length.id}" aria-pressed="${length.id === selectedLength}">${length.label}</button>`).join("")}</div>`;
      const stages = product.stages
        .map(
          (stage) => `<span class="service-chip">${escapeHtml(stage)}</span>`,
        )
        .join("");
      const badge = flagship ? "★ ФЛАГМАН СТУДИИ • ХИТ" : product.badge;
      const showcase = product.showcase
        ? `<div class="service-showcase" aria-label="Параметры услуги">
        <span class="showcase-number">${String(index + 1).padStart(2, "0")}</span>
        <div class="showcase-metric"><span class="showcase-label">${escapeHtml(product.showcase.metric)}</span><strong>${escapeHtml(product.showcase.value)}</strong></div>
        <div class="showcase-detail"><span>Сложность</span><strong class="showcase-dots">${escapeHtml(product.showcase.complexity)}</strong><span>Уход · ${escapeHtml(product.showcase.care)}</span></div>
        <span class="showcase-duration" data-showcase-duration>${formatDuration(duration)}</span>
      </div>`
        : "";
      return `<article class="catalog-card service-card${flagship ? " service-card-flagship" : ""}" data-card-type="service" data-category="${product.category}" data-id="${product.id}" data-filter-group="${isColor ? "color" : "care"}">
        <div class="catalog-editorial-head">
          <div class="catalog-editorial-top"><span class="service-index">${String(index + 1).padStart(2, "0")}</span><span class="product-badge">${escapeHtml(badge)}</span></div>
        </div>
        ${showcase}
        <div class="service-card-layout">
          <div class="service-card-info">
            <span class="eyebrow">${isColor ? "Авторское окрашивание" : "Уход и форма"}</span>
            <h3>${escapeHtml(product.name)}</h3>
            <p>${escapeHtml(product.description)}</p>
            <div class="service-stages"><span class="service-stages-label">Что входит в визит</span><div class="service-chips">${stages}</div></div>
            ${flagship ? controls : ""}
          </div>
          <div class="service-card-offer">
            <p class="duration"><span class="duration-icon" aria-hidden="true">◷</span><span data-duration>${formatDuration(duration)}</span></p>
            ${flagship ? "" : controls}
            <div class="price-line"><strong class="price" data-price aria-live="polite">${formatMoney(product.prices[selectedLength])}</strong><span class="fixed-price-badge">Фиксированная смета</span></div><p class="price-caption">всё включено, без доплат на кассе</p>
            <button class="button button-primary card-action" type="button" data-add-service="${product.id}">Выбрать</button><p class="cancel-caption">бесплатная отмена за 24 часа</p>
          </div>
        </div>
      </article>`;
    }).join("");

    const boxCards = BOXES.map(
      (
        product,
      ) => `<article class="catalog-card box-card" id="card-${product.id}" data-card-type="box" data-category="boxes" data-id="${product.id}" data-filter-group="boxes">
      <div class="box-showcase box-art-${product.art}" aria-hidden="true">
        <span class="box-set-number">SET ${escapeHtml(product.set)}</span>
        <div class="bottle-lineup">
          <span class="bottle bottle-tall"><i class="bottle-pump"></i><i class="bottle-label"><b>SILK &amp; FORMA</b><small>${escapeHtml(product.set)}</small><small>SHAMPOO</small></i></span>
          <span class="bottle bottle-jar"><i class="bottle-cap"></i><i class="bottle-label"><b>SILK &amp; FORMA</b><small>${escapeHtml(product.set)}</small><small>MASK</small></i></span>
          <span class="bottle bottle-spray"><i class="bottle-spray-cap"></i><i class="bottle-label"><b>SILK &amp; FORMA</b><small>${escapeHtml(product.set)}</small><small>ELIXIR</small></i></span>
        </div>
        <span class="box-brand">${escapeHtml(product.brand)}</span>
      </div>
      <div class="catalog-body"><span class="eyebrow">Домашняя система</span><h3>${escapeHtml(product.name)}</h3>
      <p class="body-label">Для каких волос</p><p>${escapeHtml(product.forHair)}</p><p class="body-label">Состав</p><p>${escapeHtml(product.composition)}</p>
      <div class="segment-control" role="group" aria-label="Объём бокса «${escapeHtml(product.name)}»"><button class="is-active" type="button" data-option="travel" aria-pressed="true">Travel 3×100</button><button type="button" data-option="full" aria-pressed="false">Full-size 3×250</button></div>
      <div class="price-line"><strong class="price" data-price aria-live="polite">${formatMoney(product.prices.travel)}</strong><span class="fixed-price-badge">Фиксированная смета</span></div><p class="price-caption" data-volume-label>Travel-сет 3×100 мл</p><p class="cancel-caption">${escapeHtml(product.caption)}</p>
      <button class="button button-primary card-action" type="button" data-add-box="${product.id}">В корзину</button></div></article>`,
    ).join("");

    $("#service-grid").innerHTML = serviceCards;
    $("#box-grid").innerHTML = boxCards;
    applyFilter();
    track("page_view", { page: location.pathname });
  }

  function applyFilter() {
    $$(".catalog-card").forEach((card) => {
      const group = card.dataset.filterGroup;
      card.hidden = !(
        activeFilter === "all" ||
        activeFilter === group ||
        (activeFilter === "color" && group === "color") ||
        (activeFilter === "care" && group === "care")
      );
    });
    $$(".filter-tab").forEach((button) => {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    $("#service-grid").hidden = activeFilter === "boxes";
    $("#boxes").hidden = activeFilter !== "all" && activeFilter !== "boxes";
  }

  function renderCases() {
    $("#cases-grid").innerHTML = CASES.map(
      (item, index) => `<article class="case-card">
      <div class="compare-frame" data-compare data-tone="${item.tone}" style="--split:50%">
        <img class="compare-after" src="${item.after}" alt="Визуализация оттенка: ${escapeHtml(item.title)}" loading="lazy"><div class="compare-before"><img src="${item.before}" alt="" aria-hidden="true" loading="lazy"></div>
        <span class="compare-label label-before">До</span><span class="compare-label label-after">После</span><input class="compare-range" type="range" min="0" max="100" value="50" aria-label="Сравнить визуализацию оттенка до и после: ${escapeHtml(item.title)}"><span class="compare-divider" aria-hidden="true"><span>↔</span></span>
      </div>
      <div class="case-copy"><span class="case-number">Кейс 0${index + 1}</span><h3>${escapeHtml(item.title)}</h3>
        <button class="button button-secondary lightbox-trigger" type="button" data-open-lightbox="${index}">Увеличить фото ⤢</button>
        <details class="case-details"><summary>Разбор формулы</summary>
          <div class="case-breakdown"><p><strong>Исходная база и проблема:</strong> ${escapeHtml(item.base)}</p><p><strong>Что сделали и какими составами:</strong> ${escapeHtml(item.formula)}</p><p><strong>Время работы:</strong> ${escapeHtml(item.duration)}</p><p><strong>Итоговая стоимость:</strong> ${escapeHtml(item.detailPrice)}</p></div>
          <button class="button button-primary case-booking" type="button" data-book-case="${index}">Хочу такой же результат — записаться</button>
        </details>
        <div class="case-result"><span>Итоговая стоимость</span><strong>${escapeHtml(item.price)}</strong></div>
      </div></article>`,
    ).join("");
    initComparisons();
  }

  function renderReviewsAndFaq() {
    $("#reviews-grid").innerHTML = REVIEWS.map(
      (review) =>
        `<article class="review-card"><div class="review-top"><span class="review-avatar" aria-hidden="true">${review.initial}</span><div><h3 class="review-name">${escapeHtml(review.name)}</h3><p class="review-date">${escapeHtml(review.date)}</p></div></div><span class="review-chip">${escapeHtml(review.chip)}</span><blockquote>«${escapeHtml(review.text)}»</blockquote><span class="sage-badge verified">Визит подтверждён</span></article>`,
    ).join("");
    $("#faq-list").innerHTML = FAQ.map(
      ([question, answer]) =>
        `<details class="faq-item"><summary>${escapeHtml(question)}</summary><p>${escapeHtml(answer)}</p></details>`,
    ).join("");
  }

  function initComparisons() {
    $$("[data-compare]").forEach((frame) => {
      if (frame.dataset.ready) return;
      frame.dataset.ready = "true";
      const range = $(".compare-range", frame);
      const setSplit = (value) => {
        const next = Math.max(0, Math.min(100, Number(value)));
        frame.style.setProperty("--split", `${next}%`);
        range.value = String(next);
      };
      range.addEventListener("input", () => setSplit(range.value));
      frame.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        frame.dataset.dragging = "true";
        frame.setPointerCapture(event.pointerId);
        setSplitFromPointer(event);
      });
      frame.addEventListener("pointermove", (event) => {
        if (frame.dataset.dragging !== "true") return;
        setSplitFromPointer(event);
      });
      const endDrag = (event) => {
        if (frame.dataset.dragging !== "true") return;
        frame.dataset.dragging = "false";
        if (frame.hasPointerCapture(event.pointerId))
          frame.releasePointerCapture(event.pointerId);
      };
      frame.addEventListener("pointerup", endDrag);
      frame.addEventListener("pointercancel", endDrag);
      function setSplitFromPointer(event) {
        const bounds = frame.getBoundingClientRect();
        setSplit(((event.clientX - bounds.left) / bounds.width) * 100);
      }
      frame.addEventListener("keydown", (event) => {
        if (document.activeElement !== range) return;
        if (event.key === "ArrowLeft") setSplit(Number(range.value) - 2);
        if (event.key === "ArrowRight") setSplit(Number(range.value) + 2);
      });
    });
  }

  function itemKey(item) {
    return `${item.type}:${item.id}:${item.option}`;
  }

  function addItem(item, message) {
    const normalized = normalizeItem(item);
    if (!normalized) return;
    const existing = state.items.find(
      (current) => itemKey(current) === itemKey(normalized),
    );
    if (existing && existing.type !== "service" && existing.type !== "gift")
      existing.qty = Math.min(20, existing.qty + normalized.qty);
    else if (!existing) state.items.push(normalized);
    if (
      normalized.type === "service" &&
      (normalized.id === "airtouch" || normalized.id === "color-correction")
    )
      state.consultation = true;
    if (hasServices() && state.mode !== "visit") state.mode = "visit";
    persist();
    renderCart();
    if (message) showToast(message);
    track("add_to_cart", { id: normalized.id, type: normalized.type });
  }

  function removeItem(key) {
    state.items = state.items.filter((item) => itemKey(item) !== key);
    if (hasServices() && state.mode !== "visit") state.mode = "visit";
    persist();
    renderCart();
    showToast("Позиция удалена");
    track("remove_from_cart", { key });
  }

  function clearAllCart() {
    state.items = [];
    state.promo = null;
    state.mode = "visit";
    state.slot = { date: "", time: "" };
    state.consultation = false;
    giftToastShown = false;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    persist();
    const promoInput = $("#promo-input");
    if (promoInput) promoInput.value = "";
    const promoMsg = $("[data-promo-message]");
    if (promoMsg) promoMsg.textContent = "";
    renderCart();
    showToast("Корзина полностью очищена");
  }

  function hasServices() {
    return state.items.some((item) => item.type === "service");
  }
  function getGiftEligibleTotal() {
    return state.items
      .filter((item) => item.type !== "gift")
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }
  function getBoxTotal() {
    return state.items
      .filter((item) => item.type === "box")
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  }
  function getSubtotal() {
    return getGiftEligibleTotal();
  }

  function getTotals() {
    const subtotal = getSubtotal();
    const pickupDiscount =
      state.mode === "pickup" ? Math.round(getBoxTotal() * 0.1) : 0;
    const taxable = Math.max(0, subtotal - pickupDiscount);
    const promoDiscount =
      state.promo === "SILK15" ? Math.round(taxable * 0.15) : 0;
    const delivery =
      state.mode === "delivery" && getBoxTotal() < 7000 ? 490 : 0;
    return {
      subtotal,
      pickupDiscount,
      promoDiscount,
      delivery,
      total: Math.max(0, subtotal - pickupDiscount - promoDiscount + delivery),
    };
  }

  function getTotalQuantity() {
    return state.items
      .filter((item) => item.type !== "gift")
      .reduce((sum, item) => sum + item.qty, 0);
  }

  function getServiceDuration(items, withConsultation = false) {
    const durations = items
      .filter((item) => item.type === "service")
      .map((item) => item.durationMin)
      .sort((a, b) => b - a);
    if (!durations.length) return 0;
    const extra = durations.slice(1).reduce((sum) => sum + 60, 0);
    return Math.min(360, durations[0] + extra) + (withConsultation ? 15 : 0);
  }

  function longestService() {
    return getServiceDuration(state.items, state.consultation);
  }

  function minutesToTime(totalMin) {
    const hh = String(Math.floor(totalMin / 60)).padStart(2, "0");
    const mm = String(totalMin % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  function timeToMinutes(timeStr) {
    if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return null;
    const [hh, mm] = timeStr.split(":").map(Number);
    return hh * 60 + mm;
  }

  function getStoredBookings() {
    try {
      const parsed = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function getBookedIntervalsForDate(dateStr) {
    if (!dateStr) return [];
    const dayNum = Number(dateStr.split("-")[2]) || 1;
    const demoInterval =
      dayNum % 2 === 0
        ? { start: 16 * 60, end: 18 * 60 }
        : { start: 10 * 60, end: 12 * 60 };
    const stored = getStoredBookings()[dateStr];
    const customList = Array.isArray(stored)
      ? stored.filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end))
      : [];
    return [demoInterval, ...customList].sort((a, b) => a.start - b.start);
  }

  function findSlotConflict(dateStr, startMin, durationMin) {
    const endMin = startMin + durationMin;
    if (endMin > 20 * 60) return { reason: "after_close" };
    for (const busy of getBookedIntervalsForDate(dateStr)) {
      if (startMin >= busy.start && startMin < busy.end) {
        return {
          reason: "busy",
          text: `Занято (${minutesToTime(busy.start)}–${minutesToTime(busy.end)})`,
        };
      }
      if (startMin < busy.end && endMin > busy.start) {
        return {
          reason: "overlap",
          text: `Пересечение с записью ${minutesToTime(busy.start)}–${minutesToTime(busy.end)}`,
        };
      }
    }
    return null;
  }

  function saveBookingInterval(dateStr, startTimeStr, durationMin) {
    const start = timeToMinutes(startTimeStr);
    if (!dateStr || start === null || !durationMin) return;
    const all = getStoredBookings();
    if (!Array.isArray(all[dateStr])) all[dateStr] = [];
    all[dateStr].push({ start, end: start + durationMin });
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
    } catch (e) {
      console.error(e);
    }
  }

  function buildTimeSlotOptions(dateStr, durationMin, todayText, nowTimeStr) {
    if (!dateStr) return [];
    const latestStart = 20 * 60 - durationMin;
    const options = [];
    for (let start = 10 * 60; start <= latestStart; start += 30) {
      const startText = minutesToTime(start);
      const endText = minutesToTime(start + durationMin);
      if (dateStr === todayText && startText <= nowTimeStr) continue;
      const conflict = findSlotConflict(dateStr, start, durationMin);
      options.push({
        value: startText,
        disabled: Boolean(conflict),
        label: conflict
          ? `${startText} — ${endText} · ${conflict.text}`
          : `${startText} — ${endText} (${formatHours(durationMin)})`,
      });
    }
    return options;
  }

  function renderHeaderCart() {
    const quantity = getTotalQuantity();
    const amount = getTotals().total;
    $$("[data-cart-count]").forEach((node) => {
      node.textContent = String(quantity);
    });
    $$("[data-mobile-total]").forEach((node) => {
      node.textContent = formatMoney(amount);
    });
    const label = $("[data-cart-label]");
    if (label)
      label.textContent = quantity
        ? `${quantity} поз. · ${formatMoney(amount)}`
        : "Записаться";
  }

  function renderCart() {
    renderHeaderCart();
    renderQuickBooking();
    const empty = $("[data-cart-empty]");
    const content = $("[data-cart-content]");
    empty.hidden = state.items.length > 0;
    content.hidden = state.items.length === 0;
    if (!state.items.length) {
      updateMessengerLinks();
      syncSubmitState();
      return;
    }
    const itemsNode = $("[data-cart-items]");
    const clearBar = `<div class="cart-clear-bar" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font-size:0.82rem;font-weight:700;color:var(--text-muted);">Выбранные позиции (${state.items.length})</span><button type="button" class="text-link" data-clear-cart style="font-size:0.82rem;">Очистить всё ×</button></div>`;
    itemsNode.innerHTML =
      clearBar +
      state.items
        .map((item) => {
          const label = productLabel(item);
          const amount = item.price * item.qty;
          const quantityControl = label.count
            ? `<div class="qty-control"><button type="button" data-qty="-1" data-item-key="${escapeHtml(itemKey(item))}" aria-label="Уменьшить количество">−</button><span>${item.qty}</span><button type="button" data-qty="1" data-item-key="${escapeHtml(itemKey(item))}" aria-label="Увеличить количество">+</button></div>`
            : "";
          return `<article class="cart-item"><div><h3>${escapeHtml(label.title)}</h3><p>${escapeHtml(label.subtitle)}</p></div><div class="cart-item-end"><span class="cart-item-price">${formatMoney(amount)}</span><div class="cart-item-actions">${quantityControl}<button class="remove-item" type="button" data-remove-item="${escapeHtml(itemKey(item))}" aria-label="Удалить ${escapeHtml(label.title)}">×</button></div></div></article>`;
        })
        .join("");
    renderGift();
    renderUpsells();
    renderModes();
    renderAppointmentFields();
    renderTotals();
    updateMessengerLinks();
    syncSubmitState();
  }

  function renderQuickProductOptions() {
    const select = $("[data-quick-product]");
    const serviceOptions = SERVICES.map(
      (product) =>
        `<optgroup label="${escapeHtml(product.name)}">${LENGTHS.map((length) => `<option value="service|${product.id}|${length.id}">${length.label} (${length.detail}) · ${product.durations[length.id]} мин · ${formatMoney(product.prices[length.id])}</option>`).join("")}</optgroup>`,
    ).join("");
    const boxOptions = BOXES.map(
      (product) =>
        `<optgroup label="${escapeHtml(product.name)}"><option value="box|${product.id}|travel">Travel 3×100 мл · ${formatMoney(product.prices.travel)}</option><option value="box|${product.id}|full">Full-size 3×250 мл · ${formatMoney(product.prices.full)}</option></optgroup>`,
    ).join("");
    select.innerHTML = `<option value="">Выберите услугу или бокс</option>${serviceOptions}${boxOptions}`;
    quickProductsRendered = true;
  }

  function getQuickSelectedItem() {
    const select = $("[data-quick-product]");
    if (!select || !select.value) return null;
    const [type, id, option] = select.value.split("|");
    return normalizeItem({ type, id, option, qty: 1 });
  }

  function getQuickOrderItems() {
    return state.items.length
      ? state.items
      : [getQuickSelectedItem()].filter(Boolean);
  }

  function renderQuickBooking() {
    const select = $("[data-quick-product]");
    if (!select) return;
    if (!quickProductsRendered) renderQuickProductOptions();
    const selection = $("[data-quick-selection]");
    const summary = $("[data-quick-cart-summary]");
    const hasCart = state.items.length > 0;
    selection.hidden = hasCart;
    summary.hidden = !hasCart;
    if (hasCart) {
      const lines = state.items
        .map(
          (item) =>
            `${productLabel(item).title} · ${productLabel(item).subtitle}`,
        )
        .join(" · ");
      $("[data-quick-cart-items]").textContent = lines;
      const totals = getTotals();
      const quickPromo = $("[data-quick-promo]").value.trim().toUpperCase();
      const promoDiscount =
        quickPromo === "SILK15" && state.promo !== "SILK15"
          ? Math.round(
              Math.max(0, totals.subtotal - totals.pickupDiscount) * 0.15,
            )
          : 0;
      $("[data-quick-cart-total]").textContent = formatMoney(
        Math.max(0, totals.total - promoDiscount),
      );
    }
    const items = getQuickOrderItems();
    const quickConsult = Boolean(
      $("[data-quick-order-form]")?.elements?.consultation?.checked,
    );
    const duration = getServiceDuration(
      items,
      hasCart ? state.consultation : quickConsult,
    );
    const quickPrice = $("[data-quick-price]");
    if (quickPrice) {
      const selectedItem = getQuickSelectedItem();
      if (selectedItem && !hasCart) {
        const pickupDiscount =
          selectedItem.type === "box"
            ? Math.round(selectedItem.price * 0.1)
            : 0;
        const afterPickup = selectedItem.price - pickupDiscount;
        const promoDiscount =
          $("[data-quick-promo]").value.trim().toUpperCase() === "SILK15"
            ? Math.round(afterPickup * 0.15)
            : 0;
        const total = afterPickup - promoDiscount;
        const timeNote =
          selectedItem.type === "service"
            ? ` · Длительность визита: ${formatDuration(duration)}`
            : "";
        quickPrice.textContent = `${formatMoney(total)}${timeNote}${pickupDiscount ? " с учётом самовывоза −10%" : ""}${promoDiscount ? ` · SILK15: −${formatMoney(promoDiscount)}` : ""}`;
      } else if (!hasCart)
        quickPrice.textContent =
          "Выберите процедуру — покажем точную цену и длительность слота";
    }
    const hasServiceItems = items.some((item) => item.type === "service");
    const dateLabel = $("[data-quick-date-label]");
    const timeLabel = $("[data-quick-time-label]");
    const timeSelect = $("[data-quick-time]");
    const dateInput = $("[data-quick-date]");
    const today = new Date();
    const todayText = toDateValue(today);
    const nowTimeStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
    dateInput.min = todayText;
    if (dateLabel)
      dateLabel.textContent = hasServiceItems
        ? "Желаемая дата визита*"
        : "Желаемая дата получения*";
    timeLabel.hidden = !hasServiceItems;
    timeSelect.required = hasServiceItems;
    timeSelect.hidden = !hasServiceItems;
    if (hasServiceItems) {
      const date = dateInput.value;
      const monday = date && new Date(`${date}T12:00:00`).getDay() === 1;
      const slotOptions =
        !date || monday
          ? []
          : buildTimeSlotOptions(date, duration, todayText, nowTimeStr);
      const previousTime = timeSelect.value;
      timeSelect.disabled = !date || monday;
      timeSelect.innerHTML =
        !date || monday
          ? `<option value="">Сначала выберите дату</option>`
          : `<option value="">Выберите время (${formatHours(duration)})</option>${slotOptions.map((opt) => `<option value="${opt.value}"${opt.disabled ? " disabled" : ""}>${escapeHtml(opt.label)}</option>`).join("")}`;
      const stillValid = slotOptions.some(
        (opt) => opt.value === previousTime && !opt.disabled,
      );
      timeSelect.value = stillValid ? previousTime : "";
    } else {
      timeSelect.value = "";
    }
    syncQuickSubmitState();
  }

  function renderGift() {
    const eligible = getGiftEligibleTotal();
    const progress = Math.min(100, (eligible / 12000) * 100);
    $("[data-gift-progress]").style.setProperty(
      "--progress",
      String(progress / 100),
    );
    const options = $("[data-gift-options]");
    const giftOption = state.items.find((item) => item.type === "gift");
    if (eligible >= 12000) {
      $("[data-gift-status]").textContent =
        "Подарок ваш — выберите в списке: уход-реконструкция кончиков / шелковый скранч";
      options.hidden = false;
      if (!giftOption) showGiftToastOnce();
      $$('input[name="gift"]', options).forEach((input) => {
        input.checked = Boolean(giftOption && giftOption.id === input.value);
      });
    } else {
      $("[data-gift-status]").textContent =
        `Осталось ${formatMoney(12000 - eligible)} до подарка`;
      options.hidden = true;
      if (giftOption)
        state.items = state.items.filter((item) => item.type !== "gift");
    }
  }

  function showGiftToastOnce() {
    if (!giftToastShown) {
      giftToastShown = true;
      showToast("Подарок разблокирован — выберите его в списке");
      track("gift_unlocked");
    }
  }

  function renderUpsells() {
    $("[data-upsells]").innerHTML = UPSELLS.map((item) => {
      const count =
        state.items.find(
          (cartItem) => cartItem.type === "upsell" && cartItem.id === item.id,
        )?.qty || 0;
      return `<div class="upsell-option"><span>${escapeHtml(item.name)} · +${formatMoney(item.price)}</span><button type="button" data-add-upsell="${item.id}" aria-label="${count ? "Добавлено" : "Добавить"}: ${escapeHtml(item.name)}">${count ? count : "+"}</button></div>`;
    }).join("");
  }

  function renderModes() {
    const unavailable = hasServices();
    $$('input[name="order-mode"]').forEach((input) => {
      input.disabled = unavailable && input.value !== "visit";
      input.checked = state.mode === input.value;
    });
    $("[data-mode-hint]").hidden = !unavailable;
  }

  function renderAppointmentFields() {
    const dateInput = $("#order-date");
    const timeLabel = $("[data-time-label]");
    const timeSelect = $("#order-time");
    const addressField = $("[data-address-field]");
    addressField.hidden = state.mode !== "delivery";
    addressField.querySelector("input").required = state.mode === "delivery";
    const today = new Date();
    const todayText = toDateValue(today);
    const nowTimeStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
    dateInput.min = todayText;
    const duration = longestService();
    if (state.mode !== "visit") {
      timeLabel.textContent = "Время получения (по договорённости)";
      timeSelect.hidden = true;
      timeSelect.value = "";
      state.slot.time = "";
    } else {
      const date = dateInput.value || state.slot.date;
      const monday = date && new Date(`${date}T12:00:00`).getDay() === 1;
      const busyInfo =
        date && !monday
          ? getBookedIntervalsForDate(date)
              .map((b) => `${minutesToTime(b.start)}–${minutesToTime(b.end)}`)
              .join(", ")
          : "";
      timeLabel.textContent = `Время визита (длительность: ${formatDuration(duration)}${busyInfo ? ` · занято: ${busyInfo}` : ""})`;
      timeSelect.hidden = false;
      const slotOptions =
        !date || monday
          ? []
          : buildTimeSlotOptions(date, duration, todayText, nowTimeStr);
      timeSelect.disabled = !date || monday;
      timeSelect.innerHTML =
        !date || monday
          ? `<option value="">Сначала выберите дату визита выше</option>`
          : `<option value="">Выберите время (${formatHours(duration)})</option>${slotOptions.map((opt) => `<option value="${opt.value}"${opt.disabled ? " disabled" : ""}>${escapeHtml(opt.label)}</option>`).join("")}`;
      const canKeep =
        state.slot.time &&
        !monday &&
        slotOptions.some(
          (opt) => opt.value === state.slot.time && !opt.disabled,
        );
      if (canKeep) timeSelect.value = state.slot.time;
      else {
        timeSelect.value = "";
        state.slot.time = "";
      }
    }
  }

  function renderTotals() {
    const totals = getTotals();
    $("[data-subtotal]").textContent = formatMoney(totals.subtotal);
    $("[data-pickup-discount-row]").hidden = totals.pickupDiscount <= 0;
    $("[data-pickup-discount]").textContent =
      `−${formatMoney(totals.pickupDiscount)}`;
    $("[data-promo-discount-row]").hidden = totals.promoDiscount <= 0;
    $("[data-promo-discount]").textContent =
      `−${formatMoney(totals.promoDiscount)}`;
    $("[data-delivery-row]").hidden = state.mode !== "delivery";
    $("[data-delivery]").textContent = totals.delivery
      ? formatMoney(totals.delivery)
      : "Бесплатно";
    $("[data-total]").textContent = formatMoney(totals.total);
  }

  function toDateValue(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function validDate(date) {
    if (
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      date < toDateValue(new Date())
    )
      return false;
    return new Date(`${date}T12:00:00`).getDay() !== 1;
  }

  function updateMessengerLinks() {
    const message = buildEstimate();
    const encoded = encodeURIComponent(message);
    $$("[data-telegram-link], [data-quick-telegram]").forEach((link) => {
      link.href = `https://t.me/share/url?url=&text=${encoded}`;
    });
    $$("[data-whatsapp-link], [data-quick-whatsapp]").forEach((link) => {
      link.href = `https://wa.me/79000000000?text=${encoded}`;
    });
  }

  function buildEstimate() {
    const customer = state.customer || {};
    const estimateItems = state.items.length
      ? state.items
      : getQuickOrderItems();
    const quickOnly = state.items.length === 0;
    const mode = quickOnly
      ? estimateItems.some((item) => item.type === "service")
        ? "visit"
        : "pickup"
      : state.mode;
    const quickPromo = $("[data-quick-promo]").value.trim().toUpperCase();
    const promo =
      quickPromo === "SILK15" ? "SILK15" : quickOnly ? null : state.promo;
    const lines = estimateItems.map((item) => {
      const product = productLabel(item);
      const qty = item.qty > 1 ? ` × ${item.qty}` : "";
      return `— ${product.title} · ${product.subtitle} · ${formatMoney(item.price)}${qty}`;
    });
    const totals = quickOnly
      ? (() => {
          const subtotal = estimateItems.reduce(
            (sum, item) => sum + item.price * item.qty,
            0,
          );
          const boxTotal = estimateItems
            .filter((item) => item.type === "box")
            .reduce((sum, item) => sum + item.price * item.qty, 0);
          const pickupDiscount =
            mode === "pickup" ? Math.round(boxTotal * 0.1) : 0;
          const promoDiscount =
            promo === "SILK15"
              ? Math.round(Math.max(0, subtotal - pickupDiscount) * 0.15)
              : 0;
          return {
            subtotal,
            pickupDiscount,
            promoDiscount,
            delivery: 0,
            total: Math.max(0, subtotal - pickupDiscount - promoDiscount),
          };
        })()
      : (() => {
          const totals = getTotals();
          if (quickPromo !== "SILK15" || state.promo === "SILK15")
            return totals;
          const promoDiscount = Math.round(
            Math.max(0, totals.subtotal - totals.pickupDiscount) * 0.15,
          );
          return {
            ...totals,
            promoDiscount,
            total: Math.max(0, totals.total - promoDiscount),
          };
        })();
    const modeLabel = {
      visit: "Визит в студию",
      pickup: "Самовывоз бокса",
      delivery: "Доставка бокса курьером по Москве",
    }[mode];
    const quickDate = quickOnly ? $("[data-quick-date]").value : "";
    const estimateDate = quickDate || state.slot.date;
    const date = estimateDate
      ? new Date(`${estimateDate}T12:00:00`).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
        })
      : "не выбрана";
    const consultFlag = quickOnly
      ? Boolean($("[data-quick-order-form]")?.elements?.consultation?.checked)
      : state.consultation;
    const totalDur = getServiceDuration(estimateItems, consultFlag);
    const chosenStart = quickOnly
      ? $("[data-quick-time]").value
      : state.slot.time;
    const startMin = timeToMinutes(chosenStart);
    const intervalText =
      startMin !== null && totalDur > 0
        ? `${chosenStart} — ${minutesToTime(startMin + totalDur)} (${formatDuration(totalDur)})`
        : chosenStart || "";
    return [
      "Заявка с сайта «ШЁЛК & ФОРМА»",
      `Имя: ${customer.name || "—"} · Телефон: ${customer.phone || "—"} · Ник: ${customer.messenger || "—"}`,
      `Формат: ${modeLabel}`,
      mode === "delivery" && customer.address
        ? `Адрес: ${customer.address}`
        : null,
      ...lines,
      estimateItems.some((item) => item.type === "gift")
        ? `Подарок: ${productLabel(estimateItems.find((item) => item.type === "gift")).title}`
        : null,
      totals.pickupDiscount
        ? `Скидка самовывоза: −${formatMoney(totals.pickupDiscount)}`
        : null,
      promo === "SILK15"
        ? `Промокод SILK15: −${formatMoney(totals.promoDiscount)}`
        : null,
      totals.delivery ? `Доставка: ${formatMoney(totals.delivery)}` : null,
      `ИТОГО: ${formatMoney(totals.total)}`,
      `Дата/слот: ${date}${intervalText ? `, ${intervalText}` : ""}`,
      `Консультация и тест-прядь: ${consultFlag ? "да (+15 мин учтено в слоте)" : "нет"}`,
      `Комментарий: ${customer.comment || "—"}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function showToast(message) {
    const toast = $("[data-toast]");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3000);
  }

  function openDrawer() {
    previousFocus = document.activeElement;
    const drawer = $("#cart-drawer");
    $("[data-overlay]").hidden = false;
    document.body.classList.add("has-overlay");
    requestAnimationFrame(() => {
      $("[data-overlay]").classList.add("is-visible");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
    });
    renderCart();
    $(".icon-button", drawer).focus();
    track("open_drawer");
  }

  function closeDrawer() {
    const drawer = $("#cart-drawer");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    hideOverlayWhenDone();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function hideOverlayWhenDone() {
    const overlay = $("[data-overlay]");
    overlay.classList.remove("is-visible");
    setTimeout(() => {
      if (!$("#cart-drawer").classList.contains("is-open") && !activeModal) {
        overlay.hidden = true;
        document.body.classList.remove("has-overlay");
      }
    }, 260);
  }

  function openModal(modal) {
    previousFocus = document.activeElement;
    activeModal = modal;
    $("[data-overlay]").hidden = false;
    document.body.classList.add("has-overlay");
    modal.hidden = false;
    requestAnimationFrame(() => {
      $("[data-overlay]").classList.add("is-visible");
      modal.classList.add("is-open");
      $(".modal-close", modal)?.focus();
    });
  }

  function closeModal(modal = activeModal) {
    if (!modal) return;
    modal.classList.remove("is-open");
    activeModal = null;
    setTimeout(() => {
      modal.hidden = true;
    }, 240);
    hideOverlayWhenDone();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function openLightbox(index) {
    const item = CASES[index];
    if (!item) return;
    const source = $$(".case-card .compare-frame")[index];
    const frame = source.cloneNode(true);
    delete frame.dataset.ready;
    frame.querySelector(".compare-range").value =
      source.querySelector(".compare-range").value;
    frame.style.setProperty(
      "--split",
      source.style.getPropertyValue("--split") || "50%",
    );
    $("[data-lightbox-title]").textContent = item.title;
    $("[data-lightbox-frame]").replaceChildren(frame);
    initComparisons();
    openModal($("[data-lightbox-modal]"));
  }

  function bookCase(index) {
    const item = CASES[index];
    if (!item) return;
    item.serviceIds.forEach((id) =>
      addItem({ id, type: "service", option: item.length }, null),
    );
    showToast("Услуга из кейса добавлена в запись");
    openDrawer();
  }

  function animatePrice(node, value) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = value;
      return;
    }
    node.classList.remove("price-changed");
    void node.offsetWidth;
    node.textContent = value;
    node.classList.add("price-changed");
    setTimeout(() => node.classList.remove("price-changed"), 220);
  }

  function switchFilter(filter) {
    activeFilter = filter;
    applyFilter();
    track("select_tab_catalog", { filter });
  }

  function renderQuizQuestion() {
    const questionNode = $("#quiz-question");
    const next = $("[data-quiz-next]");
    const back = $("[data-quiz-back]");
    $("[data-quiz-result]").hidden = true;
    questionNode.hidden = false;
    const question = QUIZ_QUESTIONS[quizStep];
    $("[data-quiz-step-label]").textContent = `Шаг ${quizStep + 1} из 4`;
    $("[data-quiz-percent]").textContent =
      `${Math.round(((quizStep + 1) / 4) * 100)}%`;
    $("[data-quiz-progress]").style.setProperty(
      "--progress",
      String((quizStep + 1) / 4),
    );
    questionNode.innerHTML = `<h3 class="quiz-question-title">${escapeHtml(question.title)}</h3><div class="quiz-options" role="radiogroup" aria-label="Шаг ${quizStep + 1}: ${escapeHtml(question.title)}">${question.answers.map((answer, index) => `<label class="quiz-option"><input type="radio" name="quiz-answer-${quizStep}" value="${index}" ${quizAnswers[quizStep] === index ? "checked" : ""}><span class="quiz-option-icon" aria-hidden="true">${question.icons[index]}</span><span>${escapeHtml(answer)}</span><span class="quiz-option-check" aria-hidden="true">↗</span></label>`).join("")}</div>`;
    back.disabled = quizStep === 0;
    next.textContent = quizStep === 3 ? "Показать рекомендацию" : "Далее";
    next.disabled = quizAnswers[quizStep] === null;
  }

  function recommendQuiz() {
    const story = quizAnswers[1];
    const desired = quizAnswers[2];
    const concern = quizAnswers[3];
    const length = LENGTHS[quizAnswers[0]].id;
    let serviceIds;
    let note = "";
    if (desired === 2) serviceIds = ["reconstruction", "haircut"];
    else if (story === 3) {
      serviceIds = ["color-correction"];
      note = "Второй визит — AirTouch";
    } else if (desired === 0) serviceIds = ["airtouch"];
    else serviceIds = ["gloss"];

    let boxId;
    if (concern === 0) boxId = "tokyo-box";
    else if (concern === 1) boxId = story === 2 ? "blond-box" : "volume-box";
    else {
      boxId = "volume-box";
      note = note
        ? `${note}; для объёма добавьте стрижку по форме`
        : "Для объёма добавьте стрижку по форме";
    }
    quizRecommendation = {
      serviceIds,
      boxId,
      length,
      note,
      boxOption: "travel",
    };
    track("quiz_complete", { serviceIds, boxId, length });
    showQuizResult();
  }

  function showQuizResult() {
    const question = $("#quiz-question");
    const result = $("[data-quiz-result]");
    question.hidden = true;
    result.hidden = false;
    $("[data-quiz-step-label]").textContent = "Ваша персональная рекомендация";
    $("[data-quiz-percent]").textContent = "Готово";
    $("[data-quiz-progress]").style.setProperty("--progress", "1");
    $("[data-quiz-back]").disabled = false;
    $("[data-quiz-next]").hidden = true;
    const selectedServices = quizRecommendation.serviceIds.map(getService);
    const box = getBox(quizRecommendation.boxId);
    const serviceSum = selectedServices.reduce(
      (sum, item) => sum + item.prices[quizRecommendation.length],
      0,
    );
    const boxPrice = box.prices[quizRecommendation.boxOption];
    result.innerHTML = `<h3>Ваша персональная рекомендация</h3><div class="recommendations">
      ${selectedServices.map((service) => `<article class="recommendation-card"><span class="eyebrow">Услуга</span><h4>${escapeHtml(service.name)}</h4><p>${escapeHtml(LENGTHS.find((item) => item.id === quizRecommendation.length).label)} · ${service.durations[quizRecommendation.length]} мин · ${formatMoney(service.prices[quizRecommendation.length])}</p></article>`).join("")}
      <article class="recommendation-card"><span class="eyebrow">Бокс · домашняя система</span><h4>${escapeHtml(box.name)}</h4><p>${escapeHtml(box.composition)}</p><div class="segment-control" role="group" aria-label="Объём рекомендованного бокса"><button type="button" data-quiz-box="travel" class="is-active" aria-pressed="true">Travel 3×100</button><button type="button" data-quiz-box="full" aria-pressed="false">Full-size 3×250</button></div><strong data-quiz-box-price>${formatMoney(boxPrice)}</strong></article>
      </div><p class="complex-total">Услуга + бокс = <span data-quiz-complex-total>${formatMoney(serviceSum + boxPrice)}</span> до скидок</p>
      ${quizRecommendation.note ? `<p class="field-hint">${escapeHtml(quizRecommendation.note)}</p>` : ""}
      <button class="button button-primary" type="button" data-add-quiz-complex>Добавить комплекс в запись</button>
      <div class="quiz-promo"><p>Промокод диагностики: <strong>SILK15</strong> — скидка <strong>15%</strong> на первый визит или бокс.</p><div class="quiz-promo-actions"><button class="button button-secondary" type="button" data-copy-promo>Скопировать код</button><button class="button button-secondary" type="button" data-apply-quiz-promo>Применить в корзине</button></div></div>
      <p class="quiz-disclaimer">Скидка действует один раз — на первую запись или первый бокс. Финальная смета подтверждается на бесплатной консультации.</p>`;
  }

  function updateQuizBox(option) {
    if (!quizRecommendation) return;
    quizRecommendation.boxOption = option;
    const box = getBox(quizRecommendation.boxId);
    const serviceSum = quizRecommendation.serviceIds.reduce(
      (sum, id) => sum + getService(id).prices[quizRecommendation.length],
      0,
    );
    $("[data-quiz-box-price]").textContent = formatMoney(box.prices[option]);
    $("[data-quiz-complex-total]").textContent = formatMoney(
      serviceSum + box.prices[option],
    );
    $$("[data-quiz-box]").forEach((button) => {
      const active = button.dataset.quizBox === option;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function addQuizComplex() {
    if (!quizRecommendation) return;
    quizRecommendation.serviceIds.forEach((id) => {
      addItem({ id, type: "service", option: quizRecommendation.length }, null);
    });
    addItem(
      {
        id: quizRecommendation.boxId,
        type: "box",
        option: quizRecommendation.boxOption,
      },
      null,
    );
    track("quiz_add_complex", {
      services: quizRecommendation.serviceIds,
      box: quizRecommendation.boxId,
    });
    showToast("Комплекс добавлен в запись");
    openDrawer();
  }

  async function copyPromo() {
    try {
      await navigator.clipboard.writeText("SILK15");
      showToast("Промокод скопирован");
    } catch (error) {
      const fallback = document.createElement("textarea");
      fallback.value = "SILK15";
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.append(fallback);
      fallback.select();
      const copied = document.execCommand("copy");
      fallback.remove();
      if (!copied)
        showToast("Не удалось скопировать код. Введите SILK15 вручную.");
      else showToast("Промокод скопирован");
    }
  }

  function applyPromo(value) {
    const message = $("[data-promo-message]");
    if (String(value).trim().toUpperCase() === "SILK15") {
      state.promo = "SILK15";
      message.textContent = "SILK15 · −15%";
      message.classList.remove("is-error");
      track("apply_promo_success");
      showToast("Промокод SILK15 применён");
    } else {
      state.promo = null;
      message.textContent = "Промокод не найден";
      message.classList.add("is-error");
      track("apply_promo_fail");
    }
    persist();
    renderCart();
  }

  function setPhoneMask(input) {
    let digits = input.value.replace(/\D/g, "");
    if (digits.startsWith("8")) digits = `7${digits.slice(1)}`;
    if (!digits.startsWith("7")) digits = `7${digits}`;
    digits = digits.slice(0, 11);
    const local = digits.slice(1);
    let formatted = "+7";
    if (local.length) formatted += ` (${local.slice(0, 3)}`;
    if (local.length >= 3) formatted += ")";
    if (local.length > 3) formatted += ` ${local.slice(3, 6)}`;
    if (local.length > 6) formatted += `-${local.slice(6, 8)}`;
    if (local.length > 8) formatted += `-${local.slice(8, 10)}`;
    input.value = formatted;
  }

  function setActionLock(nodes, locked) {
    nodes.forEach((node) => {
      if (!node) return;
      if ("disabled" in node) node.disabled = locked;
      node.setAttribute("aria-disabled", String(locked));
      node.style.opacity = locked ? "0.45" : "";
      node.style.cursor = locked ? "not-allowed" : "";
    });
  }

  function isDrawerFormReady() {
    const form = $("[data-order-form]");
    if (!form) return false;
    const name = form.elements.name.value.trim().length >= 2;
    const phone = form.elements.phone.value.replace(/\D/g, "").length === 11;
    const address =
      state.mode !== "delivery" ||
      (form.elements.address.value.trim().length >= 5 &&
        form.elements.address.value.trim().length <= 200);
    const consent = form.elements.consent.checked;
    const startMin = timeToMinutes(state.slot.time);
    const noConflict =
      startMin !== null &&
      !findSlotConflict(state.slot.date, startMin, longestService());
    const slotValid =
      state.mode === "visit"
        ? validDate(state.slot.date) && Boolean(state.slot.time) && noConflict
        : validDate(state.slot.date);
    return Boolean(
      state.items.length && name && phone && address && consent && slotValid,
    );
  }

  function isQuickFormReady() {
    const form = $("[data-quick-order-form]");
    if (!form) return false;
    const selectionValid =
      state.items.length > 0 || Boolean(getQuickSelectedItem());
    const nameValid = form.elements.name.value.trim().length >= 2;
    const phoneValid =
      form.elements.phone.value.replace(/\D/g, "").length === 11;
    const consentValid = form.elements.consent.checked;
    const dateValid = validDate(form.elements.date.value);
    const timeValid =
      !$("[data-quick-time]").required || Boolean(form.elements.time.value);
    return Boolean(
      selectionValid &&
      nameValid &&
      phoneValid &&
      consentValid &&
      dateValid &&
      timeValid,
    );
  }

  function syncSubmitState() {
    const ready = isDrawerFormReady();
    setActionLock(
      [
        $("[data-order-form] button[type=submit]"),
        $(".cart-drawer [data-open-sbp]"),
        $("[data-telegram-link]"),
        $("[data-whatsapp-link]"),
      ],
      !ready,
    );
    syncQuickSubmitState();
  }

  function syncQuickSubmitState() {
    const ready = isQuickFormReady();
    setActionLock(
      [
        $("[data-quick-order-form] button[type=submit]"),
        $(".quick-booking [data-open-sbp]"),
        $("[data-quick-telegram]"),
        $("[data-quick-whatsapp]"),
      ],
      !ready,
    );
  }

  function validateForm() {
    const form = $("[data-order-form]");
    let firstInvalid = null;
    const name = form.elements.name;
    const phone = form.elements.phone;
    const address = form.elements.address;
    const consent = form.elements.consent;
    const phoneDigits = phone.value.replace(/\D/g, "");
    const validations = [
      [
        name,
        name.value.trim().length >= 2,
        "Введите имя — не менее 2 символов.",
      ],
      [
        phone,
        phoneDigits.length === 11 && phoneDigits.startsWith("7"),
        "Введите телефон полностью: +7 (___) ___-__-__.",
      ],
      ...(state.mode === "delivery"
        ? [[
            address,
            address.value.trim().length >= 5 &&
              address.value.trim().length <= 200,
            "Укажите адрес доставки длиной от 5 до 200 символов.",
          ]]
        : []),
      [
        consent,
        consent.checked,
        "Поставьте галочку согласия на обработку персональных данных.",
      ],
    ];
    for (const [field, valid, errorText] of validations) {
      const errorNode = field.closest("label").querySelector(".form-error");
      if (errorNode) errorNode.textContent = valid ? "" : errorText;
      if (!valid && !firstInvalid) firstInvalid = field;
    }
    if (!consent.checked)
      showToast("Необходимо согласие на обработку персональных данных");
    if (state.items.length === 0 && !firstInvalid)
      firstInvalid = $("[data-open-cart]");
    if (state.mode === "visit") {
      const startMin = timeToMinutes(state.slot.time);
      const conflict =
        startMin !== null
          ? findSlotConflict(state.slot.date, startMin, longestService())
          : { text: "Выберите свободный интервал" };
      if (
        (!validDate(state.slot.date) || !state.slot.time || conflict) &&
        !firstInvalid
      ) {
        const date = $("#order-date");
        date.setCustomValidity(
          !validDate(state.slot.date)
            ? "Выберите будущую дату со вторника по воскресенье."
            : "",
        );
        date.reportValidity();
        firstInvalid = !validDate(state.slot.date) ? date : $("#order-time");
      }
    }
    if (
      state.mode !== "visit" &&
      !validDate(state.slot.date) &&
      !firstInvalid
    ) {
      const date = $("#order-date");
      date.setCustomValidity(
        "Выберите будущую дату со вторника по воскресенье.",
      );
      date.reportValidity();
      firstInvalid = date;
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function customerFromForm(form = $("[data-order-form]")) {
    state.customer = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      messenger: form.elements.messenger?.value.trim() || "",
      comment: form.elements.comment?.value.trim() || "",
      address: form.elements.address?.value.trim() || "",
      consent: form.elements.consent.checked,
    };
    return state.customer;
  }

  async function submitOrder(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const quick = form.matches("[data-quick-order-form]");
    if (quick) {
      if (!validateQuickOrder(form)) return;
      prepareQuickOrder(form);
    } else {
      customerFromForm();
      if (!validateForm()) return;
    }
    persist();
    const customer = customerFromForm(form);
    const payload = {
      items: state.items.map(({ id, type, option, qty }) => ({
        id,
        type,
        option,
        qty,
      })),
      promo: state.promo,
      mode: state.mode,
      slot: state.slot,
      consultation: state.consultation,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        messenger: customer.messenger.trim(),
        comment: customer.comment.trim(),
        address: customer.address.trim(),
        consent: Boolean(customer.consent),
      },
      website: form.elements.website.value,
    };
    const button = $("button[type=submit]", form);
    const originalText = button.textContent;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.classList.add("is-submitting");
    button.textContent = "Отправляем…";
    track("submit_order", { mode: state.mode });
    let demoFallback = location.hostname.endsWith("github.io");
    let orderId = "";
    let serverTotal;
    if (!demoFallback) {
      try {
        const response = await fetch("send.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.ok === true && !result.success) {
          demoFallback = true;
        } else if (!response.ok || !result.success) {
          throw new Error(result.error || "Не удалось отправить заявку.");
        } else {
          orderId = result.order_id || "";
          serverTotal = result.total;
        }
      } catch (error) {
        showToast(
          "Не удалось отправить заявку. Позвоните +7 (900) 000-00-00 или напишите в Telegram.",
        );
        button.classList.remove("is-submitting");
        button.removeAttribute("aria-busy");
        button.textContent = originalText;
        syncSubmitState();
        return;
      }
    }
    if (demoFallback) {
      orderId = `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      showToast("Демо-режим: серверная отправка недоступна.");
    }
    finishOrder({ orderId, demo: demoFallback, quick, serverTotal });
  }

  function validateQuickOrder(form) {
    let firstInvalid = null;
    const errors = [
      [
        form.elements.name,
        form.elements.name.value.trim().length >= 2,
        "Введите имя — не менее 2 символов.",
      ],
      [
        form.elements.phone,
        form.elements.phone.value.replace(/\D/g, "").length === 11,
        "Введите телефон полностью: +7 (___) ___-__-__.",
      ],
      [
        form.elements.date,
        validDate(form.elements.date.value),
        "Выберите будущую дату со вторника по воскресенье.",
      ],
      [
        form.elements.consent,
        form.elements.consent.checked,
        "Поставьте галочку согласия на обработку персональных данных.",
      ],
    ];
    if (!state.items.length && !getQuickSelectedItem()) {
      errors.unshift([
        form.elements.product,
        false,
        "Выберите услугу или бокс.",
      ]);
    }
    if ($("[data-quick-time]").required) {
      errors.splice(3, 0, [
        form.elements.time,
        Boolean(form.elements.time.value),
        "Выберите свободный интервал визита.",
      ]);
    }
    const promo = form.elements.promo.value.trim().toUpperCase();
    if (promo && promo !== "SILK15")
      errors.push([
        form.elements.promo,
        false,
        "Промокод не найден. Используйте SILK15 или оставьте поле пустым.",
      ]);
    for (const [field, valid, message] of errors) {
      const errorNode = field.closest("label")?.querySelector(".form-error");
      if (errorNode) errorNode.textContent = valid ? "" : message;
      if (!valid && !firstInvalid) firstInvalid = field;
    }
    if (!form.elements.consent.checked)
      showToast("Поставьте галочку согласия на обработку ПДн");
    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function prepareQuickOrder(form) {
    const hasCart = state.items.length > 0;
    if (!hasCart) {
      const selectedItem = getQuickSelectedItem();
      state.items = [selectedItem];
    }
    state.mode = hasServices() ? "visit" : hasCart ? state.mode : "pickup";
    state.promo =
      form.elements.promo.value.trim().toUpperCase() === "SILK15"
        ? "SILK15"
        : hasCart
          ? state.promo
          : null;
    state.slot = {
      date: form.elements.date.value,
      time: hasServices() ? form.elements.time.value : "",
    };
    state.consultation = form.elements.consultation.checked;
    state.customer = {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      messenger: "",
      comment: "",
      consent: form.elements.consent.checked,
    };
  }

  function finishOrder({
    orderId = "",
    demo = false,
    quick = false,
    serverTotal,
  } = {}) {
    const total = Number.isFinite(serverTotal)
      ? formatMoney(serverTotal)
      : formatMoney(getTotals().total);
    const totalDur = longestService();
    const startMin = timeToMinutes(state.slot.time);
    const bookedRange =
      state.mode === "visit" && startMin !== null && totalDur > 0
        ? ` Забронирован слот: ${state.slot.date}, ${state.slot.time} — ${minutesToTime(startMin + totalDur)} (${formatDuration(totalDur)}).`
        : "";
    if (
      state.mode === "visit" &&
      state.slot.date &&
      state.slot.time &&
      totalDur > 0
    ) {
      saveBookingInterval(state.slot.date, state.slot.time, totalDur);
    }
    $("[data-success-reference]").textContent =
      `${demo ? "Демо-номер заявки" : "Номер заявки"}: ${orderId || "—"}`;
    $(".success-total").textContent =
      `Итог сметы: ${total}${state.promo === "SILK15" ? ", промокод SILK15 учтён." : ""}.${bookedRange}`;
    $("[data-success-copy]").textContent = demo
      ? "Это демонстрационная заявка: выбранный слот зафиксирован в расписании."
      : "Анна подтвердит слот в течение 1–2 часов (Вт–Вс 10:00–20:00).";
    if (!quick) closeDrawer();
    openModal($("[data-success-modal]"));
    state = emptyState();
    persist();
    renderCart();
    const form = $("[data-order-form]");
    form.reset();
    form.elements.phone.value = "";
    form.querySelectorAll(".form-error").forEach((node) => {
      node.textContent = "";
    });
    const quickForm = $("[data-quick-order-form]");
    quickForm.reset();
    quickForm.querySelectorAll(".form-error").forEach((node) => {
      node.textContent = "";
    });
    renderQuickBooking();
    updateMessengerLinks();
  }

  function openPolicy(type) {
    const content = $("[data-policy-content]");
    if (type === "privacy") {
      content.innerHTML = `<p class="eyebrow">Информация для клиентов</p><h2 id="policy-title">Политика обработки персональных данных</h2>
        <p>Студия «ШЁЛК &amp; ФОРМА» использует данные, которые вы указываете в форме записи (имя, телефон, ник в мессенджере и комментарий), только для связи с вами, подтверждения выбранного времени и исполнения заказа.</p>
        <h3>Какие данные обрабатываются</h3><p>Имя, номер телефона, добровольно указанные контактные данные и комментарий к визиту. Согласие на обработку требуется до отправки заявки.</p>
        <h3>Хранение и безопасность</h3><p>Данные используются для подготовки и подтверждения записи, не публикуются и не передаются третьим лицам, кроме случаев, необходимых для исполнения заказа или предусмотренных законом.</p>
        <h3>Ваши права</h3><p>Вы можете уточнить, исправить или попросить удалить данные, связавшись по телефону +7 (900) 000-00-00.</p>`;
    } else {
      content.innerHTML = `<p class="eyebrow">Понятные условия до записи</p><h2 id="policy-title">Условия записи, отмены и гарантии 14 дней</h2>
        <h3>Фиксация записи</h3><p>Выбранные услуга, длина волос, состав заказа, цена и длительность фиксируются в смете до начала работы.</p>
        <h3>Подтверждение и отмена</h3><p>Анна подтверждает слот в течение 1–2 часов в рабочее время: Вт–Вс 10:00–20:00. Бесплатно отменить или перенести запись можно не позднее чем за 24 часа до визита.</p>
        <h3>Гарантия 14 дней</h3><p>Если оттенок изменился или форма стрижки после визита села не так, как было согласовано, свяжитесь с Анной в течение 14 дней для бесплатной коррекции.</p>`;
    }
    openModal($("[data-policy-modal]"));
  }

  function onClick(event) {
    const target = event.target.closest("button, a, summary");
    if (!target) return;

    if (target.matches("[data-clear-cart]")) {
      event.preventDefault();
      clearAllCart();
      return;
    }

    if (target.matches('.brand[href="#top"]')) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMobileMenu();
      return;
    }

    // Жесткая проверка заполнения формы и согласия ПДн при клике на СБП и Мессенджеры
    if (target.matches("[data-open-sbp]")) {
      const inQuick = Boolean(target.closest(".quick-booking"));
      const ok = inQuick
        ? validateQuickOrder($("[data-quick-order-form]"))
        : validateForm();
      if (!ok) {
        event.preventDefault();
        return;
      }
      track("click_sbp");
      openModal($("[data-sbp-modal]"));
      return;
    }

    if (
      target.matches(
        "[data-telegram-link], [data-whatsapp-link], [data-quick-telegram], [data-quick-whatsapp]",
      )
    ) {
      const inQuick = target.matches(
        "[data-quick-telegram], [data-quick-whatsapp]",
      );
      const ok = inQuick
        ? validateQuickOrder($("[data-quick-order-form]"))
        : validateForm();
      if (!ok) {
        event.preventDefault();
        return;
      }
      track("click_messenger", {
        channel: target.href.includes("wa.me") ? "whatsapp" : "telegram",
      });
      return;
    }

    if (
      target.matches(
        ".catalog-card[data-card-type=service] .segment-control button",
      )
    ) {
      const card = target.closest(".catalog-card");
      const product = getService(card.dataset.id);
      const option = target.dataset.option;
      $$(".segment-control button", card).forEach((button) => {
        button.classList.toggle("is-active", button === target);
        button.setAttribute("aria-pressed", String(button === target));
      });
      animatePrice(
        $("[data-price]", card),
        formatMoney(product.prices[option]),
      );
      $("[data-duration]", card).textContent = formatDuration(
        product.durations[option],
      );
      const showcaseDuration = $("[data-showcase-duration]", card);
      if (showcaseDuration)
        showcaseDuration.textContent = formatDuration(
          product.durations[option],
        );
      track("select_length", { id: product.id, option });
      return;
    }

    if (
      target.matches(
        ".catalog-card[data-card-type=box] .segment-control button",
      )
    ) {
      const card = target.closest(".catalog-card");
      const box = getBox(card.dataset.id);
      $$(".segment-control button", card).forEach((button) => {
        button.classList.toggle("is-active", button === target);
        button.setAttribute("aria-pressed", String(button === target));
      });
      animatePrice(
        $("[data-price]", card),
        formatMoney(box.prices[target.dataset.option]),
      );
      $("[data-volume-label]", card).textContent =
        target.dataset.option === "travel"
          ? "Travel-сет 3×100 мл"
          : "Full-size набор 3×250 мл";
      return;
    }

    if (target.matches("[data-open-cart]")) {
      event.preventDefault();
      openDrawer();
      return;
    }
    if (target.matches("[data-close-cart]")) {
      closeDrawer();
      return;
    }
    if (target.matches("[data-close-modal]")) {
      closeModal(target.closest(".modal"));
      return;
    }
    if (target.matches("[data-open-policy]")) {
      openPolicy(target.dataset.openPolicy);
      return;
    }
    if (target.matches("[data-open-lightbox]")) {
      openLightbox(Number(target.dataset.openLightbox));
      return;
    }
    if (target.matches("[data-book-case]")) {
      bookCase(Number(target.dataset.bookCase));
      return;
    }
    if (target.matches("[data-filter]")) {
      switchFilter(target.dataset.filter);
      return;
    }

    if (target.matches("[data-add-service]")) {
      const card = target.closest(".catalog-card");
      const service = getService(target.dataset.addService);
      const option = $(".segment-control .is-active", card).dataset.option;
      const length = LENGTHS.find((item) => item.id === option);
      addItem(
        { id: service.id, type: "service", option },
        `${service.name} (${length.label.toLowerCase()}) добавлено в запись`,
      );
      openDrawer();
      return;
    }

    if (target.matches("[data-add-box]")) {
      const card = target.closest(".catalog-card");
      const option = $(".segment-control .is-active", card).dataset.option;
      addItem(
        { id: target.dataset.addBox, type: "box", option },
        `${getBox(target.dataset.addBox).name} добавлен в запись`,
      );
      openDrawer();
      return;
    }

    if (target.matches("[data-add-upsell]")) {
      addItem(
        { id: target.dataset.addUpsell, type: "upsell", option: "standard" },
        `${getUpsell(target.dataset.addUpsell).name} добавлено`,
      );
      track("add_upsell", { id: target.dataset.addUpsell });
      return;
    }

    if (target.matches("[data-remove-item]")) {
      removeItem(target.dataset.removeItem);
      return;
    }

    if (target.matches("[data-qty]")) {
      const item = state.items.find(
        (current) => itemKey(current) === target.dataset.itemKey,
      );
      if (item) {
        item.qty = Math.max(
          1,
          Math.min(20, item.qty + Number(target.dataset.qty)),
        );
        persist();
        renderCart();
      }
      return;
    }

    if (target.matches("[data-copy-promo]")) {
      copyPromo();
      return;
    }
    if (target.matches("[data-apply-quiz-promo]")) {
      $("#promo-input").value = "SILK15";
      applyPromo("SILK15");
      openDrawer();
      return;
    }
    if (target.matches("[data-apply-promo]")) {
      applyPromo($("#promo-input").value);
      return;
    }

    if (target.matches("[data-quiz-next]")) {
      if (quizAnswers[quizStep] === null) return;
      track(`quiz_step_${quizStep + 1}`, { answer: quizAnswers[quizStep] });
      if (quizStep === 3) recommendQuiz();
      else {
        quizStep += 1;
        renderQuizQuestion();
      }
      return;
    }

    if (target.matches("[data-quiz-back]")) {
      if (!$("[data-quiz-result]").hidden) {
        $("[data-quiz-next]").hidden = false;
        quizStep = 3;
        quizRecommendation = null;
        renderQuizQuestion();
      } else if (quizStep > 0) {
        quizStep -= 1;
        renderQuizQuestion();
      }
      return;
    }

    if (target.matches("[data-quiz-box]")) {
      updateQuizBox(target.dataset.quizBox);
      return;
    }
    if (target.matches("[data-add-quiz-complex]")) {
      addQuizComplex();
      return;
    }

    if (target.matches("[data-box-link]")) {
      activeFilter = "boxes";
      applyFilter();
      track("select_tab_catalog", { filter: "boxes" });
      const menu = $("#mobile-menu");
      if (!menu.hidden) closeMobileMenu();
      return;
    }

    if (
      target.matches(
        ".desktop-nav a, .mobile-menu a, .site-footer nav a, .hero-ctas a, .mobile-bookbar a",
      )
    ) {
      if (target.hash === "#quiz") track("quiz_start");
      const menu = $("#mobile-menu");
      if (!menu.hidden) closeMobileMenu();
    }
  }

  function closeMobileMenu() {
    const menu = $("#mobile-menu");
    menu.hidden = true;
    $(".menu-toggle").setAttribute("aria-expanded", "false");
  }

  function onChange(event) {
    const target = event.target;
    if (
      target.matches(
        'input[name="quiz-answer-0"], input[name="quiz-answer-1"], input[name="quiz-answer-2"], input[name="quiz-answer-3"]',
      )
    ) {
      quizAnswers[quizStep] = Number(target.value);
      $("[data-quiz-next]").disabled = false;
    }
    if (target.matches('input[name="gift"]')) {
      const giftId = target.value;
      state.items = state.items.filter((item) => item.type !== "gift");
      addItem({ id: giftId, type: "gift", option: "gift" }, null);
    }
    if (target.matches('input[name="order-mode"]')) {
      state.mode = target.value;
      if (state.mode === "visit") state.slot.time = "";
      persist();
      renderCart();
    }
    if (target.matches("[data-quick-product]")) {
      const error = target
        .closest(".quick-selection")
        .querySelector(".form-error");
      if (error && target.value) error.textContent = "";
      renderQuickBooking();
      updateMessengerLinks();
    }
    if (target.matches("[data-quick-date]")) {
      target.setCustomValidity(
        validDate(target.value)
          ? ""
          : "Выберите будущую дату со вторника по воскресенье.",
      );
      const error = target.closest("label").querySelector(".form-error");
      if (error && validDate(target.value)) error.textContent = "";
      renderQuickBooking();
      updateMessengerLinks();
    }
    if (target.matches("[data-quick-time]")) {
      const error = target.closest("label").querySelector(".form-error");
      if (error && target.value) error.textContent = "";
      syncQuickSubmitState();
      updateMessengerLinks();
    }
    if (target.matches('.quick-order-form [name="consultation"]')) {
      renderQuickBooking();
      updateMessengerLinks();
    }
    if (target.matches("#order-date")) {
      target.setCustomValidity(
        validDate(target.value)
          ? ""
          : "Понедельник и прошедшие даты недоступны.",
      );
      state.slot.date = target.value;
      if (!validDate(target.value)) {
        state.slot.time = "";
        showToast("Выберите будущую дату со вторника по воскресенье.");
      }
      renderAppointmentFields();
      persist();
      syncSubmitState();
    }
    if (target.matches("#order-time")) {
      state.slot.time = target.value;
      persist();
      syncSubmitState();
    }
    if (target.matches("[data-consultation]")) {
      state.consultation = target.checked;
      renderAppointmentFields();
      updateMessengerLinks();
      persist();
    }
    if (target.matches('[name="consent"]')) {
      const error = target.closest("label").querySelector(".form-error");
      if (error && target.checked) error.textContent = "";
      syncSubmitState();
    }
  }

  function onInput(event) {
    const target = event.target;
    if (target.matches('[name="phone"]')) {
      setPhoneMask(target);
      state.customer.phone = target.value;
      const error = target.closest("label").querySelector(".form-error");
      if (error && target.value.replace(/\D/g, "").length === 11)
        error.textContent = "";
      syncSubmitState();
    } else if (
      target.matches(
        '[name="name"], [name="messenger"], [name="comment"], [name="address"]',
      )
    ) {
      state.customer[target.name] = target.value;
      if (target.name === "name") {
        const error = target.closest("label").querySelector(".form-error");
        if (error && target.value.trim().length >= 2) error.textContent = "";
      }
      if (target.name === "address") {
        const error = target.closest("label").querySelector(".form-error");
        if (error && target.value.trim().length >= 5) error.textContent = "";
      }
      syncSubmitState();
      updateMessengerLinks();
    } else if (target.matches("#promo-input")) {
      $("[data-promo-message]").textContent = "";
      $("[data-promo-message]").classList.remove("is-error");
    } else if (target.matches("[data-quick-promo]")) {
      const error = target.closest("label").querySelector(".form-error");
      if (error) error.textContent = "";
      renderQuickBooking();
      updateMessengerLinks();
    }
  }

  function initPageObservers() {
    if (!("IntersectionObserver" in window)) {
      $$("main > section:not(.hero)").forEach((section) =>
        section.classList.add("is-visible"),
      );
      return;
    }

    const header = $(".site-header");
    const headerSentinel = $("[data-header-sentinel]");
    if (headerSentinel) {
      const headerObserver = new IntersectionObserver(([entry]) => {
        header.classList.toggle("is-scrolled", !entry.isIntersecting);
      });
      headerObserver.observe(headerSentinel);
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
    $$("main > section:not(.hero)").forEach((section) => {
      section.classList.add("section-reveal");
      revealObserver.observe(section);
    });
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      if (activeModal) closeModal();
      else if ($("#cart-drawer").classList.contains("is-open")) closeDrawer();
      else closeMobileMenu();
    }
    if (event.key === "Tab" && activeModal) trapFocus(event, activeModal);
    if (event.key === "Tab" && $("#cart-drawer").classList.contains("is-open"))
      trapFocus(event, $("#cart-drawer"));
  }

  function trapFocus(event, container) {
    const focusable = $$(
      'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), textarea, select, [tabindex]:not([tabindex="-1"])',
      container,
    ).filter((item) => !item.hidden && item.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function init() {
    renderCatalog();
    renderCases();
    renderReviewsAndFaq();
    renderQuizQuestion();
    renderCart();
    initComparisons();
    $(".site-header").classList.toggle("is-scrolled", window.scrollY > 80);
    $("#order-date").value = state.slot.date || "";
    $("[data-consultation]").checked = state.consultation;
    const quickForm = $("[data-quick-order-form]");
    quickForm.elements.consultation.checked = state.consultation;
    quickForm.elements.date.value = state.slot.date || "";
    renderQuickBooking();
    quickForm.elements.time.value = state.slot.time || "";
    syncSubmitState();
    updateMessengerLinks();

    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    document.addEventListener("keydown", onKeydown);
    initPageObservers();
    $("[data-overlay]").addEventListener("click", () => {
      if (activeModal) closeModal();
      else closeDrawer();
    });
    $("[data-order-form]").addEventListener("submit", submitOrder);
    $("[data-quick-order-form]").addEventListener("submit", submitOrder);
    $(".menu-toggle").addEventListener("click", (event) => {
      const menu = $("#mobile-menu");
      const open = menu.hidden;
      menu.hidden = !open;
      event.currentTarget.setAttribute("aria-expanded", String(open));
    });
    $("#order-date").addEventListener("input", (event) =>
      event.target.setCustomValidity(""),
    );
    $("#order-date").addEventListener("blur", (event) => {
      if (event.target.value && !validDate(event.target.value))
        event.target.setCustomValidity(
          "Понедельник и прошедшие даты недоступны.",
        );
    });
    renderCart();
  }

  init();
})();
