"use strict";

/* ---------- CONFIG (edit these) ---------- */
const STORAGE_KEY_PRODUCTS = "asianproducts_products";
const STORAGE_KEY_CART = "asianproducts_cart";
const DELIVERY_FEE = 600; // د.ج — عدّل هذا الرقم فقط لتغيير رسوم التوصيل في كل الموقع

// TODO: ضع أرقام واتساب الحقيقية بصيغة دولية بدون "+" وبدون أصفار زائدة.
// مثال جزائري: رقم 0555 12 34 56 يصبح "213555123456"
const WHATSAPP_NUMBERS = {
  primary: "213673421661", // TODO: الرقم الأول (الأساسي)
  secondary: "213500000001", // TODO: الرقم الثاني (احتياطي)
};

const CATEGORIES = [
  { id: "all", label: "الكل" },
  { id: "food", label: "أطعمة ومشروبات" },
  { id: "care", label: "عناية وجمال" },
  { id: "accessories", label: "إكسسوارات" },
];

const ALGERIA_WILAYAS = [
  "أدرار", "الشلف", "الأغواط", "أم البواقي", "باتنة", "بجاية", "بسكرة", "بشار",
  "البليدة", "البويرة", "تمنراست", "تبسة", "تلمسان", "تيارت", "تيزي وزو", "الجزائر",
  "الجلفة", "جيجل", "سطيف", "سعيدة", "سكيكدة", "سيدي بلعباس", "عنابة", "قالمة",
  "قسنطينة", "المدية", "مستغانم", "المسيلة", "معسكر", "ورقلة", "وهران", "البيض",
  "إليزي", "برج بوعريريج", "بومرداس", "الطارف", "تندوف", "تيسمسيلت", "الوادي",
  "خنشلة", "سوق أهراس", "تيبازة", "ميلة", "عين الدفلى", "النعامة", "عين تموشنت",
  "غرداية", "غليزان", "تيميمون", "برج باجي مختار", "أولاد جلال", "بني عباس",
  "عين صالح", "عين قزام", "تقرت", "جانت", "المغير", "المنيعة",
];

/* ---------- SEED PRODUCTS (used only the first time, if storage is empty) ---------- */
const SEED_PRODUCTS = [
  {
    id: "p1",
    sku: "ASN-CN-9018",
    name: "صابون شامبو صلب بخلاصة أوراق السرو — Suzuki Sasaki",
    category: "care",
    categoryLabel: "عناية وجمال",
    price: 1800,
    originCountry: "غير محدد",
    images: ["assets/products/product-01-suzuki-shampoo-a.jpg", "assets/products/product-01-suzuki-shampoo-b.jpg"],
    description: "شامبو صلب بتصميم مثلث مميز، مصنوع بخلاصة أوراق السرو الشرقي (Cacumen Biotae). يأتي في علبة أنيقة بخط ذهبي على خلفية داكنة.",
    ingredients: ["خلاصة أوراق السرو الشرقي (Cacumen Biotae)"],
    specifications: [
      { label: "الشكل", value: "صابون شامبو صلب (بار)" },
      { label: "التصميم", value: "علبة مثلثة" },
    ],
    available: true,
  },
  {
    id: "p2",
    sku: "ASN-JP-8966",
    name: "فيتغم كولاجين 20X — قهوة الشيا",
    category: "food",
    categoryLabel: "أطعمة ومشروبات",
    price: 3200,
    originCountry: "اليابان",
    images: ["assets/products/product-02-fitgum-coffee-pouch.jpg", "assets/products/product-02-fitgum-coffee-sachet.jpg"],
    description: "خليط قهوة 11 في 1 يجمع بين الكولاجين والجلوتاثيون وبذور الشيا. مدعوم بتقنية يابانية، ويأتي على شكل أكياس فردية سهلة التحضير.",
    ingredients: ["كولاجين", "جلوتاثيون", "بذور الشيا", "قهوة"],
    specifications: [
      { label: "الوزن الصافي", value: "120 غرام (10 أكياس × 12 غرام)" },
      { label: "الاعتماد", value: "معتمد من FDA" },
    ],
    available: true,
  },
  {
    id: "p3",
    sku: "ASN-XX-9015",
    name: "ADEX VEDA كريم مرطب بالكافيين والريتينول",
    category: "care",
    categoryLabel: "عناية وجمال",
    price: 2400,
    originCountry: "غير محدد",
    images: ["assets/products/product-03-adexveda-cream.jpg"],
    description: "كريم مرطب طبيعي يجمع بين الريتينول والكافيين بتركيبة Osmotic Force Max لترطيب البشرة وتنشيطها.",
    ingredients: ["ريتينول", "كافيين"],
    specifications: [{ label: "النوع", value: "كريم مرطب طبيعي" }],
    available: true,
  },
  {
    id: "p4",
    sku: "ASN-JP-9012",
    name: "Pure Beauty Collagen — مسحوق كولاجين بحري ياباني",
    category: "food",
    categoryLabel: "أطعمة ومشروبات",
    price: 3500,
    originCountry: "اليابان",
    images: ["assets/products/product-04-pure-beauty-collagen.jpg"],
    description: "مسحوق كولاجين بحري بجودة يابانية لتغذية البشرة، يحتوي على خلاصة حبوب الكوإكس وحمض الهيالورونيك و CoQ10. صُنع في اليابان.",
    ingredients: ["كولاجين بحري (100,000 ملغ)", "خلاصة حبوب الكوإكس", "حمض الهيالورونيك", "CoQ10"],
    specifications: [
      { label: "الوزن الصافي", value: "100 غرام" },
      { label: "بلد الصنع", value: "اليابان" },
    ],
    available: true,
  },
  {
    id: "p5",
    sku: "ASN-CN-8971",
    name: "Sumifun لاصقة تخفيف آلام الركبة",
    category: "care",
    categoryLabel: "عناية وجمال",
    price: 900,
    originCountry: "غير محدد",
    images: ["assets/products/product-05-meniscus-patch.jpg"],
    description: "لاصقات لتخفيف آلام الركبة والمفاصل، مناسبة لحالات التواء الركبة وآلام الغضروف الهلالي.",
    ingredients: [],
    specifications: [{ label: "عدد القطع", value: "4 قطع" }],
    available: true,
  },
  {
    id: "p6",
    sku: "ASN-CN-8972",
    name: "Sumifun مرهم تخفيف آلام الركبة",
    category: "care",
    categoryLabel: "عناية وجمال",
    price: 1100,
    originCountry: "غير محدد",
    images: ["assets/products/product-06-meniscus-ointment.jpg"],
    description: "مرهم لتخفيف آلام الركبة والعظام والمفاصل، ومناسب لإراحة إزعاج الغضروف الهلالي.",
    ingredients: [],
    specifications: [{ label: "الوزن", value: "40 غرام" }],
    available: true,
  },
  {
    id: "p7",
    sku: "ASN-XX-8967",
    name: "مسحوق ماتشا عضوي",
    category: "food",
    categoryLabel: "أطعمة ومشروبات",
    price: 2200,
    originCountry: "غير محدد",
    images: ["assets/products/product-07-matcha-powder.jpg"],
    description: "مسحوق شاي أخضر ماتشا عضوي 100%، خالٍ من الغلوتين ومنتجات الألبان، ومناسب للنظام النباتي الصرف.",
    ingredients: ["مسحوق شاي أخضر (ماتشا) عضوي"],
    specifications: [{ label: "الوزن الصافي", value: "100 غرام" }],
    available: true,
  },
  {
    id: "p8",
    sku: "ASN-XX-8969",
    name: "Googeer شاي ديتوكس بنكهة الخوخ",
    category: "food",
    categoryLabel: "أطعمة ومشروبات",
    price: 1600,
    originCountry: "غير محدد",
    images: ["assets/products/product-08-detox-tea.jpg"],
    description: "شاي منشط لتنظيف الجسم بنكهة الخوخ الطبيعية، يأتي في عبوة تحتوي على 28 كيس شاي.",
    ingredients: [],
    specifications: [{ label: "عدد الأكياس", value: "28 كيس شاي" }],
    available: true,
  },
];

/* ---------- Small utilities ---------- */

// Escapes a string before it is ever inserted via innerHTML, to prevent XSS
// from product data that came from the admin form (localStorage).
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatPrice(value) {
  const number = Number(value) || 0;
  return `${number.toLocaleString("en-US")} د.ج`;
}

/* ---------- Product storage ---------- */
function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PRODUCTS;
  }
}

/* ---------- Cart storage ---------- */
function getCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  } catch {
    /* storage unavailable — ignore */
  }
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function cartItemsCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/* ---------- App state ---------- */
let products = [];
let activeCategory = "all";
let openProductId = null;
let drawerQuantity = 1;
let pendingOrder = null; // order text waiting to be sent through the WhatsApp modal

/* ---------- DOM refs (populated on init) ---------- */
const dom = {};

function cacheDom() {
  dom.categoryFilters = document.getElementById("category-filters");
  dom.productGrid = document.getElementById("product-grid");

  dom.productOverlay = document.getElementById("product-overlay");
  dom.productDrawer = document.getElementById("product-drawer");
  dom.productDrawerContent = document.getElementById("product-drawer-content");
  dom.productDrawerClose = document.getElementById("product-drawer-close");

  dom.cartOverlay = document.getElementById("cart-overlay");
  dom.cartDrawer = document.getElementById("cart-drawer");
  dom.cartDrawerBody = document.getElementById("cart-drawer-body");
  dom.cartDrawerClose = document.getElementById("cart-drawer-close");

  dom.cartBadge = document.getElementById("cart-badge");
  dom.cartBadgeMobile = document.getElementById("cart-badge-mobile");

  dom.waOverlay = document.getElementById("wa-overlay");
  dom.waModal = document.getElementById("wa-modal");
  dom.waOptionPrimary = document.getElementById("wa-option-primary");
  dom.waOptionSecondary = document.getElementById("wa-option-secondary");
  dom.waCancel = document.getElementById("wa-cancel");

  dom.toast = document.getElementById("toast");
  dom.menuToggle = document.getElementById("menu-toggle");
  dom.mobileMenu = document.getElementById("mobile-menu");
}

/* ---------- Toast ---------- */
let toastTimeout = null;
function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => dom.toast.classList.remove("is-visible"), 2600);
}

/* ---------- Category filters ---------- */
function renderCategoryFilters() {
  dom.categoryFilters.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "category-filters__pill" + (activeCategory === cat.id ? " is-active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(activeCategory === cat.id));
    btn.textContent = cat.label;
    btn.addEventListener("click", () => {
      activeCategory = cat.id;
      renderCategoryFilters();
      renderProductGrid();
    });
    dom.categoryFilters.appendChild(btn);
  });
}

/* ---------- Product grid ---------- */
function getFilteredProducts() {
  const visible = products.filter((p) => p.available !== false);
  if (activeCategory === "all") return visible;
  return visible.filter((p) => p.category === activeCategory);
}

function renderProductGrid() {
  const list = getFilteredProducts();
  dom.productGrid.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "product-grid__empty";
    empty.textContent = "لا توجد منتجات في هذه الفئة.";
    dom.productGrid.appendChild(empty);
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = (product.images && product.images[0]) || "";

    card.innerHTML = `
      <button type="button" class="product-card__image-btn" data-open-product="${escapeHTML(product.id)}" aria-label="عرض تفاصيل ${escapeHTML(product.name)}">
        <img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" class="product-card__image" loading="lazy" />
      </button>
      <div class="product-card__body">
        <p class="product-card__category">${escapeHTML(product.categoryLabel || "")}</p>
        <button type="button" class="product-card__name" data-open-product="${escapeHTML(product.id)}">${escapeHTML(product.name)}</button>
        <p class="product-card__price">${formatPrice(product.price)}</p>
        <button type="button" class="btn btn-primary btn-block product-card__cta" data-add-to-cart="${escapeHTML(product.id)}">أضف إلى السلة</button>
      </div>
    `;

    dom.productGrid.appendChild(card);
  });
}

/* ---------- Product drawer ---------- */
function openProductDrawer(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  openProductId = productId;
  drawerQuantity = 1;
  renderProductDrawer(product, product.images[0]);

  dom.productOverlay.classList.add("is-visible");
  dom.productDrawer.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeProductDrawer() {
  dom.productOverlay.classList.remove("is-visible");
  dom.productDrawer.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  openProductId = null;
}

function renderProductDrawer(product, activeImage) {
  const gallery = product.images || [];
  const thumbsHTML =
    gallery.length > 1
      ? `<div class="product-drawer__thumbs">
          ${gallery
            .map(
              (img, index) => `
            <button type="button" class="product-drawer__thumb${img === activeImage ? " is-active" : ""}" data-thumb-index="${index}" aria-label="صورة ${index + 1}">
              <img src="${escapeHTML(img)}" alt="" />
            </button>`
            )
            .join("")}
        </div>`
      : "";

  const ingredientsHTML =
    product.ingredients && product.ingredients.length > 0
      ? `<div class="product-drawer__section">
          <h3>المكونات</h3>
          <ul>${product.ingredients.map((i) => `<li>${escapeHTML(i)}</li>`).join("")}</ul>
        </div>`
      : "";

  const specsHTML =
    product.specifications && product.specifications.length > 0
      ? `<div class="product-drawer__section">
          <h3>المواصفات</h3>
          <ul class="product-drawer__specs">
            ${product.specifications
              .map((s) => `<li><span>${escapeHTML(s.label)}</span><span>${escapeHTML(s.value)}</span></li>`)
              .join("")}
          </ul>
        </div>`
      : "";

  const originHTML = product.originCountry
    ? `<div class="product-drawer__section">
        <h3>بلد المنشأ</h3>
        <p style="font-size:14px;color:var(--text-secondary);">${escapeHTML(product.originCountry)}</p>
      </div>`
    : "";

  dom.productDrawerContent.innerHTML = `
    <div class="product-drawer__gallery">
      <div class="product-drawer__main-image">
        <img src="${escapeHTML(activeImage)}" alt="${escapeHTML(product.name)}" id="drawer-main-image" />
      </div>
      ${thumbsHTML}
    </div>
    <div class="product-drawer__info">
      <p class="product-drawer__category">${escapeHTML(product.categoryLabel || "")}</p>
      <h2 class="product-drawer__name">${escapeHTML(product.name)}</h2>
      <p class="product-drawer__price">${formatPrice(product.price)}</p>
      <p class="product-drawer__description">${escapeHTML(product.description || "")}</p>
      ${originHTML}
      ${ingredientsHTML}
      ${specsHTML}
      <div class="product-drawer__quantity">
        <span>الكمية</span>
        <div class="quantity-control">
          <button type="button" id="drawer-qty-minus" aria-label="إنقاص الكمية">−</button>
          <span id="drawer-qty-value">${drawerQuantity}</span>
          <button type="button" id="drawer-qty-plus" aria-label="زيادة الكمية">+</button>
        </div>
      </div>
      <button type="button" class="btn btn-primary btn-block" id="drawer-add-to-cart">أضف إلى السلة</button>
    </div>
  `;

  // Wire up thumbnail switching
  dom.productDrawerContent.querySelectorAll("[data-thumb-index]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-thumb-index"));
      const newImage = gallery[idx];
      document.getElementById("drawer-main-image").src = newImage;
      dom.productDrawerContent.querySelectorAll(".product-drawer__thumb").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
  });

  document.getElementById("drawer-qty-minus").addEventListener("click", () => {
    drawerQuantity = Math.max(1, drawerQuantity - 1);
    document.getElementById("drawer-qty-value").textContent = drawerQuantity;
  });
  document.getElementById("drawer-qty-plus").addEventListener("click", () => {
    drawerQuantity += 1;
    document.getElementById("drawer-qty-value").textContent = drawerQuantity;
  });
  document.getElementById("drawer-add-to-cart").addEventListener("click", () => {
    addToCart(product.id, drawerQuantity);
    closeProductDrawer();
  });
}

/* ---------- Cart actions ---------- */
function addToCart(productId, quantity) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: (product.images && product.images[0]) || "",
      quantity,
    });
  }
  saveCart(cart);
  updateCartBadge();
  showToast(`تمت إضافة ${product.name} إلى السلة`);
}

function updateCartQuantity(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);
  saveCart(cart);
  renderCartDrawer();
  updateCartBadge();
}

function updateCartBadge() {
  const count = cartItemsCount(getCart());
  dom.cartBadge.textContent = count;
  dom.cartBadgeMobile.textContent = count;
}

/* ---------- Cart drawer ---------- */
function openCartDrawer() {
  renderCartDrawer();
  dom.cartOverlay.classList.add("is-visible");
  dom.cartDrawer.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeCartDrawer() {
  dom.cartOverlay.classList.remove("is-visible");
  dom.cartDrawer.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

function renderCartDrawer() {
  const cart = getCart();

  if (cart.length === 0) {
    dom.cartDrawerBody.innerHTML = `
      <div class="cart-drawer__empty">
        <p class="cart-drawer__empty-title">السلة فارغة</p>
        <p class="cart-drawer__empty-text">لم تقم بإضافة أي منتجات بعد.</p>
        <button type="button" class="btn btn-outline" id="cart-browse-btn">تصفح المنتجات</button>
      </div>
    `;
    document.getElementById("cart-browse-btn").addEventListener("click", () => {
      closeCartDrawer();
      document.getElementById("catalog").scrollIntoView({ behavior: "smooth" });
    });
    return;
  }

  const subtotal = cartSubtotal(cart);
  const delivery = DELIVERY_FEE;
  const total = subtotal + delivery;

  const itemsHTML = cart
    .map(
      (item) => `
    <li class="cart-item" data-item-id="${escapeHTML(item.id)}">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" class="cart-item__image" />
      <div class="cart-item__details">
        <p class="cart-item__name">${escapeHTML(item.name)}</p>
        <p class="cart-item__price">${formatPrice(item.price)}</p>
        <div class="cart-item__controls">
          <div class="quantity-control quantity-control--sm">
            <button type="button" data-qty-minus="${escapeHTML(item.id)}" aria-label="إنقاص الكمية">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-qty-plus="${escapeHTML(item.id)}" aria-label="زيادة الكمية">+</button>
          </div>
          <button type="button" class="cart-item__remove" data-remove-item="${escapeHTML(item.id)}">إزالة</button>
        </div>
      </div>
    </li>`
    )
    .join("");

  const wilayaOptionsHTML = ALGERIA_WILAYAS.map((w) => `<option value="${escapeHTML(w)}">${escapeHTML(w)}</option>`).join("");

  dom.cartDrawerBody.innerHTML = `
    <ul class="cart-drawer__items">${itemsHTML}</ul>

    <div class="cart-drawer__totals">
      <div class="cart-drawer__totals-row"><span>المجموع الفرعي</span><span>${formatPrice(subtotal)}</span></div>
      <div class="cart-drawer__totals-row"><span>التوصيل</span><span>${formatPrice(delivery)}</span></div>
      <div class="cart-drawer__totals-row cart-drawer__totals-row--total"><span>الإجمالي</span><span>${formatPrice(total)}</span></div>
    </div>

    <form class="checkout-form" id="checkout-form" novalidate>
      <h3 class="checkout-form__heading">معلومات التوصيل</h3>

      <div class="checkout-form__field">
        <label for="checkout-name">الاسم الكامل</label>
        <input id="checkout-name" type="text" autocomplete="name" />
        <p class="checkout-form__error" id="error-name"></p>
      </div>

      <div class="checkout-form__field">
        <label for="checkout-phone">رقم الهاتف</label>
        <input id="checkout-phone" type="tel" inputmode="tel" placeholder="0555 00 00 00" autocomplete="tel" />
        <p class="checkout-form__error" id="error-phone"></p>
      </div>

      <div class="checkout-form__field">
        <label for="checkout-wilaya">الولاية</label>
        <select id="checkout-wilaya">
          <option value="">اختر الولاية</option>
          ${wilayaOptionsHTML}
        </select>
        <p class="checkout-form__error" id="error-wilaya"></p>
      </div>

      <div class="checkout-form__field">
        <label for="checkout-address">العنوان بالتفصيل</label>
        <textarea id="checkout-address" rows="3"></textarea>
        <p class="checkout-form__error" id="error-address"></p>
      </div>

      <button type="submit" class="btn btn-whatsapp btn-block">
        تأكيد الطلب عبر الواتساب
      </button>
    </form>
  `;

  // Quantity / remove handlers
  dom.cartDrawerBody.querySelectorAll("[data-qty-minus]").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.getAttribute("data-qty-minus"), -1));
  });
  dom.cartDrawerBody.querySelectorAll("[data-qty-plus]").forEach((btn) => {
    btn.addEventListener("click", () => updateCartQuantity(btn.getAttribute("data-qty-plus"), 1));
  });
  dom.cartDrawerBody.querySelectorAll("[data-remove-item]").forEach((btn) => {
    btn.addEventListener("click", () => removeFromCart(btn.getAttribute("data-remove-item")));
  });

  document.getElementById("checkout-form").addEventListener("submit", handleCheckoutSubmit);
}

/* ---------- Checkout validation + WhatsApp order building ---------- */
const PHONE_REGEX = /^(\+213|0)[\s-]?[5-7](?:[\s-]?\d){8}$/;

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("checkout-name").value.trim();
  const phone = document.getElementById("checkout-phone").value.trim();
  const wilaya = document.getElementById("checkout-wilaya").value;
  const address = document.getElementById("checkout-address").value.trim();

  const errors = {};
  if (!name) errors.name = "يرجى إدخال الاسم الكامل.";
  else if (name.length < 3) errors.name = "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل.";

  if (!phone) errors.phone = "يرجى إدخال رقم الهاتف.";
  else if (!PHONE_REGEX.test(phone.replace(/\s/g, ""))) errors.phone = "يرجى إدخال رقم هاتف صحيح.";

  if (!wilaya) errors.wilaya = "يرجى اختيار الولاية.";

  if (!address) errors.address = "يرجى إدخال العنوان.";
  else if (address.length < 6) errors.address = "يرجى إدخال عنوان أكثر تفصيلاً.";

  ["name", "phone", "wilaya", "address"].forEach((field) => {
    const errorEl = document.getElementById(`error-${field}`);
    const inputEl = document.getElementById(`checkout-${field}`);
    if (errors[field]) {
      errorEl.textContent = errors[field];
      inputEl.setAttribute("aria-invalid", "true");
    } else {
      errorEl.textContent = "";
      inputEl.removeAttribute("aria-invalid");
    }
  });

  if (Object.keys(errors).length > 0) return;

  const cart = getCart();
  if (cart.length === 0) return;

  const subtotal = cartSubtotal(cart);
  const total = subtotal + DELIVERY_FEE;

  pendingOrder = {
    customer: { name, phone, wilaya, address },
    items: cart,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    total,
  };

  openWhatsAppModal();
}

function buildWhatsAppMessage(order) {
  const lines = [];
  lines.push("🛍️ *طلب جديد من AsianProducts*");
  lines.push("");
  lines.push("*المنتجات:*");
  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`);
  });
  lines.push("");
  lines.push(`المجموع الفرعي: ${formatPrice(order.subtotal)}`);
  lines.push(`التوصيل: ${formatPrice(order.deliveryFee)}`);
  lines.push(`*الإجمالي: ${formatPrice(order.total)}*`);
  lines.push("");
  lines.push("*معلومات العميل:*");
  lines.push(`الاسم: ${order.customer.name}`);
  lines.push(`الهاتف: ${order.customer.phone}`);
  lines.push(`الولاية: ${order.customer.wilaya}`);
  lines.push(`العنوان: ${order.customer.address}`);
  return lines.join("\n");
}

/* ---------- WhatsApp number-picker modal ---------- */
function openWhatsAppModal() {
  dom.waOverlay.classList.add("is-visible");
  dom.waModal.classList.add("is-open");
}

function closeWhatsAppModal() {
  dom.waOverlay.classList.remove("is-visible");
  dom.waModal.classList.remove("is-open");
}

function sendOrderToWhatsApp(number) {
  if (!pendingOrder) return;
  const message = buildWhatsAppMessage(pendingOrder);
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");

  // No local order persistence: we only clear the cart client-side after
  // handing the order off to WhatsApp.
  saveCart([]);
  updateCartBadge();
  pendingOrder = null;
  closeWhatsAppModal();
  closeCartDrawer();
  showToast("تم تحويلك إلى واتساب لإتمام الطلب");
}

/* ---------- Mobile menu ---------- */
function toggleMobileMenu() {
  const isOpen = dom.mobileMenu.classList.toggle("is-open");
  dom.menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  dom.mobileMenu.classList.remove("is-open");
  dom.menuToggle.setAttribute("aria-expanded", "false");
}

/* ---------- Event wiring ---------- */
function wireEvents() {
  // Product grid delegation (open drawer / add to cart)
  dom.productGrid.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-open-product]");
    if (openBtn) {
      openProductDrawer(openBtn.getAttribute("data-open-product"));
      return;
    }
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) {
      addToCart(addBtn.getAttribute("data-add-to-cart"), 1);
    }
  });

  dom.productDrawerClose.addEventListener("click", closeProductDrawer);
  dom.productOverlay.addEventListener("click", closeProductDrawer);

  dom.cartDrawerClose.addEventListener("click", closeCartDrawer);
  dom.cartOverlay.addEventListener("click", closeCartDrawer);

  document.getElementById("nav-cart-btn").addEventListener("click", openCartDrawer);
  document.getElementById("nav-cart-btn-mobile").addEventListener("click", openCartDrawer);

  // Nav scrolling (desktop + mobile duplicates)
  const scrollTo = (id) => document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  const wireNav = (id, target) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => { scrollTo(target); closeMobileMenu(); });
  };
  wireNav("nav-home", "top");
  wireNav("nav-about", "about");
  wireNav("nav-catalog", "catalog");
  wireNav("nav-contact", "contact");
  wireNav("nav-home-m", "top");
  wireNav("nav-about-m", "about");
  wireNav("nav-catalog-m", "catalog");
  wireNav("nav-contact-m", "contact");
  wireNav("footer-home", "top");
  wireNav("footer-about", "about");
  wireNav("footer-catalog", "catalog");

  dom.menuToggle.addEventListener("click", toggleMobileMenu);

  // WhatsApp modal
  dom.waOptionPrimary.addEventListener("click", () => sendOrderToWhatsApp(WHATSAPP_NUMBERS.primary));
  dom.waOptionSecondary.addEventListener("click", () => sendOrderToWhatsApp(WHATSAPP_NUMBERS.secondary));
  dom.waCancel.addEventListener("click", closeWhatsAppModal);
  dom.waOverlay.addEventListener("click", closeWhatsAppModal);

  // ESC closes whichever overlay is open
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (dom.waModal.classList.contains("is-open")) closeWhatsAppModal();
    else if (dom.productDrawer.classList.contains("is-open")) closeProductDrawer();
    else if (dom.cartDrawer.classList.contains("is-open")) closeCartDrawer();
  });

  // Keep the storefront in sync if products are edited in the admin panel
  // (in another browser tab on the same origin).
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY_PRODUCTS) {
      products = getProducts();
      renderProductGrid();
    }
    if (e.key === STORAGE_KEY_CART) {
      updateCartBadge();
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  products = getProducts();
  renderCategoryFilters();
  renderProductGrid();
  updateCartBadge();
  wireEvents();
});
