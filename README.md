# AllWebHub

A responsive searchable website directory built with HTML, CSS, JavaScript, Bootstrap 5, and JSON data. No backend or database is required.

## Run locally

Because the app loads JSON using `fetch()`, open it through a local web server rather than double-clicking `index.html`.

**Option 1 — VS Code Live Server**
1. Open the `AllWebHub` folder in VS Code.
2. Install the Live Server extension if needed.
3. Right-click `index.html` and choose **Open with Live Server**.

**Option 2 — Python**
1. Open a terminal in the `AllWebHub` folder.
2. Run `python -m http.server 8000`.
3. Visit `http://localhost:8000`.

## Add a website
Edit `data/websites.json` and add an object using the existing format:

```json
{
  "name": "Example Website",
  "url": "https://example.com/",
  "category": "Productivity",
  "description": "A short description of what the website does.",
  "initial": "E",
  "featured": false,
  "tags": ["example", "tools"],
  "color": "#e8ecff",
  "textColor": "#5265f5"
}
```

The `category` value must match a category name in `data/categories.json`. Use valid JSON (commas and double quotes matter). Only HTTPS links are displayed.

## Add a category
Add an object to `data/categories.json` with `name`, `icon`, `description`, `color`, and `textColor`. Then assign that exact category name to websites in `websites.json`.

## Features
- Responsive layout for desktop, tablet, and mobile
- Search across website names, descriptions, categories, and tags
- Category cards and category filters
- Featured, alphabetical, and category sorting
- Dark mode preference saved in browser local storage
- Website directory data stored in editable JSON files
- Safe external-link handling (`noopener noreferrer`)

## Deploy
You can publish this static folder using GitHub Pages, Netlify, or Cloudflare Pages. No server-side runtime is needed. Because this is a static site, visitors cannot add websites to the shared JSON file through the browser; shared user submissions/admin editing would require a backend or a separate storage service.
