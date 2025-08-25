# 🧠 DSA Instructor Chrome Extension

A Chrome extension that gives you **hints and debugging help for Data Structures & Algorithms (DSA) problems**—perfect for use with LeetCode or any coding site! Powered by Google Gemini API.

---

## ✨ Features

- Get step-by-step DSA hints (never full solutions)
- Debug code by identifying logical and syntax errors
- Designed for use with LeetCode, but works on any website
- Clean, responsive popup UI
- Powered by Gemini API (Google Generative Language)

---

## 🚀 Installation

1. **Clone or Download this Repository**

2. **Add Your Gemini API Key**

   - Open `popup.js`
   - Replace the placeholder with your actual Gemini API key:
     
     const API_KEY = "YOUR_GEMINI_API_KEY_HERE";
     
   - **Never share your real API key publicly!**

3. **Load the Extension in Chrome**

   - Go to `chrome://extensions/`
   - Enable **Developer mode** (top right)
   - Click **Load unpacked**
   - Select the folder containing this extension's files

---

## 🛠️ Usage

1. Open any coding site (e.g., LeetCode)
2. Click the 🧠 DSA Instructor extension icon in your Chrome toolbar
3. Paste your coding problem or the doubt you have into the textarea
4. Click **Get Hint**
5. View your hint and debugging help instantly!

---

## 📝 How It Works

- The extension sends your question/code to the Gemini API.
- The AI responds with hints, debugging tips, and clarifying questions.
- The extension **never provides full solutions**—it guides you to learn and solve problems yourself.

---

## 🔒 Security

- **Your API key is never uploaded to GitHub** (unless you add it yourself).
- Always keep your API key private.
- If you plan to share this extension, instruct users to add their own API key in `popup.js`.

---

## 📁 Project Structure

```
DSAInstructor/
│
├── manifest.json        # Chrome extension manifest
├── popup.html           # Extension popup UI
├── popup.js             # Main extension logic (API calls, UI)
├── style.css            # Styling for popup
└── README.md            # This file
```

---

## 🧑‍💻 Customization

- **Want to support other APIs or add features?**  
  Fork this repo and modify `popup.js` as needed!

---

## ❓ FAQ

**Q: Is my data sent to Google?**  
A: Yes, your question/code is sent to the Gemini API for processing.

**Q: Can I use this on any website?**  
A: Yes! The popup works everywhere.

**Q: How do I get a Gemini API key?**  
A: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate your key.

---

## 📢 Contributing

Pull requests and suggestions are welcome!

---

## 📜 License

MIT License

---

**Enjoy learning DSA