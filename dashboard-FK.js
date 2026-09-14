

"use strict";

import { db, PRODUCTS_COLLECTION } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------- إعدادات Cloudinary ---------- */
const CLOUDINARY_CLOUD_NAME = "q62bvers";
const CLOUDINARY_UPLOAD_PRESET = "qwenmyy0";
const CATEGORY_LABELS = {
  food: "أطعمة ومشروبات",
  care: "عناية وجمال",
  accessories: "إكسسوارات",
};

/* ---------- دالة رفع الصورة إلى Cloudinary ---------- */
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("فشل رفع الصورة إلى السيرفر");
  }

  const data = await response.json();
  return data.secure_url; // يرجع رابط الصورة المباشر
}

/* ---------- Utilities & Normalization ---------- */
function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatPrice(value) {
  const number = Number(value) || 0;
  return `${number.toLocaleString("en-US")} د.ج`;
}

function normalizeProduct(id, raw) {
  const category = ["food", "care", "accessories"].includes(raw?.category) ? raw.category : "food";
  return {
    id,
    sku: typeof raw?.sku === "string" && raw.sku ? raw.sku : "—",
    name: typeof raw?.name === "string" && raw.name ? raw.name : "منتج بدون اسم",
    category,
    categoryLabel: CATEGORY_LABELS[category],
    price: Number.isFinite(Number(raw?.price)) ? Number(raw.price) : 0,
    originCountry: typeof raw?.originCountry === "string" && raw.originCountry ? raw.originCountry : "غير محدد",
    images: Array.isArray(raw?.images) && raw.images.length > 0 ? raw.images : ["https://via.placeholder.com/150"],
    description: typeof raw?.description === "string" ? raw.description : "",
    ingredients: Array.isArray(raw?.ingredients) ? raw.ingredients : [],
    specifications: Array.isArray(raw?.specifications) ? raw.specifications : [],
    available: raw?.available !== false,
  };
}

/* ---------- Firestore: Subscription ---------- */
function subscribeToProducts() {
  const productsQuery = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));

  onSnapshot(
    productsQuery,
    (snapshot) => {
      products = snapshot.docs.map((docSnap) => normalizeProduct(docSnap.id, docSnap.data()));
      renderTable();
    },
    (error) => {
      console.error("Firestore error:", error);
      showToast("تعذّر الاتصال بقاعدة البيانات.");
    }
  );
}

/* ---------- Firestore: CRUD ---------- */
async function saveProductToFirestore(productData, existingId) {
  const id = existingId || doc(collection(db, PRODUCTS_COLLECTION)).id;
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const payload = { ...productData, id };
  if (!existingId) payload.createdAt = serverTimestamp();
  await setDoc(docRef, payload, { merge: true });
  return id;
}

async function deleteProductFromFirestore(id) {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

async function updateProductField(id, fields) {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), fields);
}

/* ---------- State ---------- */
let products = [];
let categoryFilter = "all";
let searchQuery = "";
let editingProductId = null;

let draftImages = [];
let selectedFile = null; // الملف المحدد من الهاتف/الكمبيوتر
let draftIngredients = [];
let deleteTargetId = null;

/* ---------- DOM cache ---------- */
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
  dom.drawerSave = document.getElementById("drawer-save");
  dom.form = document.getElementById("product-form");

  dom.fieldId = document.getElementById("field-id");
  dom.fieldName = document.getElementById("field-name");
  dom.fieldCategory = document.getElementById("field-category");
  dom.fieldSku = document.getElementById("field-sku");
  dom.fieldPrice = document.getElementById("field-price");
  dom.fieldOrigin = document.getElementById("field-origin");
  dom.fieldDescription = document.getElementById("field-description");
  dom.fieldAvailable = document.getElementById("field-available");

  dom.imageFileInput = document.getElementById("field-image-file");
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
}

/* ---------- Toast ---------- */
let toastTimeout = null;
function showToast(message) {
  if (!dom.toast) return;
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => dom.toast.classList.remove("is-visible"), 2600);
}

/* ---------- Render Table ---------- */
function renderTable() {
  const list = products.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

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
      return `
      <tr data-row-id="${escapeHTML(product.id)}">
        <td><img src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" class="admin-table__thumb" /></td>
        <td>
          <span class="admin-table__name">${escapeHTML(product.name)}</span>
          <span class="admin-table__sku">SKU: ${escapeHTML(product.sku || "—")}</span>
        </td>
        <td><span class="admin-category-pill admin-category-pill--${product.category}">${escapeHTML(product.categoryLabel)}</span></td>
        <td class="admin-table__price">${formatPrice(product.price)}</td>
        <td>
          <label class="admin-toggle">
            <input type="checkbox" data-toggle-available="${escapeHTML(product.id)}" ${product.available !== false ? "checked" : ""} />
            <span class="admin-toggle__track"><span class="admin-toggle__thumb"></span></span>
          </label>
        </td>
        <td>
          <div class="admin-table__actions">
            <button type="button" class="admin-icon-btn" data-edit="${escapeHTML(product.id)}">✏️</button>
            <button type="button" class="admin-icon-btn" data-delete="${escapeHTML(product.id)}">🗑️</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");
}

/* ---------- Drawer Management ---------- */
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
  selectedFile = null;
  if (dom.imageFileInput) dom.imageFileInput.value = "";

  renderImagePreview();

  dom.drawerOverlay.classList.add("is-visible");
  dom.drawer.classList.add("is-open");
}

function closeDrawer() {
  dom.drawerOverlay.classList.remove("is-visible");
  dom.drawer.classList.remove("is-open");
  editingProductId = null;
  selectedFile = null;
}

function renderImagePreview() {
  if (selectedFile) {
    const objectUrl = URL.createObjectURL(selectedFile);
    dom.uploadThumbs.innerHTML = `<div class="admin-upload__thumb"><img src="${objectUrl}" /></div>`;
  } else if (draftImages.length > 0) {
    dom.uploadThumbs.innerHTML = `<div class="admin-upload__thumb"><img src="${escapeHTML(draftImages[0])}" /></div>`;
  } else {
    dom.uploadThumbs.innerHTML = "";
  }
}

/* ---------- Form Submit ---------- */
async function handleFormSubmit(e) {
  e.preventDefault();

  const name = dom.fieldName.value.trim();
  const price = Number(dom.fieldPrice.value);

  if (!name || !price) {
    showToast("يرجى ملء الاسم والسعر بشكل صحيح.");
    return;
  }

  const originalBtnText = dom.drawerSave.textContent;
  dom.drawerSave.disabled = true;

  try {
    let finalImages = [...draftImages];

    // إذا قام المستخدم باختيار صورة جديدة من الهاتف/الكمبيوتر
    if (selectedFile) {
      dom.drawerSave.textContent = "جارٍ رفع الصورة...";
      const uploadedUrl = await uploadImageToCloudinary(selectedFile);
      finalImages = [uploadedUrl];
    }

    dom.drawerSave.textContent = "جارٍ حفظ المنتج...";

    const productData = {
      sku: dom.fieldSku.value.trim() || "—",
      name,
      category: dom.fieldCategory.value,
      categoryLabel: CATEGORY_LABELS[dom.fieldCategory.value],
      price,
      originCountry: dom.fieldOrigin.value.trim() || "غير محدد",
      images: finalImages.length > 0 ? finalImages : ["https://via.placeholder.com/150"],
      description: dom.fieldDescription.value.trim(),
      available: dom.fieldAvailable.checked,
    };

    await saveProductToFirestore(productData, editingProductId);
    closeDrawer();
    showToast(editingProductId ? "تم التعديل بنجاح" : "تم إضافة المنتج ونشره فوراً!");
  } catch (err) {
    console.error(err);
    showToast("حدث خطأ أثناء الحفظ أو رفع الصورة.");
  } finally {
    dom.drawerSave.disabled = false;
    dom.drawerSave.textContent = originalBtnText;
  }
}

/* ---------- Events ---------- */
function wireEvents() {
  dom.addProductBtn.addEventListener("click", () => openDrawer(null));
  if (dom.addFirstProductBtn) dom.addFirstProductBtn.addEventListener("click", () => openDrawer(null));
  dom.drawerClose.addEventListener("click", closeDrawer);
  dom.drawerCancel.addEventListener("click", closeDrawer);
  dom.drawerOverlay.addEventListener("click", closeDrawer);
  dom.form.addEventListener("submit", handleFormSubmit);

  // عند اختيار صورة من الهاتف أو الكمبيوتر
  dom.imageFileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      selectedFile = e.target.files[0];
      renderImagePreview();
    }
  });

  dom.tableBody.addEventListener("click", (e) => {
    const editBtn = e.target.closest("[data-edit]");
    if (editBtn) openDrawer(editBtn.getAttribute("data-edit"));

    const deleteBtn = e.target.closest("[data-delete]");
    if (deleteBtn) {
      const id = deleteBtn.getAttribute("data-delete");
      if (confirm("هل أنت تأكد من حذف هذا المنتج؟")) {
        deleteProductFromFirestore(id);
      }
    }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  subscribeToProducts();
  wireEvents();
});