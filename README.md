

# GradSongWithLyrics

<img width="800" height="500" alt="Screenshot 2026-04-22 at 11 15 55 PM" src="https://github.com/user-attachments/assets/1c108a47-1679-49b7-be4b-fa4385342c39" />
<img width="800" height="500" alt="Screenshot 2026-04-22 at 11 16 28 PM" src="https://github.com/user-attachments/assets/26e1bdcb-f035-4515-8a01-88077cc7f160" />

## Firebase Stars (Firestore)

This project uses Firestore for a per-song star counter.

- New collection added: `starCounters`
- Existing collections are not deleted: `reservations`, `socialLinks`, `studentLogs`
- Each star click increments `starCounters/{songId}` and logs to `studentLogs`

### Local setup

1. Fill in `.env` (or copy `.env.example` → `.env`)
2. Generate `firebase-config.json`:

`node scripts/generate-firebase-config.mjs`

Note: `firebase-config.json` is intentionally not committed (it contains your Firebase web config).

### GitHub Pages setup (Secrets)

Add these GitHub repo secrets (Settings → Secrets and variables → Actions):

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `FIREBASE_MEASUREMENT_ID` (optional)


Static page for Bestlink College of the Philippines graduation songs with embedded YouTube videos and a lyrics section.

## Run

Open `index.html` in a browser, or serve the folder with Apache (XAMPP).

If you use XAMPP, make sure this project is inside your `htdocs` and then visit the folder in your browser.

## Add lyrics

Edit/add files inside `lyrics/` (see `lyrics/README.md`).
