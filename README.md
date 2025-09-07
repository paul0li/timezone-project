# 🌍 World Time Zone Converter

A modern, interactive timezone converter that works just like **timeanddate.com**. Each timezone has its own editable time input, and when you change any time, all others update automatically with the edited timezone highlighted as the reference.


## ✨ Features

### 🔄 **Multi-Timezone Inputs**
- **5 configurable timezones**: Chile, United States (NY), Argentina, Colombia, Dominican Republic
- **Individual time inputs** for each timezone
- **Any timezone can be the source** - just edit any time input

### 🎯 **Smart Auto-Conversion**
- **Real-time updates**: Change any time and all others update instantly
- **Visual highlighting**: The edited timezone is highlighted as the active reference
- **Automatic DST handling**: Daylight Saving Time is calculated automatically
- **UTC offset display**: Shows current UTC offset for each timezone

### 🎨 **Modern Interface**
- **timeanddate.com inspired design**
- **Responsive layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth animations**: Hover effects and transitions
- **Status indicators**: Clear feedback on which timezone is being used as reference

### ⚡ **Technical Features**
- **No external dependencies**: 100% client-side with `Intl.DateTimeFormat`
- **No backend**: Ideal for GitHub Pages
- **Error handling**: Clear messages in the UI
- **Auto-detection**: Detects and displays your local timezone

## 🚀 Demo

Publish with GitHub Pages (see section below) and your demo will be available at `https://paul0li.github.io/timezone-project/`.

## 🛠️ How It Works

1. **Load**: Displays current time in Chile as default reference
2. **Edit**: Click any time input to change it
3. **Convert**: All other timezones update automatically
4. **Highlight**: The edited timezone is visually highlighted
5. **Repeat**: Edit any other timezone to make it the new reference

## 🏃‍♂️ Quick Start

### Prerequisites
- None required to use the static version
- Optional: Python 3 or Node.js to serve `docs/` locally

### Local Development (Static)

Option 1 (no install):
```bash
# On macOS or any system with Python 3
python3 -m http.server 5500 -d docs
# Open http://localhost:5500
```

Option 2 (with Node):
```bash
npx serve docs
# Open the URL shown by the command (e.g. http://localhost:3000)
```

## 📁 Project Structure

```
timezone-project/
├── docs/                  # Static site for GitHub Pages
│   ├── index.html         # Main interface
│   ├── script.js          # 100% client-side time conversion logic
│   ├── styles.css         # Modern styling
│   └── .nojekyll          # Avoid Jekyll processing
├── README.md              # This file
├── LICENSE
└── .gitignore
```

## 🔧 Backend/API

This build is 100% static and exposes no endpoints. All conversions run in the browser using the `Intl.DateTimeFormat` API, including proper DST handling.

## 🌐 Supported Timezones

| Country | City | IANA Identifier | UTC Offset* |
|---------|------|-----------------|-------------|
| 🇨🇱 Chile | Santiago | `America/Santiago` | UTC-3/-4 |
| 🇺🇸 United States | New York | `America/New_York` | UTC-5/-4 |
| 🇦🇷 Argentina | Buenos Aires | `America/Argentina/Buenos_Aires` | UTC-3 |
| 🇨🇴 Colombia | Bogotá | `America/Bogota` | UTC-5 |
| 🇩🇴 Dominican Republic | Santo Domingo | `America/Santo_Domingo` | UTC-4 |

*UTC offsets vary due to Daylight Saving Time

## 🎨 Customization

### Adding New Timezones

1. **Update the timezone data** in `docs/script.js`:
```javascript
const timezoneData = {
  // Add your timezone here
  "Europe/London": {
    name: "United Kingdom",
    location: "London",
    country: "GB",
  },
  // ... existing timezones
};
```

2. **Add HTML card** in `docs/index.html`:
```html
<div class="timezone-card" data-timezone="Europe/London">
  <div class="card-header">
    <div class="flag-container" id="flag-Europe/London"></div>
    <div class="timezone-info">
      <div class="timezone-name">United Kingdom</div>
      <div class="timezone-location">London</div>
    </div>
  </div>
  <div class="time-section">
    <input type="time" class="time-input" data-timezone="Europe/London" step="60" />
    <div class="ampm-display">AM</div>
    <div class="timezone-offset" data-timezone="Europe/London">UTC±0</div>
  </div>
</div>
```

3. **No server changes needed**. Everything runs in the browser.

### Styling

The app uses CSS custom properties for easy theming. Key variables:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --border-color: #e1e8ed;
  --background-color: #f8f9fa;
}
```

## 🚀 Deployment

### Deploy to GitHub Pages (Static)

This project can run fully static thanks to client-side timezone conversion using the `Intl` API. A prebuilt static copy lives in the `docs/` directory for GitHub Pages.

Steps:

1. Commit and push the `docs/` directory
   ```bash
   git add docs/
   git commit -m "chore: add docs/ for GitHub Pages"
   git push origin main
   ```
2. In GitHub, go to `Settings` → `Pages`
3. Under "Build and deployment":
   - Source: `Deploy from a branch`
   - Branch: `main` and folder: `/docs`
4. Save. Your site will be available at:
   - User/Org site: `https://<your-username>.github.io/<repo-name>/`
   - Project Pages custom domain if configured.

Notes:

- The static app references assets with relative paths (`styles.css`, `script.js`), so it works under any subpath.
- A `.nojekyll` file is included in `docs/` to prevent Jekyll processing.

### Server/Hosting

No backend is required. Publish the `docs/` folder via GitHub Pages as described above. For local preview, serve `docs/` with any static server.

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Bug Reports
- Use the [Issues](https://github.com/paul0li/timezone-project/issues) tab
- Include steps to reproduce
- Mention your browser and OS

### Feature Requests
- Check existing issues first
- Describe the feature and use case
- Consider implementation complexity

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request with clear description

### Development Guidelines
- **Code Style**: Use consistent indentation and naming
- **Comments**: Document complex logic
- **Testing**: Test on multiple browsers and devices
- **Responsive**: Ensure mobile compatibility

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

