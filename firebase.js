/* ============================================================
   AsianProducts — Firebase Initialization (firebase.js)
   Shared by script.js (storefront) and admin.js (dashboard).
   This is an ES module — it's imported with `import`, never
   loaded with a plain <script src="firebase.js"> tag.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// TODO: ضع apiKey و appId الحقيقيين لمشروعك.
// تجدهما في: Firebase Console → ⚙️ Project settings → عام →
// "Your apps" → SDK setup and configuration → Config
const firebaseConfig = {
  apiKey: "AIzaSyAar5zTXU4VZFAxLSJT4V8d4ZRCjahJNTg",
  authDomain: "asianstore-31f22.firebaseapp.com",
  projectId: "asianstore-31f22",
  storageBucket: "asianstore-31f22.firebasestorage.app",
  messagingSenderId: "657751891935",
  appId: "1:657751891935:web:2f330bbc098db03026ee6a",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// Single source of truth for the collection name, so it's never
// typed differently by mistake in script.js vs admin.js.
export const PRODUCTS_COLLECTION = "products";
