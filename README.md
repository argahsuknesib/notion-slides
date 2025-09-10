# Notion Slides

A professional Chrome extension that transforms your Notion pages into beautiful presentation slides with advanced features.

## ✨ Features

### Core Functionality
- **🎯 One-click conversion** of any Notion page into a fullscreen slide presentation
- **🎨 Professional design** with glassmorphism effects and smooth animations
- **📱 Responsive layouts** that automatically adapt to content type

### Navigation & Controls
- **⌨️ Comprehensive keyboard shortcuts** for seamless presentation control
- **🖱️ Mouse navigation** with click-to-advance functionality
- **📋 Interactive slide panel** with slide thumbnails and quick navigation
- **🎯 Slide indicators** at the bottom for visual progress tracking

### Professional Features
- **⏱️ Built-in presentation timer** to track presentation duration
- **🎨 Multiple themes** (Default, Dark, Minimal) with live switching
- **📝 Presenter notes** overlay for speaker guidance
- **⛶ Fullscreen mode** for distraction-free presenting
- **📊 Progress bar** showing presentation completion
- **🔢 Slide counter** with current/total display

### Visual Enhancements
- **✨ Smooth slide transitions** with entrance animations
- **🎯 Content-aware layouts** (center, two-column, image-focus)
- **📸 Enhanced image styling** with automatic focus detection
- **💻 Beautiful code blocks** with syntax highlighting
- **💬 Styled blockquotes** with visual emphasis

## 🚀 Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Open your Chromium-based browser (Chrome, Arc, Edge, etc.)
5. Go to the extensions page (chrome://extensions/ or arc://extensions/)
6. Enable "Developer mode"
7. Click "Load unpacked" and select the `dist` folder

## Usage

1. Open any Notion page in your browser
2. Click the "Start Presentation" button that appears on the page, OR
3. Click the extension icon in your browser toolbar, OR
4. Use the keyboard shortcut: Option+Shift+P (on Mac) or Alt+Shift+P (on Windows/Linux)

## Navigation

### Keyboard Shortcuts

**Starting Presentation:**
- `Option+Shift+P` (Mac) / `Alt+Shift+P` (Windows/Linux) - Start presentation mode

**Slide Navigation:**
- `→` `Space` `Page Down` - Next slide
- `←` `Page Up` - Previous slide
- `Home` - Jump to first slide
- `End` - Jump to last slide
- `1-9` - Jump directly to slide number

**Presentation Controls:**
- `Escape` - Exit presentation mode
- `Tab` - Toggle slide navigation panel
- `R` - Refresh/rescan slides (if content changed)

**Professional Features:**
- `T` - Cycle through themes (Default → Dark → Minimal)
- `N` - Toggle presenter notes overlay
- `F` - Toggle fullscreen mode

### Mouse Navigation

**Click Controls:**
- **Click anywhere on slide** - Advance to next slide
- **Navigation panel items** - Jump to specific slide
- **Slide indicators** (dots at bottom) - Jump to specific slide
- **Hover top-center** - Reveal presentation controls

### Visual Indicators & Professional Features

- **⏱️ Presentation timer** in top-left corner tracks elapsed time
- **📊 Progress bar** at bottom showing presentation progress
- **🔢 Slide counter** in bottom-left corner (current/total)
- **📋 Navigation panel** on right with slide thumbnails and titles
- **🎯 Slide indicators** at bottom-center for quick navigation
- **📝 Presenter notes** overlay (press `N` to toggle)
- **🎨 Theme options** - Default, Dark, and Minimal themes
- **⛶ Fullscreen mode** for distraction-free presenting

## 🎨 Professional Features

### Smart Slide Layouts
The extension automatically detects content type and applies appropriate layouts:

- **📄 Default Layout**: Standard text and mixed content
- **🎯 Center Layout**: Short content pieces, perfect for titles or key points
- **📸 Image-Focus Layout**: Highlights images with minimal text
- **📊 Two-Column Layout**: Automatically detects multi-section content

### Theme Options
Switch between three professionally designed themes:

- **🌟 Default Theme**: Clean light theme with glassmorphism effects
- **🌙 Dark Theme**: Professional dark mode for low-light presentations
- **⚪ Minimal Theme**: Clean, distraction-free design

### Presentation Timer & Analytics
- **⏱️ Live timer** shows elapsed presentation time
- **📊 Progress tracking** with visual progress bar
- **🎯 Slide position** indicators for audience orientation

### Presenter Tools
- **📝 Presenter notes** overlay with helpful tips
- **🔍 Navigation shortcuts** for quick slide jumping
- **⛶ Fullscreen mode** with professional controls
- **🎛️ Live controls** that appear on mouse movement

## How Slides Are Created

The extension automatically converts your Notion document into slides using a simple but powerful logic:

### Slide Separation Rules

1. **Title Slide**: The first slide is always a title slide featuring the document's main heading
2. **Content Slides**: Each slide is created by grouping Notion blocks together until a separator is found
3. **Separators**: The extension treats these elements as slide breaks:
   - Horizontal dividers (the `/divider` block in Notion)
   - Three or more dashes (`---`, `----`, etc.) on their own line

### Example

Consider this Notion document structure:

```
# My Presentation Title

## Introduction
This is the introduction to my topic.
- Key point 1
- Key point 2

---

## Main Content
Here's the main content of my presentation.

> This is an important quote

---

## Conclusion
- Summary point 1
- Summary point 2
- Final thoughts
```

This would be converted into **4 slides**:

1. **Title Slide**: "My Presentation Title"
2. **Introduction Slide**: Contains the "Introduction" heading, text, and bullet points
3. **Main Content Slide**: Contains the "Main Content" heading, text, and quote block
4. **Conclusion Slide**: Contains the "Conclusion" heading and bullet points

## Browser Compatibility

This extension works with any Chromium-based browser:
- Google Chrome (Tried and tested)
- Arc Browser (Tried and tested)
- Microsoft Edge (Not tried, should work. If you try it, please let me know if it works and create an issue if it doesn't and create a PR if it does!)
- Brave Browser (Tried and tested)
- Opera (Not tried, should work. If you try it, please let me know if it works and create an issue if it doesn't and create a PR if it does!)

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Contact
Please contact [Kush Bisen](mailto:mailkushbisen@gmail.com) for any questions or feedback or create a GitHub issue on this repository.
