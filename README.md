# Notion Slides

A Chrome extension that transforms your Notion pages into presentation slides.

## Features

- Convert any Notion page into a fullscreen slide presentation
- Navigate through slides using arrow keys or click navigation
- Title slide with document heading and topic
- Slide navigation panel on the right side
- Notion-style design and icons

## Installation

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

- **Arrow Keys**: Navigate between slides
- **Escape**: Exit presentation mode
- **Click Navigation**: Use the left/right arrow buttons
- **Slide Panel**: Click on any slide in the right panel to jump to it

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
