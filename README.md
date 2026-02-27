# מסלול טיולים אפקה 2026

> פרויקט סיום - פיתוח בפלטפורמת WEB | סמסטר א' 2026

מערכת לתכנון מסלולי טיולים חכמה המבוססת על בינה מלאכותית, מפות אינטראקטיביות ותחזית מזג אוויר.

## ארכיטקטורה

הפרויקט מורכב משני שרתים:

### Express Server (Port 4000) - שרת הזדהות
- הרשמה והתחברות עם הצפנת סיסמאות (bcrypt + salt)
- הנפקת אסימון JWT הכולל שמות המגישים
- רענון שקוף (silent refresh) של האסימון אחת ליום
- ניהול refresh tokens

### Next.js Server (Port 3000) - אפליקציה ראשית
- Middleware לאימות JWT בכל דף (רך - שקוף למשתמש)
- דף בית - `index` (מסלול טיולים אפקה 2026)
- דף תכנון מסלולים - יצירת מסלולים עם LLM + מפות Leaflet
- דף היסטוריה - שליפת מסלולים שמורים מבסיס נתונים
- API Routes לתקשורת עם שירותים חיצוניים

## תכונות

- **תכנון מסלולי אופניים**: 2-3 ימים רציפים, 30-70 ק"מ ליום, מעיר לעיר
- **תכנון מסלולי טרק**: 1-3 מסלולים מעגליים, 5-10 ק"מ כל אחד
- **מסלולים ריאליסטיים**: שימוש ב-OpenRouteService למסלולים על כבישים/שבילים אמיתיים
- **תחזית מזג אוויר**: 3 ימים הקרובים באזור המסלול (WeatherAPI.com)
- **תמונות**: תמונה מאפיינת של המדינה (DALL-E / Unsplash)
- **שמירה והיסטוריה**: אישור ושמירת מסלולים בבסיס נתונים MongoDB

## טכנולוגיות

| רכיב | טכנולוגיה |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend Auth | Express.js, JWT, bcrypt |
| Database | MongoDB + Mongoose |
| Maps | Leaflet.js, OpenRouteService |
| AI/LLM | Groq (Llama 3.3 70B) - חינמי |
| Weather | WeatherAPI.com |
| Images | Unsplash API / Picsum |

## דרישות מוקדמות

- **Node.js** 18+ 
- **MongoDB** (מקומי או MongoDB Atlas)
- **מפתחות API**:
  - Groq API Key (ליצירת מסלולים - חינמי)
  - WeatherAPI.com Key (תחזית מזג אוויר)
  - OpenRouteService API Key (ניתוב על מפות)

## התקנה

### 1. שכפול הפרויקט

```bash
git clone <repository-url>
cd WebFinalProject
```

### 2. התקנת שרת Express

```bash
cd express-server
npm install
cp .env.example .env
# ערוך את קובץ .env והכנס את הפרטים שלך
```

### 3. התקנת לקוח Next.js

```bash
cd ../nextjs-client
npm install
cp .env.example .env.local
# ערוך את קובץ .env.local והכנס את הפרטים שלך
```

### 4. הגדרת משתני סביבה

**express-server/.env:**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/travel-routes
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CLIENT_URL=http://localhost:3000
```

**nextjs-client/.env.local:**
```
NEXT_PUBLIC_EXPRESS_URL=http://localhost:4000
MONGODB_URI=mongodb://localhost:27017/travel-routes
JWT_SECRET=your-secret-key-here  # (same as Express!)
GROQ_API_KEY=gsk_...
UNSPLASH_ACCESS_KEY=...  # optional
WEATHERAPI_KEY=...
ORS_API_KEY=...
```

> **חשוב:** `JWT_SECRET` חייב להיות זהה בשני השרתים!

### 5. הפעלה

פתח שני חלונות טרמינל:

```bash
# טרמינל 1 - Express server
cd express-server
npm run dev
```

```bash
# טרמינל 2 - Next.js
cd nextjs-client
npm run dev
```

גש ל-[http://localhost:3000](http://localhost:3000) בדפדפן.

## קבלת מפתחות API

### Groq (חינמי)
1. צור חשבון ב-[console.groq.com](https://console.groq.com)
2. צור API Key ב-Keys (ללא כרטיס אשראי)

### Unsplash (אופציונלי - לתמונות)
1. צור חשבון ב-[unsplash.com/developers](https://unsplash.com/developers)
2. צור אפליקציה וקבל Access Key

### WeatherAPI.com
1. צור חשבון ב-[weatherapi.com](https://www.weatherapi.com/signup.aspx)
2. קבל API Key חינמי (Free tier)

### OpenRouteService
1. צור חשבון ב-[openrouteservice.org](https://openrouteservice.org)
2. קבל API Key חינמי (2,000 בקשות/יום)

## מבנה הפרויקט

```
WebFinalProject/
├── express-server/          # שרת הזדהות Express
│   ├── server.js            # נקודת כניסה
│   ├── config/db.js         # חיבור MongoDB
│   ├── models/User.js       # מודל משתמש
│   ├── routes/auth.js       # נתיבי הזדהות
│   └── middleware/auth.js   # אימות JWT
│
├── nextjs-client/           # אפליקציית Next.js
│   ├── src/
│   │   ├── middleware.ts    # JWT middleware
│   │   ├── app/
│   │   │   ├── page.tsx     # דף בית
│   │   │   ├── login/       # דף התחברות
│   │   │   ├── planning/    # תכנון מסלולים
│   │   │   ├── history/     # היסטוריית מסלולים
│   │   │   └── api/         # API routes
│   │   ├── components/      # רכיבי UI
│   │   ├── lib/             # ספריות עזר
│   │   └── models/          # מודלי MongoDB
│   └── public/
│
└── README.md
```

## שימוש

1. **הרשמה** - צור חשבון עם שם מלא, אימייל וסיסמה
2. **תכנון מסלול** - בחר יעד, סוג טיול (אופניים/טרק) ומשך
3. **צפה במסלול** - המסלול יוצג על מפה עם תחזית מזג אוויר ותמונה
4. **אשר ושמור** - אשר את המסלול כדי לשמור אותו בבסיס הנתונים
5. **היסטוריה** - צפה במסלולים שנשמרו בעבר עם תחזית מזג אוויר עדכנית

## Known Bugs / בעיות ידועות

- Unsplash Source API הוצא משימוש - במקרה של כשל ב-DALL-E, תמונה עלולה לא להופיע
- עבור מסלולים באזורים מרוחקים, ORS עלול לא למצוא מסלול ריאליסטי - במקרה כזה יוצג קו ישר בין הנקודות
