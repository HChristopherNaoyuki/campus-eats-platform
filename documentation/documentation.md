# Campus Eats - Technical Documentation

Version 1.0 - Last reviewed: 17 August 2026

## Table of Contents

1. [Introduction](#1-introduction)
2. [Product Overview](#2-product-overview)
3. [Technology Stack](#3-technology-stack)
4. [System Architecture](#4-system-architecture)
5. [Project Structure](#5-project-structure)
6. [Getting Started](#6-getting-started)
7. [Environment Configuration](#7-environment-configuration)
8. [Functional Modules](#8-functional-modules)
   - [8.1 User Management](#81-user-management)
   - [8.2 Vendor Management](#82-vendor-management)
   - [8.3 Menu Management](#83-menu-management)
   - [8.4 Order Management](#84-order-management)
   - [8.5 Reporting](#85-reporting)
   - [8.6 Feedback and Security Log](#86-feedback-and-security-log)
9. [Business Rules](#9-business-rules)
10. [Roles and Permissions](#10-roles-and-permissions)
11. [Demonstration Accounts](#11-demonstration-accounts)
12. [External Restaurant API Integration](#12-external-restaurant-api-integration)
13. [Routing Reference](#13-routing-reference)
14. [State Management](#14-state-management)
15. [Design System](#15-design-system)
16. [Testing and Quality Assurance](#16-testing-and-quality-assurance)
17. [Build and Deployment](#17-build-and-deployment)
18. [Security Considerations](#18-security-considerations)
19. [Troubleshooting](#19-troubleshooting)
20. [Glossary](#20-glossary)

---

## 1. Introduction

This document describes the design, structure, and operation of Campus Eats, a
campus food ordering and pickup platform. It is written for developers,
reviewers, and maintainers who need to understand how the application works and
how to run, extend, or evaluate it.

The document covers the application only. Legal limitations are described in
[disclaimer.md](./disclaimer.md), and the process for submitting changes is
described in [contributing.md](./contributing.md).

[Back to top](#table-of-contents)

## 2. Product Overview

Campus Eats allows students to browse campus vendors, order food, and collect it
at a pickup point. Vendors manage their own shop, inventory, and incoming
orders. Administrators oversee users, vendors, revenue, feedback, and security
events.

Primary objectives:

- Reduce queuing time at campus food outlets.
- Give each vendor an independent shop with its own inventory.
- Give administrators a single view of platform activity and revenue.
- Provide auditable records of authentication and order events.

[Back to top](#table-of-contents)

## 3. Technology Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript 5 |
| User interface | React 18 |
| Build tooling | Vite 5 |
| Styling | Tailwind CSS 3 with shadcn/ui components |
| State management | Zustand with selective persistence |
| Charts | Recharts |
| Routing | React Router |
| Notifications | Sonner toasts |
| Testing | Vitest |
| Backend services | Lovable Cloud edge function used as an API proxy |

[Back to top](#table-of-contents)

## 4. System Architecture

The application is a single page application. All screens are rendered in the
browser. Live restaurant and menu data, authentication codes, and order creation
are handled by an external Fake Restaurant API. Because that API does not return
cross origin resource sharing headers, all calls are routed through a server
side proxy function.

```text
Browser (React SPA)
   |
   |  fetch /functions/v1/restaurant-api/api/...
   v
Edge function proxy (adds CORS headers, forwards verbatim)
   |
   |  https://fakerestaurantapi.runasp.net/api/...
   v
Fake Restaurant API (restaurants, items, users, orders)
```

Local application state such as the shopping cart, feedback entries, and the
security log is held in the browser store. Sensitive values such as user records
and the active session identifier are deliberately not written to browser
storage.

[Back to top](#table-of-contents)

## 5. Project Structure

```text
src/
  assets/                 Static images used by the marketing pages
  components/
    marketing/            Hero, footer, legal, and donation components
    ui/                   shadcn/ui primitives
    AppSidebar.tsx        Role aware application navigation
  layouts/
    AppLayout.tsx         Authenticated shell with sidebar and route guards
    MarketingLayout.tsx   Public shell with header and footer
  lib/
    restaurantApi.ts      Typed client for the external restaurant API
  pages/
    auth/                 Login, Signup, ForgotPassword
    marketing/            About, Services, Contact, FAQ, Blog, Donate, Privacy, Terms
    Dashboard.tsx         Administrator dashboard
    StudentDashboard.tsx  Ordering experience for students
    VendorDashboard.tsx   Vendor order and inventory management
    UsersPage.tsx         User administration
    VendorsPage.tsx       Vendor administration
    MenuPage.tsx          Menu administration
    OrdersPage.tsx        Order administration
    ReportsPage.tsx       The five reports
    FeedbackPage.tsx      Compliments and complaints
    SecurityLogPage.tsx   Audit trail
  store/
    campusStore.ts        Application state, business rules, and API calls
  types/
    campus.ts             Shared domain types
supabase/
  functions/restaurant-api/index.ts   CORS proxy for the external API
documentation/            Project documentation
screenshots/              All visual media referenced by the documentation
```

[Back to top](#table-of-contents)

## 6. Getting Started

Prerequisites: Node.js 18 or later and npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The development server prints a local address, normally `http://localhost:8080`.

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Produce an optimised production build |
| `npm run build:dev` | Produce a development mode build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run the Vitest suite in watch mode |

[Back to top](#table-of-contents)

## 7. Environment Configuration

The project reads its backend configuration from environment variables that are
generated automatically by the hosting platform. They are public, client side
values only.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Base URL used to reach the API proxy function |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publishable key sent with proxy requests |
| `VITE_SUPABASE_PROJECT_ID` | Backend project identifier |

Do not add private keys, service credentials, or database passwords to the
front end code or to the repository.

[Back to top](#table-of-contents)

## 8. Functional Modules

The modules follow the hierarchical input structure defined in the original
process document.

### 8.1 User Management

- Register a user with name, email, password, and role.
- Sign in using either the email address or the sixteen character User ID.
- Reset a password through the password recovery screen.
- Administrators can review every registered account.

### 8.2 Vendor Management

- Register a vendor with shop name, campus location, and contact number.
- Update vendor details.
- Each vendor has a unique shop name and an isolated inventory.
- Vendor records can be synchronised from the external restaurant API.

### 8.3 Menu Management

- Add a menu item with name, price, and owning vendor.
- Update an existing item.
- Remove an item.
- Track stock levels and toggle item availability.

### 8.4 Order Management

- Students add items to a cart and confirm the order.
- Orders are grouped by vendor and submitted to the external API.
- Vendors move orders through the status workflow.
- Administrators can review every order in the system.

### 8.5 Reporting

Five reports are provided on the Reports page.

| Report | Content |
| --- | --- |
| Sales Report | Revenue and order counts filtered by date range |
| Order Summary Report | Order counts grouped by status |
| Vendor Performance Report | Items sold and revenue per vendor, with a chart |
| Detailed Order Report | Line level detail for a single order identifier |
| User Activity Report | Ordering frequency and spend per user |

Each report can be printed or exported to PDF through the browser print dialog.

### 8.6 Feedback and Security Log

- Students and standard users submit compliments or complaints.
- Every authentication and order action is written to the security log.
- Administrators review the security log as an audit trail.

[Back to top](#table-of-contents)

## 9. Business Rules

- All prices are quoted in South African Rand and displayed with the prefix `R`.
- Order pricing is calculated as follows:
  1. Sum the line totals to obtain the subtotal.
  2. Add tax at twenty percent.
  3. Round the result up to the next multiple of five Rand.
  4. Apply a discount of two and a half percent for the Student role only.
- User identifiers are sixteen character uppercase alphanumeric strings and are
  presented once at sign up as a recovery key.
- Order identifiers follow the pattern `ORD-YYYYMMDD-XXXXXXXX`, where the suffix
  is an eight character alphanumeric string.
- The order status workflow is: Pending, then Accepted or Rejected, then
  Preparing, then Ready, then Completed.
- Every authentication and order action must be recorded in the security log.

[Back to top](#table-of-contents)

## 10. Roles and Permissions

| Capability | Student | Standard | Vendor | Admin |
| --- | --- | --- | --- | --- |
| Browse menus and place orders | Yes | Yes | No | No |
| Receive the student discount | Yes | No | No | No |
| Manage own inventory | No | No | Yes | No |
| Update order status | No | No | Yes | Yes |
| View all users and vendors | No | No | No | Yes |
| View total platform revenue | No | No | No | Yes |
| View the security log | No | No | No | Yes |
| Submit feedback | Yes | Yes | Yes | Yes |

[Back to top](#table-of-contents)

## 11. Demonstration Accounts

The application ships with ten demonstration accounts: two administrators, three
vendors, four standard users, and one student. The full list of email addresses
and passwords is displayed on the sign in screen so that reviewers can sign in
without additional setup. Sign in accepts the email address, the username, or the
sixteen character User ID. Each account is registered automatically against the
external API the first time it is used, and if that service is unavailable the
account still signs in locally.

The seeded data set defined in `src/data/seed.ts` provides at least ten records
per collection: ten users, ten vendors, sixteen menu items, twelve orders, ten
feedback entries, and twelve security log entries. Seeded identifiers are
namespaced with `seed-` so that a catalogue synchronisation never removes them.

Demonstration accounts are for evaluation only and must not be used in a
production deployment.


[Back to top](#table-of-contents)

## 12. External Restaurant API Integration

Base URL of the upstream service: `https://fakerestaurantapi.runasp.net`.

| Purpose | Endpoint |
| --- | --- |
| Register a user | `POST /api/User/register` |
| Retrieve a user code | `GET /api/User/getusercode` |
| List restaurants | `GET /api/Restaurant` |
| List menu items | `GET /api/Restaurant/items` |
| Create an order | `POST /api/Order/{restaurantId}/makeorder?apikey={usercode}` |
| Retrieve order history | `GET /api/Order?apikey={usercode}` |

Authentication uses a `usercode` value in the form of a universally unique
identifier, supplied as the `apikey` query parameter. All browser requests are
sent to the proxy function, which forwards the path and query string unchanged
and adds the required cross origin headers to the response.

[Back to top](#table-of-contents)

## 13. Routing Reference

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home page |
| `/about` | Public | Project background |
| `/services` | Public | Platform modules |
| `/contact` | Public | Support form |
| `/faq` | Public | Frequently asked questions |
| `/blog` | Public | News and release notes |
| `/donate` | Public | Cryptocurrency donations |
| `/privacy` | Public | Privacy policy |
| `/terms` | Public | Terms and conditions |
| `/login` | Public | Sign in |
| `/signup` | Public | Registration |
| `/forgot-password` | Public | Password recovery |
| `/dashboard` | Admin | Administrator overview and revenue |
| `/student` | Student, Standard | Browse, cart, and order history |
| `/vendor` | Vendor | Incoming orders and inventory |
| `/users` | Admin | User administration |
| `/vendors` | Admin | Vendor administration |
| `/menu` | Admin | Menu administration |
| `/orders` | Admin | Order administration |
| `/reports` | Admin | The five reports |
| `/feedback` | Authenticated | Compliments and complaints |
| `/security-log` | Admin | Audit trail |

[Back to top](#table-of-contents)

## 14. State Management

Application state is held in a Zustand store defined in
`src/store/campusStore.ts`. The store exposes the domain collections, the
pricing helper, and the asynchronous actions that call the external API.

Persistence is selective. The store uses a `partialize` function so that user
records, credentials, and the active session identifier are never written to
browser storage. The store version number is increased whenever the persisted
shape changes, which invalidates outdated data in existing browsers.

[Back to top](#table-of-contents)

## 15. Design System

Colours, gradients, and shadows are defined as semantic tokens in
`src/index.css` and consumed through Tailwind and shadcn/ui component variants.
The visual identity is a warm orange primary colour on a light neutral surface,
matching the mobile application mockups.

Components must use the semantic tokens rather than fixed colour utilities so
that theming remains consistent across the application.

Source code follows Allman brace style, with opening and closing braces placed
on their own lines.

[Back to top](#table-of-contents)

## 16. Testing and Quality Assurance

- Unit and component tests run under Vitest with `npm run test`.
- Static analysis runs with `npm run lint`.
- End to end checks of the sign in flow and the ordering flow were carried out
  with an automated browser script covering all eight demonstration accounts.

Before submitting a change, run the linter, the test suite, and a production
build.

[Back to top](#table-of-contents)

## 17. Build and Deployment

Run `npm run build` to produce a static bundle in the `dist` directory. The
bundle can be served by any static host. The API proxy function is deployed
alongside the application by the hosting platform and must be available for
live catalogue data, authentication, and order creation to work.

[Back to top](#table-of-contents)

## 18. Security Considerations

- Credentials and user records are held in memory only and are never persisted
  to browser storage.
- Role assignment is validated on registration, and unauthorised administrator
  claims are downgraded.
- Route guards redirect users to the dashboard that matches their role.
- Every authentication and order action is written to the security log.
- Private keys and service credentials must never be committed to the
  repository or referenced from front end code.

This project is an academic demonstration. It does not implement production
grade password hashing or server enforced authorisation, and it should not be
used to process real payments or real personal data.

[Back to top](#table-of-contents)

## 19. Troubleshooting

| Symptom | Likely cause | Resolution |
| --- | --- | --- |
| Menus are empty | The catalogue request failed | Confirm the proxy function is reachable and reload the page |
| Sign in fails for a demonstration account | The upstream API was unavailable during registration | Retry the sign in; the account is provisioned on demand |
| Cross origin errors in the console | Requests are bypassing the proxy | Confirm the environment variables are present |
| Stale data after an upgrade | Outdated persisted state | Clear site data in the browser and reload |
| Order is not created | The upstream order endpoint rejected the request | Check the browser network tab for the response status |

[Back to top](#table-of-contents)

## 20. Glossary

| Term | Definition |
| --- | --- |
| Usercode | Universally unique identifier used as the API key for the external service |
| User ID | Sixteen character uppercase identifier issued at sign up and usable for sign in |
| Master order | Order record created by the external restaurant API |
| Vendor | Campus food outlet with its own shop name and inventory |
| Standard user | Authenticated user without a student discount |
| Security log | Append only record of authentication and order events |

[Back to top](#table-of-contents)
