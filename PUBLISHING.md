# Publishing Guide

End-to-end reference for publishing this extension and setting up auto-deploy.

---

## 1. Donation (Ko-fi)

1. Sign up at [ko-fi.com](https://ko-fi.com)
2. Set up your page (name, bio, profile picture)
3. Your public URL will be `https://ko-fi.com/YOUR_USERNAME`
4. Replace the Ko-fi URL in these files:
   - `src/welcome.html` — the donate button `href`
   - `src/popup.js` — the `donateLink` click handler
   - `README.md` — the Ko-fi badge URL

---

## 2. Chrome Web Store — Developer Account

1. Go to [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
2. Sign in with your Google account
3. Pay the **one-time $5 registration fee**
4. Accept the developer agreement

---

## 3. Store Listing Assets

### Images required

| Asset | Size | Format | Required |
|---|---|---|---|
| Icon | 128×128 | PNG | ✅ |
| Screenshot(s) | 1280×800 or 640×400 | JPEG | ✅ min 1 |
| Small promo tile | 440×280 | JPEG | Optional |
| Marquee promo tile | 1400×560 | JPEG | Optional |

### Taking screenshots

1. Open YouTube in Chrome with the extension active
2. `F12` → toggle device toolbar → set resolution to **1280×800**
3. `Ctrl+Shift+P` → type `screenshot` → **Capture full size screenshot**
4. Recommended: one screenshot of the homepage (Shorts shelf gone), one with the popup open

### Store listing text

**Short description** (shown in search results, 132 char max):
```
Hides YouTube Shorts from your feed, sidebar, search, and channel pages. Toggle on/off instantly — no page refresh needed.
```

**Full description:**
```
Tired of YouTube Shorts hijacking your feed? This extension silently removes every trace of Shorts from YouTube — no refresh needed, no bloat.

WHAT GETS HIDDEN
• Shorts shelf on the homepage
• Shorts in search results
• Shorts tab on channel pages
• Shorts cards in the sidebar ("Up Next")
• Shorts link in the left navigation menu
• Shorts icon in the collapsed mini sidebar
• Shorts filter chip in search

HOW IT WORKS
Toggle the switch in the popup — changes apply instantly via CSS injection. Your preference syncs across devices via Chrome's built-in storage.

FREE & OPEN SOURCE
No tracking, no analytics, no permissions beyond what's needed.
```

**Category:** Productivity

---

## 4. First Manual Publish

> You only do this once. After this, CI/CD handles all future updates.

1. Create the ZIP from the project root:
   ```bash
   zip -r extension.zip manifest.json src/ icons/ --exclude "icons/icon.svg"
   ```

2. Go to your developer dashboard → **New item** → upload `extension.zip`

3. Fill in the store listing using the text above

4. Under **Privacy practices** → select "This extension does not collect user data"

5. Click **Submit for review** — Google typically takes 1–3 business days

6. Once the item is created, copy your **Extension ID** from the dashboard URL — you need it for CI/CD

---

## 5. CI/CD — Auto-publish on Push to Main

Every push to `main` will automatically package and publish to the Chrome Web Store via GitHub Actions (`.github/workflows/release.yml`).

You need **4 secrets** added to your GitHub repo:
`Settings → Secrets and variables → Actions → New repository secret`

| Secret name | Value |
|---|---|
| `EXTENSION_ID` | From the Chrome Web Store dashboard URL |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console (see below) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console (see below) |
| `GOOGLE_REFRESH_TOKEN` | From the OAuth flow (see below) |

---

### 5a. Google Cloud — Create Project & Enable API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Top bar → project dropdown → **New Project** → create it
3. With the project selected, go to **APIs & Services** → **Enable APIs and Services**
4. Search **Chrome Web Store API** → click it → **Enable**

### 5b. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
2. If prompted, configure the consent screen first:
   - User type: **External**
   - Fill in app name and your email → **Save and Continue** through the rest
3. Back to Create Credentials:
   - Application type: **Desktop app**
   - Name it anything → **Create**
4. Copy the **Client ID** and **Client Secret**
5. Add them as GitHub secrets: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 5c. Get the Refresh Token

**Step 1** — Open this URL in your browser (replace `YOUR_CLIENT_ID`):
```
https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code&scope=https://www.googleapis.com/auth/chromewebstore
```

Sign in with the Google account that owns the Web Store developer account. Copy the **authorization code** shown on screen.

**Step 2** — Exchange the code for a refresh token (replace all 3 values):
```bash
curl -X POST https://oauth2.googleapis.com/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_AUTH_CODE \
  -d grant_type=authorization_code \
  -d redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

The JSON response will contain:
```json
{
  "refresh_token": "1//xxxxxx..."
}
```

**Step 3** — Add the value as GitHub secret: `GOOGLE_REFRESH_TOKEN`

---

### 5d. Verify CI/CD is working

Push any small change to `main`. Go to your repo → **Actions** tab — you should see the workflow running. On success it uploads and publishes the new version automatically.

To bump the version, update `"version"` in `manifest.json` before pushing — Chrome Web Store requires a higher version number on each publish.

---

## Version bumping

`manifest.json` uses semver `MAJOR.MINOR.PATCH` (e.g. `1.1.0`).

| Change type | Example bump |
|---|---|
| Bug fix / selector update | `1.1.0` → `1.1.1` |
| New feature | `1.1.0` → `1.2.0` |
| Major redesign | `1.1.0` → `2.0.0` |

The CI workflow publishes whatever version is in `manifest.json` at the time of the push.
