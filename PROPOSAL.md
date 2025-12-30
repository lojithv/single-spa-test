# Proposal: Dedicated Shell & Auth Microfrontend

## Current State
Currently, the `builderbid-react` application serves two purposes:
1. It acts as the UI Shell (providing the Appbar and Sidebar).
2. It hosts the "Projects" business logic.

The `root` configuration manages the orchestrations and layout slots.

## Proposed Change
Move all "Shell" responsibilities (Navigation, Appbar, Authentication) into a new, dedicated microfrontend called **`builderbid-auth`**.

### Architecture Overview
1.  **`root` (Orchestrator)**: Stays thin. Defines the layout slots and handles routing.
2.  **`auth` (Shell/Service)**: 
    *   Provides the global layout (Appbar + Sidebar).
    *   Handles authentication state (login/logout).
    *   Provides shared UI components if necessary.
3.  **Business Apps (`inventory`, `crm`, `insurance`, `mgmt`, `projects`)**: Purely focus on their respective domains. They mount into the content slot provided by the `root` layout.

### Why this is a good approach?
*   **Separation of Concerns**: The team working on "Projects" shouldn't be responsible for the global navigation or login logic.
*   **Scalability**: New teams can join the ecosystem by simply running `root`, `auth`, and their own app. They don't need to touch the `projects` code.
*   **Centralized Security**: Auth logic is in one place, making it easier to audit and update.

### Development Workflow
Each team will:
1.  Run the **Root Config** (port 9000).
2.  Run the **Auth/Shell App** (port 5173).
3.  Run **their specific app** (e.g., CRM on 5174).

**Developer Productivity Note:**
We will utilize the `import-map-overrides` tool (already in the root). This allows a developer to run *only* their own project locally and point to a "deployed" or "staging" version of the `root` and `auth` apps if they don't want to run everything on their machine.

---

## Implementation Plan

### Step 1: Create `auth` Microfrontend
*   Initialize a new React/Vite app in the `auth/` directory.
*   Configure it as a single-spa microfrontend.
*   Port: **5173** (Let's move the shell here).

### Step 2: Move Shell Logic
*   Move `Appbar` and `Sidebar` components from `react/src/App.tsx` to `auth/src/App.tsx`.
*   Implement `AuthContext` in `auth` to manage user sessions.
*   Update `auth` to be "always active" in the root layout.

### Step 3: Refactor `react` App (Now `projects`)
*   Remove the shell logic.
*   Rename internal references to "Projects".
*   Port: **5177** (New port for the Projects app).

### Step 4: Update Root Configuration
*   **`index.ejs`**: Add `builderbid-auth` to import maps. Update `builderbid-react` port to 5177.
*   **`microfrontend-layout.html`**:
    ```html
    <application name="builderbid-auth"></application>
    <main>
      <route path="app/inventory"><application name="builderbid-angular"></application></route>
      <route path="app/projects"><application name="builderbid-react"></application></route>
      ...
    </main>
    ```

### Step 5: Inter-App Communication (Optional but Recommended)
*   Use a shared library or browser events for `auth` to notify other apps when a user logs in/out.

---

## Alternative: "Utility" Microfrontend
Instead of a full "App", we could use a **Utility Module** for Auth. However, for a shared Sidebar/Appbar, a **Single-SPA Application** (the "Shell App" pattern) is much more powerful as it can manage its own React lifecycle and state easily.

**Recommendation**: Proceed with the **Dedicated Auth/Shell App** approach.

