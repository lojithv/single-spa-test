# BuilderBid Microfrontend Architecture

A single-spa microfrontend architecture for the BuilderBid platform, enabling independent development and deployment of multiple frontend applications.

## Overview

This monorepo contains multiple microfrontend applications orchestrated by single-spa. The architecture follows the "Shell App" pattern where a dedicated auth application provides the global UI shell (navigation, appbar, sidebar) while business-focused applications mount into the content area.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Root Config (Port 9000)                  │
│              Orchestration, Routing, Layout                 │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Auth Shell (Port 5173)                    │ │
│  │         Appbar, Sidebar, Authentication                │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                   Content Area                         │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │ Angular  │ │   CRM    │ │Insurance │ │  MGMT    │  │ │
│  │  │  :4200   │ │  :5174   │ │  :5175   │ │  :5176   │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │ │
│  │  ┌──────────┐                                         │ │
│  │  │ Projects │                                         │ │
│  │  │  :5177   │                                         │ │
│  │  └──────────┘                                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Applications

| Application | Port | Technology | Description |
|-------------|------|------------|-------------|
| **root** | 9000 | Webpack + single-spa-layout | Orchestrator - manages routing and application layout |
| **auth** | 5173 | React + Vite | Shell application - provides Appbar, Sidebar, and authentication |
| **angular** | 4200 | Angular 19 | Templates and project details (estimates, specifications, bids) |
| **crm** | 5174 | React + Vite | Customer relationship management |
| **insurance-tracking** | 5175 | React + Vite | Insurance tracking and management |
| **mgmt** | 5176 | React + Vite | Management dashboard |
| **react** (Projects) | 5177 | React + Vite | Projects and scheduling |

## Routes

| Route | Application | Component |
|-------|-------------|-----------|
| `/` | react | My Projects |
| `/login` | auth | Login |
| `/signup` | auth | Signup |
| `/app/templates` | angular | Templates |
| `/app/templates/:templateId` | angular | Template Details |
| `/app/project/:projectId` | angular | Project Home |
| `/app/project/:projectId/schedule` | react | Project Schedule |
| `/app/crm` | crm | CRM Dashboard |
| `/app/crm/companies` | crm | Companies |
| `/app/insurance` | insurance-tracking | Insurance |
| `/app/management` | mgmt | Management |

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- Yarn or npm
- Angular CLI (for the Angular application)

### Installation

Install dependencies for each application:

```bash
# Root orchestrator
cd root && yarn install

# Auth shell
cd auth && yarn install

# Angular app
cd angular && npm install

# React apps
cd crm && yarn install
cd insurance-tracking && yarn install
cd mgmt && yarn install
cd react && yarn install
```

### Running the Applications

**Minimum required for development:**
1. Root Config (always required)
2. Auth Shell (provides navigation)
3. The specific app you're working on

```bash
# Terminal 1: Start the root orchestrator
cd root
yarn start

# Terminal 2: Start the auth shell
cd auth
yarn dev

# Terminal 3: Start your application (example: CRM)
cd crm
yarn dev
```

**Full development environment:**

```bash
# Start all applications in separate terminals
cd root && yarn start           # Port 9000
cd auth && yarn dev             # Port 5173
cd angular && npm run serve:single-spa:builderbid-angular  # Port 4200
cd crm && yarn dev              # Port 5174
cd insurance-tracking && yarn dev  # Port 5175
cd mgmt && yarn dev             # Port 5176
cd react && yarn dev            # Port 5177
```

Then open http://localhost:9000 in your browser.

## Development Workflow

### Import Map Overrides

This project uses `import-map-overrides` to enable flexible development. You can:

1. Run only the applications you need locally
2. Point to deployed/staging versions of other applications
3. Test integration without running the entire stack

To access the override UI, add `devtools` to your localStorage:
```javascript
localStorage.setItem('devtools', true)
```

Then refresh the page to see the import map overrides panel.

### Adding a New Microfrontend

1. Create a new Vite + React application:
   ```bash
   npm create vite@latest my-app -- --template react-ts
   cd my-app
   yarn add single-spa-react
   yarn add -D vite-plugin-single-spa
   ```

2. Configure `vite.config.ts` for single-spa:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import singleSpa from 'vite-plugin-single-spa'

   export default defineConfig({
     plugins: [
       react(),
       singleSpa({
         type: 'mife',
         serverPort: YOUR_PORT,
       })
     ],
     server: {
       port: YOUR_PORT,
       cors: true
     }
   })
   ```

3. Update `root/src/index.ejs` to add the new application to the import map

4. Update `root/src/microfrontend-layout.html` to define where the app should mount

## Project Structure

```
single-spa-test/
├── root/                    # Root orchestrator
│   ├── src/
│   │   ├── builderbid-root-config.ts  # Main entry point
│   │   ├── index.ejs                   # HTML template with import maps
│   │   └── microfrontend-layout.html   # Layout configuration
│   └── package.json
├── auth/                    # Auth/Shell microfrontend (React)
├── angular/                 # Angular microfrontend
├── crm/                     # CRM microfrontend (React)
├── insurance-tracking/      # Insurance microfrontend (React)
├── mgmt/                    # Management microfrontend (React)
├── react/                   # Projects microfrontend (React)
├── routes.json              # Route definitions
├── PROPOSAL.md              # Architecture proposal documentation
└── README.md                # This file
```

## Key Technologies

- **[single-spa](https://single-spa.js.org/)** - Microfrontend orchestration framework
- **[single-spa-layout](https://single-spa.js.org/docs/layout-overview)** - Declarative routing and layout
- **[Vite](https://vitejs.dev/)** - Fast build tool for React applications
- **[Angular](https://angular.io/)** - Framework for the templates/project management app
- **[SystemJS](https://github.com/systemjs/systemjs)** - Module loader for Angular app compatibility
- **[import-map-overrides](https://github.com/single-spa/import-map-overrides)** - Development tool for flexible import maps

## Scripts Reference

### Root

| Script | Description |
|--------|-------------|
| `yarn start` | Start development server on port 9000 |
| `yarn build` | Production build |
| `yarn lint` | Run ESLint |
| `yarn format` | Format code with Prettier |

### React Apps (auth, crm, insurance-tracking, mgmt, react)

| Script | Description |
|--------|-------------|
| `yarn dev` | Start Vite development server |
| `yarn build` | Production build |
| `yarn lint` | Run ESLint |
| `yarn preview` | Preview production build |

### Angular

| Script | Description |
|--------|-------------|
| `npm run serve:single-spa:builderbid-angular` | Start single-spa development server |
| `npm run build:single-spa:builderbid-angular` | Production build for single-spa |
| `npm run start:standalone` | Run as standalone application |

## Architecture Decisions

### Why a Dedicated Auth/Shell App?

- **Separation of Concerns**: Teams working on business features don't need to maintain navigation or auth logic
- **Scalability**: New teams can join by running root, auth, and their own app
- **Centralized Security**: Auth logic is in one auditable location
- **Independent Deployment**: Shell can be updated without touching business apps

### Module Loading Strategy

- **React/Vite apps**: Native ESM imports via import maps
- **Angular app**: SystemJS for compatibility with Angular's build output

## Contributing

1. Create a feature branch from `main`
2. Make your changes in the appropriate microfrontend
3. Test locally with at least root + auth + your app running
4. Submit a pull request

## Troubleshooting

### CORS Issues
Ensure all development servers have CORS enabled. The Vite config should include:
```typescript
server: {
  cors: true
}
```

### Application Not Loading
1. Check the browser console for import errors
2. Verify the application is running on the correct port
3. Check the import map in `root/src/index.ejs`
4. Use import-map-overrides to debug module resolution

### HMR Not Working
React Refresh preamble must be loaded before your application. This is configured in `root/src/index.ejs` for development mode.

## License

Proprietary - BuilderBid
