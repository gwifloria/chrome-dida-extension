# First Glance

> One glance at what matters most

Turn your new tab into a focus dashboard. See your high-priority tasks instantly, stay on track, and avoid distractions.

## Features

- **Focus Mode** - Clean clock + today's top tasks
- **Smart Lists** - Today, Tomorrow, This Week, Overdue
- **Full Task Management** - View, complete, edit, delete, create
- **Multiple Themes** - Journal, Rose, Ocean, Dark
- **Cross-device Sync** - Theme preferences synced

## Supported Platforms

- Dida365 (TickTick)
- Coming soon: Notion, Todoist

## Installation

### From Chrome Web Store

<!-- TODO: Add link after publishing -->

### Local Development

1. Clone the repository
```bash
git clone https://github.com/gwifloria/chrome-dida-extension.git
cd chrome-dida-extension
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env and add your Dida365 API credentials
```

4. Build
```bash
npm run build
```

5. Load extension
   - Open Chrome and visit `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked extension"
   - Select the `dist` directory

## Development

```bash
# Development mode
npm run dev

# Build
npm run build

# Type check
npm run typecheck

# Lint
npm run lint
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Ant Design
- Chrome Extension Manifest V3

## Project Structure

```
src/
├── newtab/          # New tab entry point
├── background/      # Service Worker
├── components/      # React components
├── hooks/           # React Hooks
├── services/        # API services
├── contexts/        # React Context
├── utils/           # Utility functions
├── constants/       # Constants
├── themes/          # Theme configurations
└── types/           # TypeScript types
```

## Dida365 API

This extension uses the official Dida365 Open API:
- Documentation: https://developer.dida365.com/docs
- You need to register an app in the developer portal to get Client ID and Client Secret

## Privacy

See [PRIVACY.md](./PRIVACY.md)

## License

MIT
