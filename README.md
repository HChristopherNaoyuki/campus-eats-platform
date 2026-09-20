# Campus Eats

Campus Eats is a campus food ordering and pickup platform. Students browse
campus vendors, order ahead, and collect their food without queuing. Vendors run
their own shop with an isolated inventory, and administrators oversee users,
vendors, orders, revenue, feedback, and security events.

Live application: https://campus-eats-platform.lovable.app

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Available Scripts](#available-scripts)
6. [Project Structure](#project-structure)
7. [Functional Modules](#functional-modules)
8. [Reports](#reports)
9. [Business Rules](#business-rules)
10. [Roles and Demonstration Accounts](#roles-and-demonstration-accounts)
11. [External API Integration](#external-api-integration)
12. [Screenshots](#screenshots)
13. [Documentation](#documentation)
14. [Contributing](#contributing)
15. [Disclaimer](#disclaimer)
16. [License](#license)

---

## Overview

The platform implements the hierarchical input structure defined in the project
process document: user management, vendor management, menu management, and order
management. It is delivered as a responsive single page application with a
public marketing site and a role aware application area.

[Back to top](#table-of-contents)

## Key Features

- Student ordering with cart, live pricing, and order history.
- Vendor portal with full create, read, update, and delete control of its own
  inventory, plus order status management.
- Administrator dashboard with platform totals and per vendor revenue.
- Five reports with print and PDF export.
- Feedback capture for compliments and complaints.
- Security log recording every authentication and order action.
- Public marketing site covering home, about, services, contact, questions,
  news, donations, privacy, and terms.

[Back to top](#table-of-contents)

## Technology Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript 5 |
| User interface | React 18 |
| Build tooling | Vite 5 |
| Styling | Tailwind CSS 3 with shadcn/ui |
| State management | Zustand |
| Charts | Recharts |
| Testing | Vitest |
| Backend services | Hosted edge function used as an API proxy |

[Back to top](#table-of-contents)

## Getting Started

Prerequisites: Node.js 18 or later and npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

The development server prints a local address, normally `http://localhost:8080`.

[Back to top](#table-of-contents)

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Produce an optimised production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run static analysis |
| `npm run test` | Run the test suite once |

[Back to top](#table-of-contents)

## Project Structure

```text
src/
  components/    Shared components, marketing sections, and UI primitives
  layouts/       Marketing shell and authenticated application shell
  lib/           Client for the external restaurant API
  pages/         Marketing pages, authentication pages, and dashboards
  store/         Application state and business rules
  types/         Shared domain types
supabase/
  functions/     Cross origin proxy for the external restaurant API
documentation/   Technical documentation, disclaimer, and contributing guide
screenshots/     All visual media related to the application
```

[Back to top](#table-of-contents)

## Functional Modules

| Module | Capabilities |
| --- | --- |
| User management | Registration, sign in by email or User ID, password recovery |
| Vendor management | Vendor registration, detail updates, unique shop names |
| Menu management | Add, update, and remove items, stock and availability control |
| Order management | Cart checkout, vendor grouping, status workflow |

[Back to top](#table-of-contents)

## Reports

| Report | Content |
| --- | --- |
| Sales Report | Revenue and order counts filtered by date range |
| Order Summary Report | Order counts grouped by status |
| Vendor Performance Report | Items sold and revenue per vendor |
| Detailed Order Report | Line level detail for a single order |
| User Activity Report | Ordering frequency and spend per user |

[Back to top](#table-of-contents)

## Business Rules

- All prices are quoted in South African Rand and shown with the prefix `R`.
- Pricing is calculated as subtotal, plus twenty percent tax, rounded up to the
  next multiple of five Rand, with a two and a half percent discount applied for
  the Student role only.
- User identifiers are sixteen character uppercase alphanumeric strings issued
  at sign up as a recovery key.
- Order identifiers follow the pattern `ORD-YYYYMMDD-XXXXXXXX`.
- The order status workflow is Pending, then Accepted or Rejected, then
  Preparing, then Ready, then Completed.

[Back to top](#table-of-contents)

## Roles and Demonstration Accounts

The platform supports four roles: Student, Standard, Vendor, and Administrator.
Ten demonstration accounts are provided: two administrators, three vendors, four
standard users, and one student. Their credentials are listed on the sign in
screen so that reviewers can sign in immediately. An account may be identified by
its email address, its username, or its sixteen character User ID, and each is
provisioned automatically against the external API on first use.

The seeded data set contains at least ten records per collection: ten users, ten
vendors, sixteen menu items, twelve orders, ten feedback entries, and twelve
security log entries.

Demonstration accounts are intended for evaluation only.


[Back to top](#table-of-contents)

## External API Integration

Catalogue data, user codes, and order creation are provided by the Fake
Restaurant API at `https://fakerestaurantapi.runasp.net`. The service does not
return cross origin resource sharing headers, so all browser requests are routed
through a hosted proxy function that forwards the request unchanged and adds the
required response headers. Authentication uses a `usercode` value supplied as the
`apikey` query parameter.

[Back to top](#table-of-contents)

## Screenshots

All visual media for this project is stored in the `screenshots` folder. Images
are never embedded in this README. Refer to that folder for captures of the
landing page, the student ordering flow, the vendor portal, the administrator
dashboard, and the reports.

[Back to top](#table-of-contents)

## Documentation

| Document | Purpose |
| --- | --- |
| [documentation/documentation.md](documentation/documentation.md) | Full technical documentation |
| [documentation/contributing.md](documentation/contributing.md) | How to propose and submit changes |
| [documentation/disclaimer.md](documentation/disclaimer.md) | Terms, liability, and media rules |

[Back to top](#table-of-contents)

## Contributing

Contributions are welcome. Read
[documentation/contributing.md](documentation/contributing.md) before opening a
pull request. Do not correct defects silently or outside the project. Open an
issue or submit a pull request so that the change can be reviewed by the
maintainers.

[Back to top](#table-of-contents)

## Disclaimer

This project is provided as is, without warranty of any kind. The author is not
liable or responsible for any malfunction, defect, or issue arising from
copying, modifying, or using this software. The full terms are set out in
[documentation/disclaimer.md](documentation/disclaimer.md).

[Back to top](#table-of-contents)

## License

Unless a separate license file is added to this repository, all rights are
reserved by the author. Contact the maintainers before reusing the code.

[Back to top](#table-of-contents)
