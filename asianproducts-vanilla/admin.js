"use strict";

/* =========================================================
   AsianProducts — Admin Dashboard Logic (admin.js)
   Vanilla JS. Reads/writes the same localStorage key used by
   script.js, so anything saved here appears live on index.html
   the next time that page loads (or immediately in another
   open tab, via the "storage" event).
   ========================================================= */

/* ---------- CONFIG (keep in sync with script.js) ---------- */
const STORAGE_KEY_PRODUCTS = "asianproducts_products";

const CATEGORY_LABELS = {
  food: "أطعمة ومشروبات",
  care: "عناية وجمال",
  accessories: "إكسسوارات",
};

const MAX_IMAGES = 5;

/* ---------- Same seed used by script.js, so the table isn't
   empty the very first time the admin panel is opened. ---------- */
const SEED_PRODUCTS = [
  {
    id: "p1", sku: "ASN-CN-9018", name: "صابون شامبو صلب بخلاصة أوراق السرو — Suzuki Sasaki",
    category: "care", categoryLabel: "عناية وجمال", price: 1800, originCountry: "غير محدد",
    images: ["assets/products/product-01-suzuki-shampoo-a.jpg", "assets/products/product-01-suzuki-shampoo-b.jpg"],
    description: "شامبو صلب بتصميم مثلث مميز، مصنوع بخلاصة أوراق السرو الشرقي (Cacumen Biotae).",
    ingredients: ["خلاصة أوراق السرو الشرقي (Cacumen Biotae)"],
    specifications: [{ label: "الشكل", value: "صابون شامبو صلب (بار)" }], available: true,
  },
  {
    id: "p2", sku: "ASN-JP-8966", name: "فيتغم كولاجين 20X — قهوة الشيا",
    category: "food", categoryLabel: "أطعمة ومشروبات", price: 3200, originCountry: "اليابان",
    images: ["assets/products/product-02-fitgum-coffee-pouch.jpg", "assets/products/product-02-fitgum-coffee-sachet.jpg"],
    description: "خليط قهوة 11 في 1 يجمع بين الكولاجين والجلوتاثيون وبذور الشيا.",
    ingredients: ["كولاجين", "جلوتاثيون", "بذور الشيا", "قهوة"],
    specifications: [{ label: "الوزن الصافي", value: "120 غرام (10 أكياس × 12 غرام)" }], available: true,
  },
  {
    id: "p3", sku: "ASN-XX-9015", name: "ADEX VEDA كريم مرطب بالكافيين والريتينول",
    category: "care", categoryLabel: "عناية وجمال", price: 2400, originCountry: "غير محدد",
    images: ["assets/products/product-03-adexveda-cream.jpg"],
    description: "كريم مرطب طبيعي يجمع بين الريتينول والكافيين بتركيبة Osmotic Force Max.",
    ingredients: ["ريتينول", "كافيين"], specifications: [{ label: "النوع", value: "كريم مرطب طبيعي" }], available: true,
  },
  {
    id: "p4", sku: "ASN-JP-9012", name: "Pure Beauty Collagen — مسحوق كولاجين بحري ياباني",
    category: "food", categoryLabel: "أطعمة ومشروبات", price: 3500, originCountry: "اليابان",
    images: ["assets/products/product-04-pure-beauty-collagen.jpg"],
    description: "مسحوق كولاجين بحري بجودة يابانية، يحتوي على خلاصة حبوب الكوإكس وحمض الهيالورونيك و CoQ10.",
    ingredients: ["كولاجين بحري (100,000 ملغ)", "خلاصة حبوب الكوإكس", "حمض الهيالورونيك", "CoQ10"],
    specifications: [{ label: "الوزن الصافي", value: "100 غرام" }], available: true,
  },
  {
    id: "p5", sku: "ASN-CN-8971", name: "Sumifun لاصقة تخفيف آلام الركبة",
    category: "care", categoryLabel: "عناية وجمال", price: 900, originCountry: "غير محدد",
    images: ["assets/products/product-05-meniscus-patch.jpg"],
    description: "لاصقات لتخفيف آلام الركبة والمفاصل.",
    ingredients: [], specifications: [{ label: "عدد القطع", value: "4 قطع" }], available: true,
  },
  {
    id: "p6", sku: "ASN-CN-8972", name: "Sumifun مرهم تخفيف آلام الركبة",
    category: "care", categoryLabel: "عناية وجمال", price: 1100, originCountry: "غير محدد",
    images: ["assets/products/product-06-meniscus-ointment.jpg"],
    description: "مرهم لتخفيف آلام الركبة والعظام والمفاصل.",
    ingredients: [], specifications: [{ label: "الوزن", value: "40 غرام" }], available: true,
  },
  {
    id: "p7", sku: "ASN-XX-8967", name: "مسحوق ماتشا عضوي",
    category: "food", categoryLabel: "أطعمة ومشروبات", price: 2200, originCountry: "غير محدد",
    images: ["assets/products/product-07-matcha-powder.jpg"],
    description: "مسحوق شاي أخضر ماتشا عضوي 100%، خالٍ من الغلوتين ومنتجات الألبان.",
    ingredients: ["مسحوق شاي أخضر (ماتشا) عضوي"], specifications: [{ label: "الوزن الصافي", value: "100 غرام" }], available: true,
  },
  {
    id: "p8", sku: "ASN-XX-8969", name: "Googeer شاي ديتوكس بنكهة الخوخ",
    category: "food", categoryLabel: "أطعمة ومشروبات", price: 1600, originCountry: "غير محدد",
    images: ["assets/products/product-08-detox-tea.jpg"],
    description: "شاي منشط لتنظيف الجسم بنكهة الخوخ الطبيعية، يأتي في عبوة تحتوي على 28 كيس شاي.",
    ingredients: [], specifications: [{ label: "عدد الأكياس", value: "28 كيس شاي" }], available: true,
  },
];

/* ---------- Utilities ---------- */
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatPrice(value) {
  const number = Number(value) || 0;
  return `${number.toLocaleString("en-US")} د.ج`;
}

function generateId() {
  return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ---------- Storage ---------- */
function getProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      return JSON.parse(JSON.stringify(SEED_PRODUCTS));
    }
    return JSON.parse(raw);
  } catch {
    return JSON.parse(JSON.stringify(SEED_PRODUCTS));
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    return true;
  } catch (err) {
    console.error("تعذّر حفظ المنتجات — قد تكون مساحة التخزين ممتلئة (الصور الكبيرة تستهلك مساحة).", err);
    return false;
  }
}

/* ---------- State ---------- */
let products = [];
let categoryFilter = "all";
let searchQuery = "";
let editingProductId = null; // null => adding a new product
let draftImages = []; // array of image src strings (existing paths or new base64 data URLs)
let draftIngredients = [];
let deleteTargetId = null;

/* ---------- DOM refs ---------- */
const dom = {};

function cacheDom() {
  dom.tableBody = document.getElementById("products-table-body");
  dom.emptyState = document.getElementById("products-empty");
  dom.productsCount = document.getElementById("products-count");
  dom.categoryFilterSelect = document.getElementById("category-filter-select");
  dom.searchInput = document.getElementById("search-input");
  dom.addProductBtn = document.getElementById("add-product-btn");
  dom.addFirstProductBtn = document.getElementById("add-first-product-btn");

  dom.drawerOverlay = document.getElementById("drawer-overlay");
  dom.drawer = document.getElementById("product-drawer");
  dom.drawerTitle = document.getElementById("drawer-title");
  dom.drawerClose = document.getElementById("drawer-close");
  dom.drawerCancel = document.getElementById("drawer-cancel");
  dom.form = document.getElementById("product-form");

  dom.fieldId = document.getElementById("field-id");
  dom.fieldName = document.getElementById("field-name");
  dom.fieldCategory = document.getElementById("field-category");
  dom.fieldSku = document.getElementById("field-sku");
  dom.fieldPrice = document.getElementById("field-price");
  dom.fieldOrigin = document.getElementById("field-origin");
  dom.fieldDescription = document.getElementById("field-description");
  dom.fieldAvailable = document.getElementById("field-available");

  dom.uploadDropzone = document.getElementById("upload-dropzone");
  dom.uploadInput = document.getElementById("upload-input");
  dom.uploadThumbs = document.getElementById("upload-thumbs");

  dom.ingredientsTags = document.getElementById("ingredients-tags");
  dom.ingredientsInput = document.getElementById("field-ingredients-input");

  dom.specsRows = document.getElementById("specs-rows");
  dom.addSpecRow = document.getElementById("add-spec-row");

  dom.deleteOverlay = document.getElementById("delete-overlay");
  dom.deleteConfirm = document.getElementById("delete-confirm");
  dom.deleteProductName = document.getElementById("delete-product-name");
  dom.deleteCancel = document.getElementById("delete-cancel");
  dom.deleteConfirmBtn = document.getElementById("delete-confirm-btn");

  dom.toast = document.getElementById("admin-toast");

  dom.sidebarLinks = document.querySelectorAll(".admin-sidebar__link");
  dom.viewProducts = document.getElementById("view-products");
  dom.viewSettings = document.getElementById("view-settings");
}

/* ---------- Toast ---------- */
let toastTimeout = null;
function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => dom.toast.classList.remove("is-visible"), 2600);
}

/* ---------- Table rendering ---------- */
function getFilteredProducts() {
  return products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });
}

function renderTable() {
  const list = getFilteredProducts();
  dom.productsCount.textContent = `${products.length} منتجات مسجلة`;

  if (list.length === 0) {
    dom.tableBody.innerHTML = "";
    dom.emptyState.hidden = false;
    return;
  }
  dom.emptyState.hidden = true;

  dom.tableBody.innerHTML = list
    .map((product) => {
      const image = (product.images && product.images[0]) || "";
      const categoryClass = `admin-category-pill--${product.category}`;
      return `
      <tr data-row-id="${escapeHTML(product.id)}">
        <td><img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" class="admin-table__thumb" /></td>
        <td>
          <span class="admin-table__name">${escapeHTML(product.name)}</span>
          <span class="admin-table__sku">رمز التخزين: ${escapeHTML(product.sku || "—")}</span>
        </td>
        <td><span class="admin-category-pill ${categoryClass}">${escapeHTML(product.categoryLabel || CATEGORY_LABELS[product.category] || "")}</span></td>
        <td class="admin-table__price">${formatPrice(product.price)}</td>
        <td>
          <label class="admin-toggle">
            <input type="checkbox" data-toggle-available="${escapeHTML(product.id)}" ${product.available !== false ? "checked" : ""} />
            <span class="admin-toggle__track"><span class="admin-toggle__thumb"></span></span>
          </label>
        </td>
        <td>
          <div class="admin-table__actions">
            <button type="button" class="admin-icon-btn" data-edit="${escapeHTML(product.id)}" aria-label="تعديل">✏️</button>
            <button type="button" class="admin-icon-btn" data-delete="${escapeHTML(product.id)}" aria-label="حذف">🗑️</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

/* ---------- Drawer: open / close ---------- */
function openDrawer(productId) {
  editingProductId = productId || null;
  const product = productId ? products.find((p) => p.id === productId) : null;

  dom.drawerTitle.textContent = product ? "تعديل المنتج" : "إضافة منتج جديد";
  dom.fieldId.value = product ? product.id : "";
  dom.fieldName.value = product ? product.name : "";
  dom.fieldCategory.value = product ? product.category : "food";
  dom.fieldSku.value = product ? product.sku || "" : "";
  dom.fieldPrice.value = product ? product.price : "";
  dom.fieldOrigin.value = product ? product.originCountry || "" : "";
  dom.fieldDescription.value = product ? product.description || "" : "";
  dom.fieldAvailable.checked = product ? product.available !== false : true;

  draftImages = product ? [...(product.images || [])] : [];
  draftIngredients = product ? [...(product.ingredients || [])] : [];
  renderUploadThumbs();
  renderIngredientTags();

  dom.specsRows.innerHTML = "";
  const specs = product && product.specifications && product.specifications.length ? product.specifications : [{ label: "", value: "" }];
  specs.forEach((spec) => addSpecRow(spec.label, spec.value));

  dom.drawerOverlay.classList.add("is-visible");
  dom.drawer.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeDrawer() {
  dom.drawerOverlay.classList.remove("is-visible");
  dom.drawer.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  editingProductId = null;
}

/* ---------- Image upload ---------- */
function renderUploadThumbs() {
  dom.uploadThumbs.innerHTML = draftImages
    .map(
      (src, index) => `
    <div class="admin-upload__thumb${index === 0 ? " admin-upload__thumb--main" : ""}">
      <img src="${escapeHTML(src)}" alt="" />
      <button type="button" data-remove-image="${index}" aria-label="إزالة الصورة">×</button>
    </div>`
    )
    .join("");

  dom.uploadThumbs.querySelectorAll("[data-remove-image]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-remove-image"));
      draftImages.splice(idx, 1);
      renderUploadThumbs();
    });
  });
}

function handleFiles(fileList) {
  const files = Array.from(fileList).slice(0, MAX_IMAGES - draftImages.length);
  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      draftImages.push(reader.result); // base64 data URL
      renderUploadThumbs();
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- Ingredient tags ---------- */
function renderIngredientTags() {
  dom.ingredientsTags.innerHTML = draftIngredients
    .map(
      (ingredient, index) => `
    <span class="admin-tag">
      ${escapeHTML(ingredient)}
      <button type="button" data-remove-ingredient="${index}" aria-label="إزالة">×</button>
    </span>`
    )
    .join("");

  dom.ingredientsTags.querySelectorAll("[data-remove-ingredient]").forEach((btn) => {
    btn.addEventListener("click", () => {
      draftIngredients.splice(Number(btn.getAttribute("data-remove-ingredient")), 1);
      renderIngredientTags();
    });
  });
}

/* ---------- Specification rows ---------- */
function addSpecRow(label = "", value = "") {
  const row = document.createElement("div");
  row.className = "admin-spec-row";
  row.innerHTML = `
    <input type="text" placeholder="الخاصية (مثال: الوزن)" class="spec-label" value="${escapeHTML(label)}" />
    <input type="text" placeholder="القيمة (مثال: 100 غرام)" class="spec-value" value="${escapeHTML(value)}" />
    <button type="button" class="admin-spec-row__remove" aria-label="إزالة الصف">×</button>
  `;
  row.querySelector(".admin-spec-row__remove").addEventListener("click", () => row.remove());
  dom.specsRows.appendChild(row);
}

function collectSpecs() {
  return Array.from(dom.specsRows.querySelectorAll(".admin-spec-row"))
    .map((row) => ({
      label: row.querySelector(".spec-label").value.trim(),
      value: row.querySelector(".spec-value").value.trim(),
    }))
    .filter((spec) => spec.label && spec.value);
}

/* ---------- Save product ---------- */
function handleFormSubmit(e) {
  e.preventDefault();

  const name = dom.fieldName.value.trim();
  const category = dom.fieldCategory.value;
  const price = Number(dom.fieldPrice.value);

  if (!name) {
    showToast("يرجى إدخال اسم المنتج.");
    dom.fieldName.focus();
    return;
  }
  if (!price || price < 0) {
    showToast("يرجى إدخال سعر صحيح.");
    dom.fieldPrice.focus();
    return;
  }

  const productData = {
    id: editingProductId || generateId(),
    sku: dom.fieldSku.value.trim() || "—",
    name,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    price,
    originCountry: dom.fieldOrigin.value.trim() || "غير محدد",
    images: draftImages.length > 0 ? draftImages : ["assets/products/logo.png"],
    description: dom.fieldDescription.value.trim(),
    ingredients: draftIngredients,
    specifications: collectSpecs(),
    available: dom.fieldAvailable.checked,
  };

  if (editingProductId) {
    products = products.map((p) => (p.id === editingProductId ? productData : p));
  } else {
    products.push(productData);
  }

  const saved = saveProducts(products);
  if (!saved) {
    showToast("تعذّر الحفظ — الصور المرفوعة كبيرة جدًا على مساحة التخزين المحلي.");
    return;
  }

  renderTable();
  closeDrawer();
  showToast(editingProductId ? "تم تحديث المنتج بنجاح" : "تمت إضافة المنتج بنجاح");
}

/* ---------- Delete flow ---------- */
function openDeleteConfirm(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  deleteTargetId = productId;
  dom.deleteProductName.textContent = product.name;
  dom.deleteOverlay.classList.add("is-visible");
  dom.deleteConfirm.classList.add("is-open");
}

function closeDeleteConfirm() {
  dom.deleteOverlay.classList.remove("is-visible");
  dom.deleteConfirm.classList.remove("is-open");
  deleteTargetId = null;
}

function confirmDelete() {
  if (!deleteTargetId) return;
  products = products.filter((p) => p.id !== deleteTargetId);
  saveProducts(products);
  renderTable();
  closeDeleteConfirm();
  showToast("تم حذف المنتج");
}

/* ---------- View switching (sidebar) ---------- */
function switchView(view) {
  dom.sidebarLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("data-view") === view));
  dom.viewProducts.hidden = view !== "products";
  dom.viewSettings.hidden = view !== "settings";
}

/* ---------- Event wiring ---------- */
function wireEvents() {
  dom.addProductBtn.addEventListener("click", () => openDrawer(null));
  dom.addFirstProductBtn.addEventListener("click", () => openDrawer(null));
  dom.drawerClose.addEventListener("click", closeDrawer);
  dom.drawerCancel.addEventListener("click", closeDrawer);
  dom.drawerOverlay.addEventListener("click", closeDrawer);
  dom.form.addEventListener("submit", handleFormSubmit);

  dom.categoryFilterSelect.addEventListener("change", (e) => {
    categoryFilter = e.target.value;
    renderTable();
  });

  dom.searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderTable();
  });

  dom.tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) {
      openDrawer(editBtn.getAttribute("data-edit"));
      return;
    }
    const deleteBtn = e.target.closest("[data-delete]");
    if (deleteBtn) {
      openDeleteConfirm(deleteBtn.getAttribute("data-delete"));
    }
  });

  dom.tableBody.addEventListener("change", (e) => {
    const toggle = e.target.closest("[data-toggle-available]");
    if (!toggle) return;
    const id = toggle.getAttribute("data-toggle-available");
    products = products.map((p) => (p.id === id ? { ...p, available: toggle.checked } : p));
    saveProducts(products);
    showToast(toggle.checked ? "المنتج متاح الآن في المتجر" : "تم إخفاء المنتج من المتجر");
  });

  // Image upload: click to browse, or drag & drop
  dom.uploadDropzone.addEventListener("click", () => dom.uploadInput.click());
  dom.uploadInput.addEventListener("change", (e) => handleFiles(e.target.files));

  dom.uploadDropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dom.uploadDropzone.classList.add("is-dragover");
  });
  dom.uploadDropzone.addEventListener("dragleave", () => {
    dom.uploadDropzone.classList.remove("is-dragover");
  });
  dom.uploadDropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dom.uploadDropzone.classList.remove("is-dragover");
    handleFiles(e.dataTransfer.files);
  });

  // Ingredient tag input
  dom.ingredientsInput.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    const value = dom.ingredientsInput.value.trim();
    if (value) {
      draftIngredients.push(value);
      renderIngredientTags();
    }
    dom.ingredientsInput.value = "";
  });

  dom.addSpecRow.addEventListener("click", () => addSpecRow());

  // Delete confirmation
  dom.deleteCancel.addEventListener("click", closeDeleteConfirm);
  dom.deleteOverlay.addEventListener("click", closeDeleteConfirm);
  dom.deleteConfirmBtn.addEventListener("click", confirmDelete);

  // Sidebar navigation
  dom.sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => switchView(link.getAttribute("data-view")));
  });

  // ESC closes whichever overlay is open
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (dom.deleteConfirm.classList.contains("is-open")) closeDeleteConfirm();
    else if (dom.drawer.classList.contains("is-open")) closeDrawer();
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  products = getProducts();
  renderTable();
  wireEvents();
});
