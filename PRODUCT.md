# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS, and JavaScript, delegated by the user through the request to begin a Netlify-hosted project. This keeps the first version deployable without a server.

## Users

The primary user is the owner of a small marmita business. They need to register sales and operating expenses amid cooking, delivery, purchasing, and end-of-day checks, primarily on a mobile phone and sometimes on desktop.

## Product Purpose

Livro Caixa is a personal financial-control tool for recording business income and expenses, seeing current balance, and understanding the result of a chosen period without manual calculations.

## Positioning

It is an intentionally focused, mobile-friendly cash book built around the actual categories and rhythm of a marmita operation, rather than a generic accounting system.

## Operating Context

The product uses Brazilian reais and Brazilian date conventions. Typical records include marmita sales, ingredient purchases, packaging, gas, fuel, delivery fees, utilities, marketing, and payment methods such as cash, PIX, card, and transfer.

## Capabilities and Constraints

The first version supports dashboard summaries, transaction creation, editing, deletion with confirmation, filters, and category summaries. Data persists only in the current browser through local storage. There is no login, cloud sync, banking integration, tax calculation, stock control, or multi-user access in this version.

## Brand Commitments

Use the Inter font family. The design-system palette is #FFBE91, #FFDDB0, #FFFCE1, and #CFEBFF. The tone must be clear, warm, and practical for a personal business tool.

## Evidence on Hand

Product requirements and scope are documented in `PRD-Livro-Caixa.md`. There are no supplied customer records, assets, logos, testimonials, or real financial data. Any interface data must be visibly labeled as illustrative or start empty.

## Product Principles

- Make adding a transaction faster than writing it down elsewhere.
- Keep financial meaning obvious: income, expense, balance, and period must never be ambiguous.
- Use language and categories that match a marmita business.
- Prioritize a comfortable mobile workflow without reducing desktop clarity.
- Preserve the user's control over data by avoiding hidden calculations or automated financial claims.

## Accessibility & Inclusion

The interface must support keyboard navigation, clear field labels, visible focus states, touch-friendly controls, and sufficient text contrast. Color alone must not communicate transaction type or status.
