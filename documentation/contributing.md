# Contributing Guide

Version 1.0 - Last reviewed: 17 August 2026

## Table of Contents

1. [Introduction](#1-introduction)
2. [Code of Conduct](#2-code-of-conduct)
3. [Ways to Contribute](#3-ways-to-contribute)
4. [Development Environment Setup](#4-development-environment-setup)
5. [Branching Strategy](#5-branching-strategy)
6. [Coding Standards](#6-coding-standards)
7. [Documentation Standards](#7-documentation-standards)
8. [Visual Media Rules](#8-visual-media-rules)
9. [Commit Message Convention](#9-commit-message-convention)
10. [Testing Requirements](#10-testing-requirements)
11. [Pull Request Process](#11-pull-request-process)
12. [Reporting Issues](#12-reporting-issues)
13. [Security Disclosures](#13-security-disclosures)
14. [Review and Release](#14-review-and-release)
15. [Contact](#15-contact)

---

## 1. Introduction

Thank you for your interest in improving Campus Eats. This guide explains how to
propose changes so that they can be reviewed quickly and merged safely. Please
read it in full before opening your first pull request, and read
[disclaimer.md](./disclaimer.md) for the terms that govern use of the project.

[Back to top](#table-of-contents)

## 2. Code of Conduct

All participants are expected to behave professionally and respectfully.
Harassment, personal attacks, and discriminatory language are not acceptable.
Discussions should focus on the technical merits of a proposal. Maintainers may
close or remove contributions that do not meet this standard.

[Back to top](#table-of-contents)

## 3. Ways to Contribute

- Report a defect with clear reproduction steps.
- Propose an improvement or a new feature.
- Improve the documentation or correct wording.
- Add or extend automated tests.
- Improve accessibility, responsiveness, or performance.

[Back to top](#table-of-contents)

## 4. Development Environment Setup

Prerequisites: Node.js 18 or later and npm.

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run static analysis |
| `npm run test` | Run the test suite once |
| `npm run build` | Verify that a production build succeeds |

[Back to top](#table-of-contents)

## 5. Branching Strategy

- `main` always holds a working, deployable version of the project.
- Create a dedicated branch for each contribution.
- Use descriptive branch names, for example `feature/vendor-stock-alerts`,
  `fix/login-redirect`, or `docs/reports-section`.
- Keep each branch focused on a single concern. Unrelated changes should be
  submitted separately.

[Back to top](#table-of-contents)

## 6. Coding Standards

- Write all application code in TypeScript and prefer explicit types on public
  functions and exported values.
- Follow Allman brace style, placing opening and closing braces on their own
  lines.
- Use functional React components and hooks. Avoid class components.
- Use the semantic design tokens defined in `src/index.css`. Do not hard code
  colour utilities such as fixed hexadecimal values, because they break theming.
- Display all monetary values in South African Rand using the prefix `R`.
- Keep components focused. Extract shared logic into hooks or helpers instead of
  duplicating it.
- Add short comments only where the intent is not obvious from the code.
- Resolve all linter warnings before requesting a review.

[Back to top](#table-of-contents)

## 7. Documentation Standards

- Write in simple, clear business English and use short sentences.
- Every document must begin with a Table of Contents in which each entry links
  to the corresponding heading.
- Use sentence case for headings and consistent heading levels.
- Update the documentation in the same pull request as the code change it
  describes.
- Do not use emojis in any document, commit message, or code comment.

[Back to top](#table-of-contents)

## 8. Visual Media Rules

- The README file must remain text only, with no embedded images and no emojis.
- Store every screenshot, diagram, and image in the `screenshots` folder.
- Use descriptive lower case file names separated by hyphens.
- Reference images by linking to the stored file from the documentation rather
  than embedding them in the README.

[Back to top](#table-of-contents)

## 9. Commit Message Convention

Use the conventional commit format:

```text
<type>(<optional scope>): <short summary>
```

Accepted types:

| Type | Use for |
| --- | --- |
| `feat` | A new feature |
| `fix` | A defect correction |
| `docs` | Documentation only changes |
| `style` | Formatting changes with no behaviour change |
| `refactor` | Restructuring with no behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build, tooling, or dependency maintenance |

Example: `fix(auth): redirect vendors to the vendor dashboard after sign in`.

Write the summary in the imperative mood and keep it under seventy two
characters.

[Back to top](#table-of-contents)

## 10. Testing Requirements

Before requesting a review, confirm that:

1. `npm run lint` reports no errors.
2. `npm run test` passes.
3. `npm run build` completes successfully.
4. The affected screens were checked manually on a mobile width and a desktop
   width.
5. Any change to authentication, pricing, or order status was verified against
   the business rules recorded in [documentation.md](./documentation.md).

New business logic should be accompanied by tests wherever practical.

[Back to top](#table-of-contents)

## 11. Pull Request Process

1. Fork the repository and create your branch from `main`.
2. Make your change, keeping the scope tight.
3. Run the checks listed in [Testing Requirements](#10-testing-requirements).
4. Update the relevant documentation.
5. Open a pull request that includes:
   - A clear title following the commit convention.
   - A description of the problem and the solution.
   - A reference to the related issue, where one exists.
   - Notes on any user visible change, with screenshots stored in the
     `screenshots` folder and linked from the description.
6. Respond to review comments and update the branch until it is approved.

Pull requests are merged by a maintainer once the checks pass and at least one
approval has been given.

[Back to top](#table-of-contents)

## 12. Reporting Issues

When opening an issue, include:

- A short, descriptive title.
- The steps required to reproduce the problem.
- The expected result and the actual result.
- The browser, operating system, and screen size used.
- Relevant console or network errors, pasted as text.

Do not attempt to correct defects silently or outside the project. Always raise
an issue or submit a pull request so that the change can be reviewed.

[Back to top](#table-of-contents)

## 13. Security Disclosures

Do not report suspected security vulnerabilities in a public issue. Contact the
maintainers privately through the repository contact details and allow a
reasonable period for a correction before any public disclosure.

Never commit private keys, service credentials, database passwords, or personal
data. Only publishable client side keys may appear in the codebase.

[Back to top](#table-of-contents)

## 14. Review and Release

Maintainers review contributions for correctness, clarity, consistency with the
existing patterns, and compliance with this guide. Approved changes are merged
into `main`, from which the application is built and deployed. Notable changes
should be summarised on the news page of the marketing site.

[Back to top](#table-of-contents)

## 15. Contact

Use the GitHub repository for all project communication. Open an issue for
defects and proposals, and use pull request comments for review discussion.

[Back to top](#table-of-contents)
