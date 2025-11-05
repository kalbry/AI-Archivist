<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Archivist

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:** Node.js (we recommend an LTS release like Node 18 or 20)

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```sh
    npm install
    ```

2.  **Run in Development Mode:**
    This project uses Vite for a fast frontend development experience with hot-reloading. You'll need two terminal windows.

    *   In your **first terminal**, start the Vite dev server:
        ```sh
        npm run dev
        ```
    *   In your **second terminal**, start the Electron application shell:
        ```sh
        npm start
        ```

    The Electron window will open and load the app from the Vite server. Changes you make to the React code will now appear instantly.

3.  **Build for Production:**
    To package the application for distribution, run:
    ```sh
    npm run electron:build
    ```
    This will create a production-ready installer in the `dist` folder.
