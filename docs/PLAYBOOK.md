Before writing any code, read this document and the relevant files in /docs. If documentation and requested implementation conflict, the documentation takes precedence. If documentation is incomplete, stop and ask for clarification instead of making assumptions.
# CrediEdge OS Development Playbook

> This document defines how CrediEdge OS is designed, built and maintained.
>
> Every contributor, whether human or AI, must follow this playbook.

---

# Core Philosophy

CrediEdge OS is not simply a CRM.

It is an AI-powered Business Operating System.

Our goal is simple.

When a business owner opens CrediEdge OS, they should immediately know:

- What happened.
- What needs attention.
- How healthy the business is.
- What to do next.

Every feature should reinforce this philosophy.

---

# Product Principles

Every feature must achieve at least one of the following:

- Save time
- Generate revenue
- Reduce risk
- Improve customer experience

If it does none of these things, it should not be built.

---

# Dashboard Philosophy

The dashboard is the command centre of the business.

It should answer four questions within thirty seconds.

1. What happened?
2. What needs my attention?
3. How healthy is my business?
4. What should I do next?

The dashboard should reduce decisions, not create them.

---

# AI Philosophy

AI is an assistant.

It should:

- Explain
- Recommend
- Prioritise
- Automate
- Summarise

AI should never remove user control.

Premium AI should become smarter over time by learning business behaviour.

---

# Engineering Principles

Always follow these principles.

## Build once

Create reusable components.

Never solve the same problem twice.

---

## Keep modules independent

Every module should work on its own while integrating seamlessly with every other module.

---

## One source of truth

Never duplicate business data.

Everything should have one authoritative source.

---

## Production quality

Never introduce:

- Placeholder logic
- Fake production data
- TODO comments
- Incomplete implementations

Everything should be production ready.

---

## Performance

Prefer simple solutions.

Optimise unnecessary API calls.

Cache where appropriate.

Avoid unnecessary rendering.

---

## Security

Permissions must be enforced on the server.

Never trust client-side validation.

Protect customer data at all times.

---

# Development Workflow

Every feature follows exactly the same process.

## Step 1

Define the problem.

Do not write code.

---

## Step 2

Write or update documentation inside /docs.

Examples:

vision.md

product.md

dashboard.md

modules/

---

## Step 3

Only after documentation exists should implementation begin.

Implementation must follow documentation.

Never invent missing requirements.

If requirements are unclear:

STOP

Ask questions.

Do not guess.

---

## Step 4

Implement the feature.

---

## Step 5

Run

- lint

- typecheck

- tests

- build

Fix every issue before creating a Pull Request.

---

## Step 6

Open Pull Request.

Provide:

- Summary
- Files changed
- Technical debt
- Future improvements

---

# Pull Request Rules

PRs should remain focused.

One responsibility.

One feature.

Easy to review.

Easy to revert.

Small PRs are preferred over massive ones.

---

# Dashboard Rules

Never overload the dashboard.

Every widget must answer one of these questions.

What changed?

What needs my attention?

How healthy is my business?

What should I do next?

If it answers none of these questions, it should not appear on the dashboard.

---

# UX Principles

Software should feel calm.

Never overwhelming.

Never cluttered.

Visual hierarchy is more important than the amount of information displayed.

The dashboard should feel like the command centre of the business.

---

# Business Health

Business Health is one of the signature features of CrediEdge OS.

The score should always explain:

Why it changed.

How to improve it.

Which actions have the greatest impact.

The score should never feel like a random number.

---

# AI Behaviour

AI should be proactive.

Instead of waiting for questions, it should identify opportunities.

Examples:

Customers needing follow-up.

Invoices becoming overdue.

Pipeline slowing down.

Risk increasing.

Cash flow issues.

Response times slipping.

The AI should become increasingly personalised over time.

---

# Non-Negotiables

Never redesign existing architecture without strong justification.

Never replace working systems without measurable benefit.

Never duplicate functionality.

Never sacrifice usability for visual effects.

Every screen should have one clear purpose.

Every click should move the user closer to completing meaningful work.

---

# Definition of Done

A feature is only complete when:

✓ Production ready

✓ Fully tested

✓ Documented

✓ Reviewed

✓ Accessible

✓ Responsive

✓ Secure

✓ Uses reusable components

✓ Integrated with existing modules

✓ Matches the CrediEdge vision

If any item is incomplete, the feature is not complete.

---

# The CrediEdge Standard

We are not building software.

We are building the operating system businesses rely on every single day.

Every design decision should make business owners feel more informed, more organised and more in control.

When someone opens CrediEdge OS, they should immediately know exactly what their business needs from them today.