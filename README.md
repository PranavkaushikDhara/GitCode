# 🚀 LeetCode GitHub Committer

> Automatically commit and organize your LeetCode solutions to GitHub with beautiful folder structure and smart duplicate handling.

[![Chrome Web Store](https://img.shields.io/badge/Chrome%20Web%20Store-Available-blue?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore/detail/your-extension-id)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen?style=flat-square)](https://github.com/PranavkaushikDhara/GitCode/releases)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

## ✨ Features

- 🗂️ **Organized Structure** - Creates dedicated folders for each problem
- 💾 **Smart Persistence** - Auto-saves your work, never lose progress
- 🔧 **GitHub Integration** - Direct API integration with secure token authentication
- 🎨 **Dark Theme** - Beautiful UI matching LeetCode's aesthetic
- 🔄 **Duplicate Handling** - Smart detection with versioning options
- 🌐 **Multi-Language** - Support for 8+ programming languages
- ⚡ **Fast & Efficient** - Lightweight with instant commits

## 🏗️ Repository Structure

Your LeetCode solutions will be organized like this:

```
your-leetcode-repo/
├── two-sum/
│   ├── problem.txt
│   └── solution.py
├── valid-parentheses/
│   ├── problem.txt
│   └── solution.js
├── longest-substring/
│   ├── problem.txt
│   └── solution.cpp
└── two-sum-v2/
    ├── problem.txt
    └── solution.java
```

## 🚀 Installation

### From Chrome Web Store (Recommended)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/your-extension-id)
2. Click "Add to Chrome"
3. Follow the setup instructions

### Manual Installation (Development)

1. Clone this repository:

   ```bash
   git clone https://github.com/PranavkaushikDhara/GitCode.git
   cd GitCode
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the project folder

## ⚙️ Setup

### 1. Get GitHub Personal Access Token

1. Go to [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)
4. Copy the generated token

### 2. Configure Extension

1. Click the extension icon in your browser
2. Paste your GitHub token and click "Save"
3. Select your target repository and branch
4. You're ready to commit solutions!

## 📋 Usage

### Basic Workflow

1. **Open LeetCode** and start solving a problem
2. **Click the extension** icon in your browser
3. **Fill in the form**:
   - Problem title (e.g., "Two Sum")
   - Select programming language
   - Paste problem statement
   - Paste your solution code
4. **Select repository and branch**
5. **Click "Commit Solution"** - Done! ✨

### Smart Features

- **Auto-save**: Form data persists when you close/reopen the extension
- **Duplicate detection**: Get options when the same problem already exists
- **Version control**: Create v2, v3, etc. for multiple approaches
- **Draft management**: Clear drafts manually or auto-clear after commits

## 🛠️ Supported Languages

| Language   | Extension | Language   | Extension |
| ---------- | --------- | ---------- | --------- |
| Python     | `.py`     | Go         | `.go`     |
| JavaScript | `.js`     | Rust       | `.rs`     |
| Java       | `.java`   | TypeScript | `.ts`     |
| C++        | `.cpp`    | C          | `.c`      |

## 🔒 Privacy & Security

- ✅ **Local storage only** - All data stays on your device
- ✅ **Secure tokens** - GitHub tokens encrypted in Chrome storage
- ✅ **No tracking** - Zero analytics or data collection
- ✅ **Open source** - Full transparency, audit the code yourself

Read our [Privacy Policy](PRIVACY.md) for complete details.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/PranavkaushikDhara/GitCode.git
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. Make your changes and test thoroughly
5. Commit with descriptive messages:
   ```bash
   git commit -m "Add amazing feature that does X"
   ```
6. Push to your fork and create a Pull Request

### Project Structure

```
GitCode/
├── manifest.json          # Extension configuration
├── popup.html             # Main UI
├── popup.css              # Styling
├── popup.js               # Core functionality
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── PRIVACY.md            # Privacy policy
└── README.md             # This file
```

### Code Style

- Use ES6+ features
- Follow existing code patterns
- Add comments for complex logic
- Test on multiple repositories

## 🐛 Issues & Support

### Reporting Bugs

Please include:

- Chrome version
- Extension version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

### Feature Requests

We love new ideas! Open an issue with:

- Clear description of the feature
- Use case and benefits
- Example workflow

### Get Help

- 📧 Email: pranavkaushikdhara2@gmail.com
- 🐛 [GitHub Issues](https://github.com/PranavkaushikDhara/GitCode/issues)

## 🗺️ Roadmap

### v1.1.0 - Smart Detection

- [ ] Auto-detect LeetCode problems from page content
- [ ] Auto-extract problem statements
- [ ] Auto-select programming language

### v1.2.0 - Enhanced Features

- [ ] Problem categories and tags
- [ ] Bulk commit multiple solutions
- [ ] Solution templates
- [ ] Code formatting options

### v2.0.0 - Advanced Integration

- [ ] Multiple platform support (HackerRank, CodeSignal)
- [ ] Statistics and progress tracking
- [ ] Team collaboration features

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LeetCode** for providing an excellent platform for coding practice
- **GitHub** for their robust API and hosting
- **Chrome Extensions API** for enabling seamless browser integration
- **Contributors** who help make this project better

---

<div align="center">

**Built with ❤️ for the coding community**

[Report Bug](https://github.com/PranavkaushikDhara/GitCode/issues) · [Request Feature](https://github.com/PranavkaushikDhara/GitCode/issues)

<!-- · [Chrome Web Store](https://chrome.google.com/webstore/detail/your-extension-id) -->

</div>
