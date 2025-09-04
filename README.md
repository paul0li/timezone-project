# 🌍 World Time Zone Converter

A modern, interactive timezone converter that works just like **timeanddate.com**. Each timezone has its own editable time input, and when you change any time, all others update automatically with the edited timezone highlighted as the reference.

![Timezone Converter Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=World+Time+Zone+Converter)

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
- **No external dependencies**: Pure Node.js backend
- **RESTful API**: Clean endpoints for timezone conversion
- **Error handling**: Graceful error handling with user feedback
- **Auto-detection**: Detects and displays user's local timezone

## 🚀 Live Demo

**[View Live Demo →](https://timezone-converter.onrender.com)**

## 📸 Screenshots

| Feature | Screenshot |
|---------|------------|
| **Desktop View** | ![Desktop](https://via.placeholder.com/400x300/667eea/ffffff?text=Desktop+View) |
| **Mobile View** | ![Mobile](https://via.placeholder.com/200x400/667eea/ffffff?text=Mobile+View) |
| **Active Timezone** | ![Active](https://via.placeholder.com/400x300/667eea/ffffff?text=Active+Timezone) |

## 🛠️ How It Works

1. **Load**: Displays current time in Chile as default reference
2. **Edit**: Click any time input to change it
3. **Convert**: All other timezones update automatically
4. **Highlight**: The edited timezone is visually highlighted
5. **Repeat**: Edit any other timezone to make it the new reference

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ installed
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/timezone-project.git
cd timezone-project

# Start the server
npm start

# Or for development
npm run dev
```

Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
timezone-project/
├── server.js              # Express server with timezone logic
├── static/                # Frontend files
│   ├── index.html         # Main HTML interface
│   ├── script.js          # Frontend JavaScript logic
│   └── styles.css         # Modern CSS styling
├── package.json           # Node.js configuration
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🔧 API Endpoints

### `GET /`
Serves the main application interface

### `GET /current`
Returns current server time and timezone information
```json
{
  "date": "2025-01-15",
  "time": "14:30",
  "timezone": "America/Santiago",
  "conversions": {
    "America/New_York": "12:30",
    "America/Argentina/Buenos_Aires": "16:30"
  }
}
```

### `GET /convert-multi`
Converts time from any source timezone to all others
- **Parameters**: `date`, `time`, `source` (timezone)
- **Returns**: Object with all timezone conversions

### `GET /convert`
Legacy endpoint for backward compatibility
- **Parameters**: `date`, `time`, `source` (optional)

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

1. **Update the timezone data** in `static/script.js`:
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

2. **Add HTML row** in `static/index.html`:
```html
<div class="timezone-row" data-timezone="Europe/London">
  <div class="timezone-info">
    <div class="timezone-name">United Kingdom</div>
    <div class="timezone-location">London</div>
  </div>
  <!-- ... rest of the row structure -->
</div>
```

3. **Update server logic** in `server.js` to include the new timezone in the `allZones` array.

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

### Deploy to Render (Recommended)

1. **Prepare your repository**:
```bash
# Make sure all files are committed
git add .
git commit -m "Ready for deployment - English version"
git push origin main
```

2. **Create Render account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub (recommended)

3. **Deploy the app**:
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Configure settings:

| Setting | Value |
|---------|-------|
| **Name** | `timezone-converter` |
| **Region** | `Ohio (US East)` |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | *Leave empty* |
| **Start Command** | `npm start` |
| **Node Version** | `18` |

4. **Deploy**:
   - Click **"Create Web Service"**
   - Wait 2-3 minutes for deployment
   - Your app will be live at: `https://your-app-name.onrender.com`

**🎉 That's it!** Render will auto-redeploy whenever you push to GitHub.

### Other Platforms

The app is also deployable on:
- **Railway**: One-click deploy
- **Vercel**: Serverless deployment
- **Heroku**: Traditional hosting
- **DigitalOcean App Platform**: Container deployment

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Bug Reports
- Use the [Issues](https://github.com/YOUR_USERNAME/timezone-project/issues) tab
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

## 🙏 Acknowledgments

- **Inspiration**: [timeanddate.com](https://timeanddate.com) for the excellent UX
- **Design**: Modern CSS Grid and Flexbox layouts
- **Timezone Data**: JavaScript Intl API for accurate DST calculations

## 📞 Support

- **Documentation**: This README
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/timezone-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/timezone-project/discussions)

---

**Made with ❤️ for the global community**

*Converting time zones shouldn't be complicated.*