# ❤️ Nikesh's Birthday Surprise Website

A high-performance, single-page interactive birthday surprise website made with HTML, CSS (Vanilla), and JavaScript. It features smooth transitions, custom canvas-based particle engines (fireworks, hearts, confetti), a virtual cake cutting interaction, interactive lights off/on, an openable handwritten envelope, and a built-in soft synthesizer melody.

## ✨ Features Included

1. **Loading Screen**: Elegant entrance with pulse animation.
2. **Permission Check**: Fun verification with a humorous "No" button escaping trick.
3. **Lights Off Phase**: Atmospheric switch to dark mode, generating glowing stars.
4. **Room Decoration**: Automatic falling balloon & lights loading indicator.
5. **Birthday Reveal**: Giant firework reveal for **Nikesh Thapa**.
6. **Memory Timeline**: Chronological journey card-timeline with styled image frames.
7. **Virtual Cake Slicing**: Slices open with a knife path & bursts confetti.
8. **Flower Bouquet**: Soft opening bouquet animations.
9. **Future Bucket List**: Interactive cards showing couples goals.
10. **Secret Envelope**: Realistic 3D opening envelope revealing your handwritten letter line-by-line.
11. **Grand Finale**: Merged fireworks, hearts, and confetti loop.

---

## 🚀 How to Run Locally

Since this project is built using vanilla web languages, there's **no build process or installation needed**!

1. Download or clone this folder.
2. Double-click [index.html](file:///c:/Users/USER.DK-L-R-359/Desktop/Birthday-wishes-website/index.html) to open the website directly in any web browser!

---

## 🎨 Customizations & Asset Setup

You can easily replace the images and background music to make it fully personalized:

### 1. Adding Your Photos
Place your images inside this root folder matching these exact filenames:
- **Bengaluru Birthday (2023)**: Save your image as `borma_2023.jpg`
- **Manali Trek (2025)**: Save your image as `manali_2025.jpg`
- **Grand Finale Picture**: Save your image as `us_together.jpg`

*Note: If no image is added, the website will automatically load a gorgeous, custom SVG placeholder so that it never looks broken!*

### 2. Changing the Background Music
By default, the website uses the browser's built-in **Web Audio API** to generate a soft, romantic melody on the fly. 
If you want to play a specific MP3 song instead:
1. Copy your MP3 file into the root folder (e.g., `music.mp3`).
2. Open [script.js](file:///c:/Users/USER.DK-L-R-359/Desktop/Birthday-wishes-website/script.js).
3. Update the top line:
   ```javascript
   const CUSTOM_MP3_URL = "music.mp3";
   ```

---

## 🌐 Free Hosting Options

You can host this site online completely free in just a few clicks:

### Option A: Vercel (Easiest)
1. Go to [Vercel](https://vercel.com/) and log in (or sign up with a free account).
2. Install the Vercel CLI or connect your GitHub repository.
3. If you want drag-and-drop: Go to [Vercel Projects](https://vercel.com/new), select **Vercel Ship** or directly drag and drop the folder containing your files into their deployment zone.
4. Your website is instantly live with a free custom `.vercel.app` URL!

### Option B: GitHub Pages
1. Push this folder to a public repository on your GitHub account.
2. Go to **Settings** -> **Pages** in your GitHub repository.
3. Under **Build and deployment**, select **Deploy from a branch** and choose your branch (usually `main`).
4. Click **Save**. Within 1–2 minutes, your website will be live at `https://username.github.io/repository-name/`!
