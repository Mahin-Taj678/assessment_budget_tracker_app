# 💜 BudgetFlow - Next.js & Firebase

A modern, full-stack personal finance and budget tracker designed with a stunning UI, dynamic animations, and real-time cloud syncing.

## Architecture and Technologies
* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
* **Backend BaaS:** [Firebase](https://firebase.google.com/) (Authentication & Firestore NoSQL Database)
* **Animation:** [Framer Motion](https://www.framer.com/motion/)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) synced natively with Firestore listeners

---

## 💾 Understanding the Database (Firestore)
Unlike traditional SQL databases (like MySQL or PostgreSQL) which use "Tables" and "Rows", this application uses **Firebase Firestore**. Firestore is a **NoSQL Document database**. 

### How Data is Stored
Data is stored in **Collections** which contain **Documents**. Think of a Collection as a folder, and a Document as a specific JSON file inside that folder.

For BudgetFlow, data is structured per-user for absolute privacy:
- `users/` (Collection)
  - `{User-ID}` (Document - represents the authenticated user)
    - `userData/` (Sub-collection)
      - `budget` (Document: stores `monthlyLimit`, `savingsGoal`, `savingsProgress`, and `gamePoints`)
    - `transactions/` (Sub-collection)
      - `{Transaction-ID}` (Document: stores `amount`, `category`, `date`, `notes`, and `type`)

### **How to Access and View Your Data**
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your project (`budget-tracker-867b5`).
3. On the left sidebar, click on **Firestore Database**.
4. You will see a panel showing your database structure. Click on `users`, then click on a user ID, and you will see the connected nested collections (`transactions` and `userData`). You can manually edit, delete, or add documents from this web interface!

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the App:** Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploying to Firebase Hosting
Firebase provides native support for hosting Next.js applications through its "Web Frameworks" integration.

**Step 1: Install Firebase CLI**
If you haven't already, install the Firebase Command Line Interface globally:
```bash
npm install -g firebase-tools
```

**Step 2: Login via Terminal**
```bash
firebase login
```
*(This will open a browser window to authenticate with your Google account)*

**Step 3: Initialize Firebase**
In the root directory of this project (`budget-tracker-nextjs`), run:
```bash
firebase init hosting
```
* **Select** your existing project (`budget-tracker-867b5`).
* **Source directory:** Next.js uses an experimental web framework feature. Firebase will automatically detect it's a Next.js app and ask if you want to use the web framework. Say **Yes**.
* **Region:** Choose a region close to you (e.g., `us-central1`).
* **Automatic builds via GitHub:** You can say No for manual deployments.

**Step 4: Deploy**
```bash
firebase deploy --only hosting
```
Firebase will automatically run `npm run build`, bundle your Next.js app, configure cloud functions for SSR (if required), and give you a live HTTPS web URL!

---

## 🐙 Pushing to GitHub

To push this codebase to a new GitHub repository:

1. Go to [GitHub](https://github.com/) and create a new, empty repository (e.g., `budgetflow-nextjs`). Do not add a README or .gitignore yet.
2. Open your terminal in the `budget-tracker-nextjs` folder.
3. Add the GitHub remote URL and push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/budgetflow-nextjs.git
git branch -M main
git push -u origin main
```
