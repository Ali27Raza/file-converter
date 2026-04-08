# NextConvertIFile 🗂️

A full-featured online file converter website built with React + Firebase.

## Quick Start

### 1. Install Dependencies

```bash
cd nextconvertifile
npm install
```

### 2. Set Up Python Backend

1. Install Python 3.7+ if not already installed
2. Install Pandoc: https://pandoc.org/installing.html
3. Install backend dependencies:

```bash
cd python-backend
pip install -r requirements.txt
```

### 3. Run the Application

**Option A: Run Python backend manually**

```bash
# Terminal 1: Start Python backend
cd python-backend
python app.py

# Terminal 2: Start React frontend
cd ..
npm start
```

**Option B: Use batch script (Windows)**

```bash
# Run Python backend
run-python-backend.bat

# In another terminal, run React frontend

```

src/
├── components/
│ ├── Navbar.js # Navigation with dropdown menus
│ ├── Navbar.css
│ ├── Footer.js # Footer with links
│ └── Footer.css
├── context/
│ └── AuthContext.js # Firebase auth state management
├── pages/
│ ├── Home.js # Landing page with file uploader
│ ├── Home.css
│ ├── Convert.js # Conversion workflow + result page
│ ├── Convert.css
│ ├── Auth.js # Login + Signup pages
│ ├── Auth.css
│ ├── Pricing.js # Pricing plans
│ ├── Pricing.css
│ ├── Tools.js # All tools directory
│ └── Tools.css
├── utils/
│ ├── conversionService.js # File upload + conversion logic (calls Python backend)
│ └── firebaseRules.js # Firebase security rules
├── firebase.js # Firebase initialization
├── App.js # Routes
├── index.js # Entry point
└── index.css # Global styles + CSS variables

````

## Features

- ✅ File drag & drop upload
- ✅ 200+ format conversions (PDF, DOCX, JPG, PNG, MP4, MP3, etc.)
- ✅ Upload progress tracking
- ✅ Conversion success/download page
- ✅ User authentication (Email + Google)
- ✅ Conversion history saved to Firestore
- ✅ Firebase Storage for file handling
- ✅ Responsive design (mobile-friendly)
- ✅ Ad placement slots built in
- ✅ Pricing page with monthly/yearly toggle
- ✅ Full tools directory with search + filter

## Deployment (Firebase Hosting - Free)

```bash
npm install -g firebase-tools
npm run build
firebase login
firebase init hosting
# Select build/ as public directory, yes to SPA
firebase deploy
````

Your site will be live at `your-project.web.app` 🚀

## Tech Stack

| Tech               | Purpose                              |
| ------------------ | ------------------------------------ |
| React 18           | Frontend framework                   |
| React Router v6    | Client-side routing                  |
| Flask              | Python backend API                   |
| pypandoc           | Word to PDF conversion library       |
| Firebase Auth      | User authentication                  |
| Firebase Firestore | Database (conversion history, users) |
| Firebase Storage   | File upload/storage                  |
| react-dropzone     | Drag & drop file upload              |

## Adding Google AdSense

Replace the `.ad-slot` placeholder divs in `Home.js`, `Convert.js` with:

```html
<ins className="adsbygoogle"
     style={{display: 'block'}}
     data-ad-client="ca-pub-YOUR_ID"
     data-ad-slot="YOUR_SLOT"
     data-ad-format="auto">
</ins>
```
