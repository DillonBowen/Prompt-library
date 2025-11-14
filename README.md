# Prompt Library - Static Web App

A simple, elegant static web application for storing and organizing your AI prompts.

## Features

- 📝 **Store Prompts** - Save all your prompts in one place
- 🔍 **Search** - Quickly find prompts by title, content, or tags
- 🏷️ **Categories** - Organize prompts by category (Fiverr, Portraits, AI Generation, Other)
- 📋 **Copy to Clipboard** - One-click copy for easy use
- ✏️ **Edit & Delete** - Manage your prompts easily
- 💾 **Local Storage** - All data stored locally in your browser
- 🎨 **Dark Theme** - Easy on the eyes

## Usage

### Getting Started

1. Open `index.html` in your web browser
2. The app will load with example prompts (if this is your first time)
3. Click "+ New Prompt" to create your first prompt

### Creating a Prompt

1. Click the **"+ New Prompt"** button
2. Fill in the form:
   - **Title**: Name your prompt
   - **Category**: Choose from Fiverr, Portraits, AI Generation, or Other
   - **Prompt Content**: Paste or type your prompt
   - **Tags**: Add comma-separated tags for better searchability
3. Click **"Save Prompt"**

### Viewing Prompts

- Click any prompt in the sidebar to view it
- Use the search bar to filter prompts
- Click category names to filter by category

### Managing Prompts

- **Edit**: Click the ✏️ icon in the prompt view
- **Copy**: Click the 📋 icon to copy prompt content to clipboard
- **Delete**: Click the 🗑️ icon to remove a prompt

## Data Storage

All prompts are stored in your browser's **localStorage**. This means:
- ✅ No server required
- ✅ Works offline
- ✅ Fast and private
- ⚠️ Data is browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will delete prompts

## Export/Import (Manual)

To backup your prompts:

1. Open browser Developer Tools (F12)
2. Go to Application/Storage tab
3. Find Local Storage
4. Copy the value of the `prompts` key
5. Save it as a JSON file

To restore:

1. Open Developer Tools
2. Go to Local Storage
3. Paste your JSON data into the `prompts` key

## File Structure

```
prompts-app/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── app.js          # Application logic
└── README.md       # This file
```

## Customization

### Adding Categories

Edit `index.html` and add a new category item:

```html
<li class="category-item" data-category="your-category">Your Category</li>
```

Then add it to the category select in the modal:

```html
<option value="your-category">Your Category</option>
```

### Changing Colors

Edit `styles.css` and modify the CSS variables in `:root`:

```css
:root {
    --primary-color: #6366f1;
    --bg-dark: #0f172a;
    /* ... etc */
}
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

Free to use and modify as needed.

