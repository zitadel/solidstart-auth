---
title: Introduction
group: Getting Started
children:
  - ./installation.md
---

# Introduction

`@zitadel/solidstart-auth` is an open source library that provides
authentication for SolidStart applications. It wraps
auth (`@auth/core`) to bring OAuth, credentials, and
magic-link authentication to SolidStart with a native developer experience.

Through a direct integration into SolidStart's API routes and server
functions, you can access and utilize user sessions within your routes and
components directly.

## Features

### Authentication providers

- OAuth (eg. GitHub, Google, Twitter, Azure...)
- Custom OAuth (Add your own!)
- Credentials (username / email + password)
- Email Magic URLs

### Application Side Session Management

- Session fetching from API routes via `getSession`
- Methods to `getSession`, `signIn` and `signOut`
- Full TypeScript support for all methods and properties

### Application protection

- API route protection via `getSession(event.request)`
- Server function gating with session checks
- Solid-router protected route patterns using session data
