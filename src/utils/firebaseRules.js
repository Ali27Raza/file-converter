// ============================================
// FIREBASE STORAGE RULES
// Copy this to: Firebase Console > Storage > Rules
// ============================================
/*
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow upload to uploads folder (authenticated or anonymous)
    match /uploads/{userId}/{fileName} {
      allow read, write: if request.resource.size < 100 * 1024 * 1024
                         && request.resource.contentType.matches('.*');
    }
    // Allow reading converted files
    match /converted/{fileName} {
      allow read: if true;
    }
  }
}
*/

// ============================================
// FIRESTORE RULES
// Copy this to: Firebase Console > Firestore > Rules
// ============================================
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Users can read/write their own conversions
    match /conversions/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
*/

// ============================================
// .env.local - create this in your project root
// ============================================
/*
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_CLOUDCONVERT_API_KEY=your_cloudconvert_key
*/

export {};
