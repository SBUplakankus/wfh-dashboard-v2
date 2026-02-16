# Setup

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite serves the app at `http://localhost:3000`.

## Desktop shell (Electron)

Run Electron in a second terminal while Vite is running:

```bash
npm run electron
```

- Dev mode target: `http://localhost:3000`
- Production target: `dist/index.html`

## Build

```bash
npm run build
```

## Tests

```bash
npm test
```

## Tool integration configuration

In **Settings → Tools**, configure local paths for:

- MarkText executable
- MkDocs docs folder
- Joplin executable + optional exported data JSON
- Kanri executable + optional exported data JSON
