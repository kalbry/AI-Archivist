<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/14KopxeaB9dyr9pfe8-sgIRF24PyK7yv-

## Run Locally

**Prerequisites:** Node.js (use Node LTS)

We recommend using an LTS Node release (Node 18 or Node 20). Native modules such as `better-sqlite3` provide prebuilt binaries for LTS versions and will install reliably on those runtimes.

If you use nvm (macOS/Linux) or nvm-windows, you can switch to Node 18 with:

```powershell
# nvm (macOS/Linux)
nvm install 18
nvm use 18

# nvm-windows
nvm install 18.20.0
nvm use 18.20.0
```

You can also use the provided `.nvmrc` to pick the recommended version:

```powershell
nvm use # will read .nvmrc and switch to Node 18
```

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app in dev mode:
   ```powershell
   npm run dev
   ```
