# מדריך התקנה והרצה - מסלול טיולים אפקה 2026

## דרישות מוקדמות

לפני ההתקנה ודאו שהכלים הבאים מותקנים:

| כלי | גרסה מינימלית | הורדה |
|-----|---------------|-------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| MongoDB | 6+ | [mongodb.com](https://www.mongodb.com/try/download/community) או [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (ענן חינמי) |

### מפתחות API נדרשים

| שירות | שימוש | הרשמה |
|--------|-------|-------|
| Groq | יצירת מסלולים (LLM) - **חינמי** | [console.groq.com](https://console.groq.com) |
| Unsplash | תמונות (אופציונלי) | [unsplash.com/developers](https://unsplash.com/developers) (חינמי) |
| OpenWeatherMap | תחזית מזג אוויר | [openweathermap.org](https://openweathermap.org/api) (חינמי) |
| OpenRouteService | ניתוב מסלולים על מפה | [openrouteservice.org](https://openrouteservice.org/dev/#/signup) (חינמי, 2000 בקשות/יום) |

---

## התקנה מהירה (אוטומטית)

### אפשרות 1: סקריפט Setup אינטראקטיבי

```bash
npm run setup
```

הסקריפט יתקין את כל החבילות, יבקש ממך את מפתחות ה-API וייצור את קבצי ההגדרות אוטומטית.

### אפשרות 2: קובץ start.bat (Windows)

לחצו פעמיים על `start.bat` - הוא יתקין חבילות (אם צריך) ויפעיל את שני השרתים.

---

## התקנה ידנית (צעד אחר צעד)

### שלב 1: התקנת חבילות

```bash
# מתיקיית הפרויקט הראשית
npm install

# Express server
cd express-server
npm install
cd ..

# Next.js client
cd nextjs-client
npm install
cd ..
```

### שלב 2: הגדרת משתני סביבה

#### Express Server

צרו קובץ `express-server/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/travel-routes
JWT_SECRET=your-secret-key-minimum-32-characters-long
JWT_REFRESH_SECRET=another-secret-key-minimum-32-characters
CLIENT_URL=http://localhost:3000
```

#### Next.js Client

צרו קובץ `nextjs-client/.env.local`:

```env
NEXT_PUBLIC_EXPRESS_URL=http://localhost:4000
MONGODB_URI=mongodb://localhost:27017/travel-routes
JWT_SECRET=your-secret-key-minimum-32-characters-long
GROQ_API_KEY=gsk_your-groq-key-here
UNSPLASH_ACCESS_KEY=your-unsplash-key-optional
OPENWEATHER_API_KEY=your-key-here
ORS_API_KEY=your-key-here
```

> **חשוב!** הערך של `JWT_SECRET` חייב להיות **זהה** בשני הקבצים. כך שרת Express מנפיק אסימון ושרת Next.js מאמת אותו.

> **MongoDB Atlas?** אם אתם משתמשים ב-Atlas במקום MongoDB מקומי, שנו את `MONGODB_URI` לכתובת שקיבלתם מ-Atlas, למשל:
> `mongodb+srv://user:pass@cluster.mongodb.net/travel-routes`

### שלב 3: הפעלת MongoDB

אם MongoDB מותקן מקומית:

```bash
mongod
```

אם אתם משתמשים ב-MongoDB Atlas - אין צורך בשלב זה.

---

## הרצה

### אפשרות 1: פקודה אחת (מומלץ)

```bash
npm run dev
```

מפעיל את שני השרתים במקביל באותו טרמינל.

### אפשרות 2: start.bat (Windows)

לחצו פעמיים על `start.bat` - פותח שני חלונות טרמינל ואת הדפדפן.

### אפשרות 3: שני טרמינלים נפרדים

```bash
# טרמינל 1
cd express-server
npm run dev
```

```bash
# טרמינל 2
cd nextjs-client
npm run dev
```

### כתובות

| שרת | כתובת | תיאור |
|------|--------|--------|
| Next.js | [http://localhost:3000](http://localhost:3000) | האפליקציה הראשית |
| Express | [http://localhost:4000](http://localhost:4000) | שרת הזדהות |

---

## שימוש ראשוני

1. פתחו `http://localhost:3000` בדפדפן
2. תועברו לדף **התחברות** - לחצו על **"אין לך חשבון? הירשם"**
3. מלאו שם מלא, אימייל וסיסמה (ואופציונלי: שם בן/בת זוג)
4. לאחר הרשמה תועברו לדף הבית
5. עברו ל**"תכנון מסלולים"** כדי ליצור מסלול חדש

---

## פתרון בעיות

### "ECONNREFUSED" / "שגיאת חיבור לשרת"
- ודאו ששרת Express רץ על פורט 4000
- ודאו שהכתובת `NEXT_PUBLIC_EXPRESS_URL` נכונה

### "MongoDB connection error"
- ודאו ש-MongoDB רץ (`mongod`)
- ודאו שה-`MONGODB_URI` נכון

### "GROQ_API_KEY missing" / "מפתח Groq API לא הוגדר"
- ודאו שהקובץ `nextjs-client/.env.local` קיים ומכיל את `GROQ_API_KEY`
- קבלו מפתח חינמי מ-[console.groq.com](https://console.groq.com/keys)
- הפעילו מחדש את שרת Next.js לאחר שינוי ב-.env

### "JWT invalid" / הפניה חוזרת ללוגין
- ודאו שה-`JWT_SECRET` **זהה** בשני קבצי ה-.env
- נסו להתנתק ולהתחבר מחדש

### "ORS routing failed" (מסלול ביקו ישר)
- ודאו שמפתח ORS_API_KEY תקף
- ייתכן שהאזור המבוקש אינו נתמך ע"י ORS - המפה תציג קווים ישרים כ-fallback
