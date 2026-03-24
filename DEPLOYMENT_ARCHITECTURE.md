# BudgetFlow - Architecture & Deployment Guide

This document covers the end-to-end technical architecture, Firebase NoSQL database structure, and the complete deployment strategy for the BudgetFlow Next.js application.

---

## 🏗️ Technical Architecture

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) (Configured for static export)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Backend BaaS:** [Firebase](https://firebase.google.com/) (Authentication & Firestore NoSQL Database)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (synced natively with real-time Firebase Firestore listeners)

---

## 💾 Firestore Database Structure

Unlike traditional SQL databases which use rigid tables, this application uses **Firebase Firestore**, a highly scalable NoSQL Document database. Data is organized into **Collections** and **Documents**.

For absolute privacy and rapid multi-device syncing, the data is securely siloed per-user:

- `users/` *(Root Collection)*
  - `{Authenticated-User-ID}` *(Document)*
    - `userData/` *(Sub-collection)*
      - `budget` *(Document)* (Stores `monthlyLimit`, `savingsGoal`, `savingsProgress`, and `gamePoints`)
    - `transactions/` *(Sub-collection)*
      - `{Transaction-ID}` *(Document)* (Stores `amount`, `category`, `date`, `notes`, and `type`)

Because of this structure, multiple users can log in simultaneously without their data ever touching.

---

## 🌐 End-to-End Firebase Deployment

The application is configured specifically to compile into static HTML/JS assets (`output: "export"`) which makes it incredibly fast and cheap to host statically on Firebase Hosting.

### 1. Prerequisite Checks
Ensure you have the Firebase CLI installed and your Next.js application builds correctly:
```bash
npm install -g firebase-tools
npm run build
```
*(The build command will compile your entire application into the `out/` directory).*

### 2. Authentication
Log in to your Google Account containing the Firebase project:
```bash
firebase login
```

### 3. Initialization (If not already initialized)
We initialize Firebase Hosting to point strictly to the Next.js `out/` directory.
```bash
firebase init hosting
```
- **Select existing project**: `budget-tracker-867b5`
- **Public directory**: `out`
- **Configure as single-page app**: `Yes`
- **Automatic GitHub builds**: `No` (or setup separately)

### 4. Deploying to the Cloud
Once initialized and built, deploying requires only one command:
```bash
firebase deploy --only hosting
```

Your live project will be aggressively cached globally via Firebase's CDN and immediately accessible via your `.web.app` or `.firebaseapp.com` URL!
