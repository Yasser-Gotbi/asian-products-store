"use strict";

/* ============================================================
   AsianProducts — Simple Admin Gate (auth.js)
   Shared by login.html and admin.html.
   ------------------------------------------------------------
   ⚠️ IMPORTANT — READ THIS BEFORE RELYING ON IT
   This is a *basic deterrent*, not real security. Everything
   here runs in the visitor's own browser, which means:
     - Anyone can open DevTools → Sources and read ADMIN_PASSWORD
       below in plain text.
     - Anyone can bypass the redirect entirely by typing
       sessionStorage.setItem("asianproducts_admin_auth","true")
       into the browser console.
   This only stops casual access (e.g. someone stumbling onto
   admin.html without knowing it exists). It does NOT protect
   against a visitor who deliberately tries to get in.
   For real protection you need a server-side check — even a
   very small one — or a host-level password (Netlify/Cloudflare
   Access, .htaccess Basic Auth, etc).
   ============================================================ */

const AUTH_STORAGE_KEY = "asianproducts_admin_auth";

// TODO: غيّر اسم المستخدم وكلمة المرور فورًا قبل أي استخدام حقيقي.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

// Returns true if the current tab/session is "logged in".
// Uses sessionStorage on purpose: the person is signed out again
// automatically when they close the browser tab/window.
function isAuthenticated() {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

// Checks credentials and marks the session as authenticated on success.
function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
    return true;
  }
  return false;
}

// Clears the session and sends the person back to the login page.
function logout() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
  window.location.href = "login.html";
}

// Call this at the very top of admin.html (before the dashboard markup
// is shown) so a logged-out visitor is bounced to login.html instantly,
// instead of seeing the dashboard flash on screen first.
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}
