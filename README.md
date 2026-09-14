# AsianProducts — متجر + لوحة تحكم متصلة بـ Firebase Firestore

المتجر ولوحة التحكم أصبحا الآن متصلين مباشرة بقاعدة بيانات **Cloud Firestore** الحقيقية.
أي منتج تضيفه أو تعدّله من `admin.html` يظهر فورًا في `index.html` — على أي جهاز،
وليس فقط في نفس المتصفح كما كان الحال مع `localStorage` سابقًا.

## هيكل الملفات

```
index.html          المتجر (يقرأ المنتجات مباشرة من Firestore)
admin.html           لوحة التحكم (إضافة/تعديل/حذف المنتجات في Firestore)
login.html           صفحة تسجيل الدخول للوحة التحكم
firebase.js          إعداد Firebase (ضع بيانات مشروعك هنا)
auth.js              حماية بسيطة للوحة التحكم (غير مرتبطة بـ Firebase)
script.js            منطق المتجر (وحدة ES module)
admin.js             منطق لوحة التحكم (وحدة ES module)
style.css / admin-style.css
assets/products/     صور المنتجات الأصلية (تُستخدم فقط عند "استيراد المنتجات الأولية")
firestore.rules      قواعد أمان Firestore
storage.rules        قواعد أمان Cloud Storage
firebase.json / .firebaserc   إعداد Firebase CLI (للنشر عبر Firebase Hosting، اختياري)
```

---

## ⚠️ خطوة 1 — أكمل إعداد مشروع Firebase

مشروعك `asianstore-31f22` موجود، لكن يحتاج بعض الخطوات من [console.firebase.google.com](https://console.firebase.google.com):

1. **فعّل Firestore**: من القائمة الجانبية → Build → Firestore Database → Create database
   → اختر **Production mode** (أو Test mode مؤقتًا) → اختر موقع الخادم الأقرب لك.
2. **فعّل Cloud Storage**: من القائمة الجانبية → Build → Storage → Get started
   → اتبع نفس الخطوات.
3. **احصل على apiKey و appId الحقيقيين**: ⚙️ Project settings (بجانب "Project Overview")
   → مرر للأسفل إلى "Your apps" → إذا لم يوجد تطبيق ويب، اضغط أيقونة `</>` لإنشاء واحد
   → انسخ `apiKey` و `appId` من كائن `firebaseConfig` المعروض.
4. **افتح `firebase.js`** وضع القيمتين مكان `YOUR_ACTUAL_API_KEY_HERE` و `YOUR_ACTUAL_APP_ID_HERE`.

## ⚠️ خطوة 2 — اضبط قواعد الأمان

بدون هذه الخطوة ستحصل على خطأ **"Missing or insufficient permissions"** عند أي قراءة أو كتابة.

**أسهل طريقة (نسخ ولصق يدوي):**
- افتح Firestore Database → تبويب **Rules** → الصق محتوى ملف `firestore.rules` → Publish.
- افتح Storage → تبويب **Rules** → الصق محتوى ملف `storage.rules` → Publish.

**أو عبر Firebase CLI** (إذا كان مثبتًا لديك):
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

اقرأ التعليق أعلى كل ملف rules — القواعد الحالية مفتوحة الكتابة مؤقتًا (خيار "Option A")
لأن لوحة التحكم لا تستخدم Firebase Authentication الحقيقية بعد، فقط حماية بسيطة من
جهة العميل (`auth.js`). هذا مقبول طالما أنت الوحيد الذي يدير المتجر، لكنه ليس حماية
حقيقية ضد شخص يعرف كيف يتصل بـ Firestore مباشرة. راجع "الخطوات التالية" أسفل الصفحة.

## ⚠️ خطوة 3 — لا يمكن فتح الملفات بالنقر المزدوج بعد الآن

بما أن `script.js` و `admin.js` و `firebase.js` أصبحت **ES Modules** (تستخدم `import`)،
المتصفح يرفض تحميلها إطلاقًا عبر `file://`. يجب تشغيل الموقع عبر خادم محلي:

```bash
cd اسم-المجلد
python3 -m http.server 8000
```

ثم افتح `http://localhost:8000/index.html` و `http://localhost:8000/admin.html`.
(أو أي خادم آخر: Live Server في VS Code، أو `firebase serve` إذا ثبّت Firebase CLI.)

## خطوة 4 — استورد منتجاتك الأولية

افتح `admin.html` (اسم المستخدم `admin`، كلمة المرور `AsianProducts2026` — غيّرهما في
`auth.js`). بما أن قاعدة البيانات فارغة الآن، ستجد في الحالة الفارغة زر:

**"أو استورد المنتجات الأولية الثمانية"**

اضغطه مرة واحدة فقط. سيقوم برفع الصور الفعلية الموجودة في `assets/products/` إلى
Cloud Storage، ثم يكتب 8 منتجات حقيقية (نفس الأسماء والأوصاف والمكوّنات المُستخرجة من
صور العبوات الأصلية) في Firestore بروابط الصور الحقيقية بعد الرفع. هذه العملية تستغرق
دقيقة أو دقيقتين لأنها ترفع الصور واحدة تلو الأخرى. **الأسعار في هذه المنتجات الثمانية
افتراضية** — عدّلها من زر ✏️ في كل صف بعد الاستيراد.

بعد هذا الاستيراد لأول مرة، أضف أي منتجات جديدة عبر "+ إضافة منتج جديد" العادي.

---

## أشياء يجب تعديلها (تذكير من قبل)

| الملف | ماذا تُعدّل |
|---|---|
| `auth.js` | اسم المستخدم وكلمة مرور لوحة التحكم |
| `script.js` | `WHATSAPP_NUMBERS` (رقميك الحقيقيين)، `DELIVERY_FEE` |
| `index.html` | أرقام الهاتف وروابط التواصل الاجتماعي في التذييل |
| `firebase.js` | `apiKey` و `appId` (خطوة 1 أعلاه) |

## كيف تعمل المزامنة الآن

- **المتجر (`script.js`)**: يشترك في تحديثات Firestore مباشرة (`onSnapshot`) — أي تغيير
  في لوحة التحكم يظهر فورًا في المتجر بدون تحديث الصفحة، حتى من جهاز آخر.
- **لوحة التحكم (`admin.js`)**: نفس الشيء — الجدول يتحدث تلقائيًا، ولا حاجة لإعادة تحميل
  بعد الحفظ أو الحذف.
- **السلة** لا تزال في `localStorage` — وهذا صحيح ومقصود، فالسلة بيانات خاصة بكل زبون
  على جهازه، وليست بيانات مشتركة يجب أن تكون في قاعدة البيانات.
- **الطلبات** لا تزال تُرسل مباشرة إلى واتساب فقط، بدون أي تخزين — لم يتغيّر هذا الجزء.

## بنية بيانات المنتج في Firestore

كل مستند في مجموعة `products` يحتوي بالضبط على:

```json
{
  "id": "معرّف المستند نفسه (يُضاف تلقائيًا)",
  "sku": "ASN-XX-0000",
  "name": "اسم المنتج",
  "category": "food | care | accessories",
  "categoryLabel": "أطعمة ومشروبات",
  "price": 1500,
  "originCountry": "كوريا الجنوبية",
  "images": ["https://firebasestorage.googleapis.com/.../image1.jpg"],
  "description": "وصف المنتج",
  "ingredients": ["مكوّن 1", "مكوّن 2"],
  "specifications": [{ "label": "الحجم", "value": "50 مل" }],
  "available": true,
  "createdAt": "طابع زمني من الخادم (لترتيب المنتجات)"
}
```

## الخطوات التالية (اختيارية)

1. **حماية حقيقية للوحة التحكم**: استبدال `auth.js` بـ Firebase Authentication الحقيقية
   (بريد إلكتروني/كلمة مرور)، ثم تغيير قواعد Firestore/Storage إلى `Option B` الموجودة
   كتعليق في `firestore.rules`. أخبرني إن أردت هذا التحديث.
2. **النشر عبر Firebase Hosting** بدل خادم محلي:
   ```bash
   firebase deploy --only hosting
   ```
   (ملف `firebase.json` و `.firebaserc` جاهزان لهذا مسبقًا بمعرّف مشروعك الحقيقي.)
