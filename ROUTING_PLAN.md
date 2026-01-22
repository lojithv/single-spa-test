# Routing Policy: Avoiding Conflicts in Microfrontends

This document defines the strategy for organizing and managing routes across the `builderbid` ecosystem to ensure no overlap and seamless navigation between different frameworks (React, Angular).

## 1. Top-Level Namespacing

To prevent route conflicts, every microfrontend is assigned a unique top-level path prefix. No two apps should share a top-level route unless explicitly designed for a "Shared Domain" (see section 3).

| App | Ownership Prefix | Example Route |
| :--- | :--- | :--- |
| **Auth** | `/login`, `/signup` | `/login` |
| **Projects (React)** | `/` (exact), `/app/projects` | `/app/projects/123` |
| **Inventory (Angular)** | `/app/inventory`, `/app/templates` | `/app/templates/edit` |
| **CRM (React)** | `/app/crm` | `/app/crm/companies` |
| **Insurance** | `/app/insurance` | `/app/insurance/claims` |
| **Management** | `/app/management` | `/app/management/users` |

## 2. The "App" Prefix Convention

All internal business logic routes must start with `/app/`. This distinguishes them from static landing pages, marketing pages, or global authentication routes.

*   **Correct**: `/app/crm/leads`
*   **Incorrect**: `/crm-leads`

## 3. Shared Domain Strategy (e.g., `/app/project/:id`)

When multiple microfrontends contribute to the same entity (e.g., a "Project"), we use **Sub-path Ownership**.

### Example: The Project Domain
The **Angular** app owns the base project routes, but **React** owns the schedule sub-page.

1.  **Root Layout (`microfrontend-layout.html`)**:
    ```html
    <route path="app/project/:projectId">
      <!-- Specific sub-route owned by React -->
      <route path="schedule">
        <application name="builderbid-projects"></application>
      </route>
      <!-- Everything else in /project/:projectId goes to Angular -->
      <application name="builderbid-angular"></application>
    </route>
    ```

2.  **App Internal Routing**:
    *   **Angular** should have a wildcard or specific children that *do not* include `schedule`.
    *   **React** should listen specifically for `app/project/:projectId/schedule`.

## 4. Navigation Rules

### Rule 1: Never use `window.location.href`
Using `window.location.href` causes a full page reload, defeating the purpose of single-spa.

### Rule 2: Use `single-spa-navigate` or `pushState`
*   **React**: Use `(window as any).history.pushState(null, '', path)` or a helper function.
*   **Angular**: Use `routerLink` for internal navigation. For inter-app navigation, use `window.history.pushState`.

## 5. Conflict Resolution Checklist

Before adding a new route, verify:
1.  [ ] **Is the prefix unique?** Check `routes.json` and `microfrontend-layout.html`.
2.  [ ] **Does the Root Layout match?** Ensure the `single-spa-router` knows which app to load for the new path.
3.  [ ] **Is it added to the Auth Sidebar?** Update the `auth` app navigation so users can actually find the page.
4.  [ ] **Framework Base HREF**:
    *   Angular must have `APP_BASE_HREF` set to `/`.
    *   React/Vite must handle routing relative to the root.

## 6. Centralized Reference (`routes.json`)

The `routes.json` file in the root directory is the **Source of Truth**.
*   **Developers**: Must consult this file before implementing new routes.
*   **DevOps**: Uses this file to configure CDN/Load Balancer rules for production routing.

