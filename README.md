# User Management Dashboard

A user management dashboard built with Next.js 16, TypeScript, Tailwind CSS, TanStack Query, and Zustand — consuming the [Reqres.in](https://reqres.in/) mock API.

**Live Demo:** https://user-management-dashboard-kohl-nine.vercel.app/
**Demo Credentials:** `eve.holt@reqres.in` / `cityslicka`

---

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Running Locally

```bash
git clone https://github.com/falaksherdev/user-management-dashboard.git
cd user-management-dashboard
npm install
npm run dev
```

Open `http://localhost:3000`. The root page checks your auth state and redirects you to either `/login` or `/dashboard` automatically.

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_KEY="free_user_3ErDrcLczleYcwwcmVAkZe5KWiK"
```

This key is used to authenticate requests to the Reqres.in API. A free-tier key is provided above — you can replace it with your own from [reqres.in](https://reqres.in/) if needed.

---

## Tech Stack Explanation

**Next.js 16 (App Router)**
I chose the App Router over Pages Router because it enables React Server Components by default, which reduces client-side JavaScript. It also co-locates layouts, loading states, and pages by route — making the folder structure self-documenting.

**TypeScript**
All API responses, component props, and Zustand store slices are fully typed. This caught several bugs during development — for example, the Reqres `/users` response wraps data in a `data` key that's easy to miss without types.

**Tailwind CSS**
Utility-first approach keeps styles co-located with markup and eliminates naming overhead. All responsive breakpoints (`sm`, `md`, `lg`) are handled inline without separate CSS files.

**TanStack Query (React Query)**
Handles all server state — fetching, caching, background refetching, and pagination. The `useUsers` hook encapsulates query logic and keeps components clean. It also handles loading and error states out of the box, which made adding skeletons straightforward.

**Zustand**
Used exclusively for client-side auth state (token storage). Zustand's `persist` middleware syncs the token to `localStorage` and cookies simultaneously — `localStorage` for the Zustand store to rehydrate on refresh, cookies so the Next.js middleware can read the token server-side before any page renders.

**Axios**
Configured with a base URL and a request interceptor that attaches the Bearer token on every call. A response interceptor handles 401 errors by clearing auth state — though the actual redirect is left to the component layer (see Challenges).

**React Hook Form**
Chosen for its uncontrolled input model, which avoids re-rendering the form on every keystroke. Validation rules are defined inline via the `register` function — for example, the email field uses a `required` rule and a regex `pattern` to validate format, with custom error messages for each case.

**React Hot Toast**
Lightweight toast library wired to every mutation (add, edit). Gives instant feedback without blocking the UI.

---

## Architectural Decisions

**Splitting server state and client state**
A common mistake is putting everything in one store. Here, TanStack Query owns all API data (users list, pagination) because it was built for exactly that — cache invalidation, deduplication, background sync. Zustand only owns the auth token, which never needs to be refetched from a server. This split keeps both tools doing what they're good at.

**Middleware-based route protection**
Next.js middleware runs on the Edge before any page renders, which means unauthenticated users never see a flash of the protected page. The middleware reads the `auth_token` cookie (not `localStorage`, which isn't accessible server-side) and redirects to `/login` if it's missing. This is why the Zustand store writes to both `localStorage` and cookies on login.

**Feature-based folder structure**
Components are organized by feature (`components/users/`, `components/dashboard/`) rather than by type (`components/modals/`, `components/tables/`). When working on the Users page, all relevant components are in one place instead of scattered across type-based folders.

**Modal state kept local**
Add/Edit/View modals are controlled from the `UserTable` component using `useState`. I considered lifting this to Zustand but decided against it — modal open/close state is purely UI-level and doesn't need to persist or be shared across routes. Keeping it local reduces unnecessary global state.

**Root page as a redirect hub**
`app/page.tsx` doesn't render any UI. It reads the auth store and immediately calls `router.replace()` to either `/dashboard` or `/login`. This means the root URL always resolves correctly regardless of auth state, without duplicating redirect logic in middleware.

---

## Assumptions

**API Behavior**

- Reqres.in is a mock API. POST and PUT calls return success responses with fake IDs, but nothing is actually persisted — refreshing the page reverts all changes.
- Only the demo credentials (`eve.holt@reqres.in` / `cityslicka`) work for login. Other combinations return a 400.
- The token returned by Reqres is not a real JWT. It's a static string (`QpwL5tpe83ilfN2NNqyejA`). It is stored and sent as-is since Reqres accepts any Bearer token for protected endpoints.
- Reqres avatar URLs (e.g. `https://reqres.in/img/faces/1-image.jpg`) return an HTML page instead of an actual image. UI Avatars is used as a fallback to generate initials-based avatars.

**Business Logic**

- The dashboard shows Active (70%), Inactive (30%), and New (20%) user counts. These are calculated as fixed percentages of the total user count since Reqres has no status field on users. This is mock logic to demonstrate the dashboard UI.

**Pagination**

- Reqres returns 6 users per page. The total page count is derived from the `total_pages` field in the API response. No client-side pagination logic exists — every page change triggers a new API call, with TanStack Query caching the result.

---

## Challenges Faced

**Challenge 1: Avatar images never loading**
Reqres advertises avatar URLs like `https://reqres.in/img/faces/1-image.jpg`, but hitting those URLs returns an HTML error page, not a JPEG. No amount of CORS headers or `next.config.ts` `remotePatterns` configuration fixes this because the server itself isn't serving images. The solution was to drop the Reqres URLs entirely and generate avatars on the fly using the UI Avatars API (`https://ui-avatars.com/api/?name=First+Last`), which is reliable and doesn't require any auth.

**Challenge 2: Response interceptor causing full page reload on 401**
The Axios response interceptor was originally calling `window.location.href = '/login'` on 401 errors. This caused a full browser reload, wiping React state and TanStack Query's cache. The fix was to remove navigation from the interceptor entirely. The interceptor now only clears the Zustand auth store. Individual components that receive a 401 use Next.js's `useRouter` to navigate — this keeps it a client-side route transition and preserves the app shell.

**Challenge 3: Middleware not seeing the auth token**
The initial implementation stored the token only in Zustand (backed by `localStorage`). The middleware runs on the server edge where `localStorage` doesn't exist, so every request appeared unauthenticated and users were constantly redirected to login even after logging in. The fix was to write the token to a cookie on login (in addition to Zustand) using `document.cookie`. The middleware reads this cookie, which is automatically included in every request header.

**Challenge 4: Form validation errors showing on untouched fields**
React Hook Form's default `onChange` mode triggered validation on every keystroke, showing "email is required" the moment the user clicked into the field. This was resolved by defining validation only at the field level via `register` — errors are tied to specific rules (`required`, `pattern`) and only appear after the user has interacted with and submitted the form.

**Challenge 5: Root path showing default Next.js page**
Without an explicit `app/page.tsx`, Next.js was rendering its default welcome page at `/`. The fix was to create a root page component that checks auth state in a `useEffect` and calls `router.replace()` accordingly. The page renders nothing (`return null`) — its only job is the redirect.

---
