# PulseWatch

**Website and API monitoring for developers, indie hackers, and small
teams.**

PulseWatch is a monitoring platform that checks whether websites and
HTTP APIs are reachable, records their performance over time, detects
incidents, and notifies users when a service goes down or recovers.

> **Project status:** MVP in development\
> **Initial focus:** Reliable HTTP/HTTPS monitoring, incident detection,
> uptime history, email alerts, and public status pages.

------------------------------------------------------------------------

## Table of contents

-   [What is PulseWatch?](#what-is-pulsewatch)
-   [Why build it?](#why-build-it)
-   [The problem](#the-problem)
-   [Who is it for?](#who-is-it-for)
-   [Core features](#core-features)
-   [How it works](#how-it-works)
-   [Architecture](#architecture)
-   [Technology stack](#technology-stack)
-   [Repository structure](#repository-structure)
-   [Core monitoring flow](#core-monitoring-flow)
-   [Data model](#data-model)
-   [MVP scope](#mvp-scope)
-   [Getting started](#getting-started)
-   [Environment variables](#environment-variables)
-   [Development workflow](#development-workflow)
-   [Security considerations](#security-considerations)
-   [Testing](#testing)
-   [Deployment overview](#deployment-overview)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [License](#license)

------------------------------------------------------------------------

## What is PulseWatch?

PulseWatch is a website and API uptime monitoring service.

A user adds a URL, chooses how often it should be checked, and
PulseWatch takes care of the rest. A background worker periodically
sends an HTTP request to the configured endpoint, measures the response,
and stores the result.

If repeated checks fail, PulseWatch opens an incident. When the service
becomes healthy again, the incident is resolved. Users can review uptime
and response-time history, receive email notifications, and share a
public status page.

The goal is to make essential service monitoring straightforward without
requiring users to operate their own monitoring infrastructure.

## Why build it?

Websites and APIs are often critical parts of a product, but their
owners may not know when they become unavailable or start responding
slowly.

PulseWatch is being built to:

-   Give developers visibility into the availability of their services.
-   Detect downtime without requiring someone to manually check a
    website.
-   Keep a useful history of checks, response times, and incidents.
-   Notify the right people when something goes wrong.
-   Provide a simple status page that can be shared with customers or
    teammates.
-   Offer a practical, understandable monitoring workflow for smaller
    projects and teams.

This project is also an opportunity to learn and apply real backend
engineering concepts: background jobs, queues, scheduling, database
modeling, failure handling, observability, security, and production
deployment.

## The problem

Without monitoring, a service can become unavailable and remain broken
until:

-   A customer reports the issue.
-   A developer happens to visit the website.
-   An internal process fails and someone notices later.
-   A team manually checks multiple services.

This creates avoidable downtime, slower incident response, and
uncertainty about service reliability.

A basic uptime check alone is not enough. A useful monitoring system
also needs to handle unreliable networks, timeouts, repeated failures,
false positives, duplicate jobs, incident recovery, and notification
delivery.

**PulseWatch aims to turn those separate concerns into one clear
workflow: check, record, detect, notify, and report.**

## Who is it for?

PulseWatch is initially designed for:

-   **Indie hackers** who run small SaaS products and need to know when
    their product is unavailable.
-   **Independent developers and freelancers** who maintain websites or
    APIs for clients.
-   **Small engineering teams** that need a simple view of service
    availability.
-   **Startup teams** that want basic uptime monitoring without building
    the infrastructure themselves.
-   **Side-project builders** who want visibility into the reliability
    of their applications.

The first version is not intended to replace complex enterprise
observability platforms or provide full application performance
monitoring.

## Core features

### 1. Website and API monitoring

-   Add a website or API endpoint.
-   Configure the check interval and timeout.
-   Run HTTP/HTTPS GET checks.
-   Record status codes, response times, and errors.

### 2. Background monitoring

-   Schedule checks independently of user activity.
-   Process checks through background workers.
-   Retry eligible failed jobs.
-   Handle worker restarts and duplicate jobs safely.

### 3. Uptime and response-time history

-   View historical check results.
-   Calculate uptime for supported time windows.
-   Review response-time trends.
-   Identify periods of downtime.

### 4. Incident detection

-   Detect repeated failed checks.
-   Open an incident after the configured failure threshold.
-   Track when an incident starts.
-   Resolve incidents after recovery is confirmed.
-   Avoid creating duplicate incidents for the same outage.

### 5. Email notifications

-   Notify users when an incident opens.
-   Send a recovery notification when service returns.
-   Record notification attempts and delivery status.
-   Retry transient delivery failures without sending duplicate alerts.

### 6. Public status pages

-   Create a shareable status page.
-   Choose which monitors appear on it.
-   Show current service status and relevant incident history.
-   Keep private account information out of public responses.

------------------------------------------------------------------------

## How it works

At a high level, PulseWatch has three main application parts:

1.  **Web application:** where users sign up, configure monitors, and
    view results.
2.  **API server:** handles authentication, user requests, validation,
    and database operations.
3.  **Background worker:** runs scheduled checks, processes results,
    detects incidents, and handles asynchronous tasks.

PostgreSQL stores application data. Redis and BullMQ coordinate
background jobs.

## Architecture

``` mermaid
flowchart TD
    U[User] --> WEB[Next.js Web App]
    WEB --> API[Express API]
    API --> DB[(PostgreSQL)]
    API --> Q[Redis / BullMQ]
    Q --> W[Monitoring Worker]
    W --> TARGET[External Website or API]
    W --> DB
    W --> IQ[Notification Queue]
    IQ --> NW[Notification Worker]
    NW --> EMAIL[Email Provider]
    DB --> API
    API --> WEB
    WEB --> PUBLIC[Public Status Page]
```

### Component responsibilities

  -----------------------------------------------------------------------
  Component                           Responsibility
  ----------------------------------- -----------------------------------
  Next.js web app                     User interface, dashboard, monitor
                                      management, analytics, and public
                                      status pages

  Express API                         Authentication, authorization,
                                      validation, business logic, and
                                      data access

  PostgreSQL                          Users, monitors, check results,
                                      incidents, and notification records

  Prisma                              Database schema, migrations, and
                                      typed database access

  Redis                               Queue infrastructure and job
                                      coordination

  BullMQ                              Scheduling and processing
                                      background jobs

  Monitoring worker                   Makes HTTP checks and records their
                                      results

  Notification worker                 Sends incident and recovery emails

  Email provider                      Delivers email notifications
  -----------------------------------------------------------------------

PulseWatch starts as a **modular monolith with a separate worker
process**. This keeps the system understandable while allowing
long-running monitoring tasks to run separately from user-facing API
requests.

------------------------------------------------------------------------

## Technology stack

  -----------------------------------------------------------------------
  Area                    Technology              Why it is used
  ----------------------- ----------------------- -----------------------
  Frontend                Next.js                 React-based application
                                                  and routing

  Language                TypeScript              Type safety across the
                                                  application

  Styling                 Tailwind CSS            Consistent and
                                                  maintainable UI styling

  Backend                 Node.js + Express       HTTP API and
                                                  application logic

  Database                PostgreSQL              Reliable relational
                                                  storage

  ORM                     Prisma                  Schema management,
                                                  migrations, and typed
                                                  queries

  Queue infrastructure    Redis                   Supports background job
                                                  processing

  Job processing          BullMQ                  Queues, scheduling,
                                                  retries, and workers

  Validation              Zod                     Runtime validation of
                                                  incoming data

  Charts                  Recharts                Uptime and
                                                  response-time
                                                  visualizations

  Testing                 Vitest + Supertest      Unit and API testing

  Local infrastructure    Docker Compose          Reproducible local
                                                  PostgreSQL and Redis
                                                  services

  Version control         Git + GitHub            Source control and
                                                  collaboration

  Deployment              Vercel + a Node.js      Frontend and
                          hosting provider        long-running API/worker
                                                  hosting
  -----------------------------------------------------------------------

The exact hosting provider and email delivery service can be selected
during deployment. The worker must run in an environment that supports
persistent background processes.

------------------------------------------------------------------------

## Repository structure

The planned repository uses npm workspaces:

``` text
pulsewatch/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # Express backend
│   └── worker/              # Background workers
├── packages/
│   ├── database/            # Prisma schema and database client
│   └── shared/              # Shared types, schemas, and utilities
├── docker-compose.yml       # Local PostgreSQL and Redis
├── package.json             # Workspace configuration
├── .env.example             # Example environment variables
├── .gitignore
└── README.md
```

The structure may evolve as implementation progresses. Keep shared
packages only where they reduce duplication and clarify ownership.

## Core monitoring flow

A typical monitoring cycle works as follows:

1.  A user creates a monitor through the web application.
2.  The API validates the URL and monitor configuration.
3.  The API saves the monitor in PostgreSQL.
4.  The scheduling system arranges recurring jobs based on the monitor's
    interval.
5.  Redis and BullMQ make jobs available to the monitoring worker.
6.  The worker performs the HTTP request and measures the result.
7.  The worker stores the status code, response time, timestamp, and any
    error.
8.  Incident logic evaluates recent results.
9.  If the failure threshold is reached, an incident is opened.
10. A notification job is queued and an email is sent.
11. When successful checks confirm recovery, the incident is resolved
    and a recovery notification is queued.
12. The dashboard and public status page display the latest stored
    information.

``` mermaid
sequenceDiagram
    participant User
    participant Web
    participant API
    participant DB as PostgreSQL
    participant Queue as Redis/BullMQ
    participant Worker
    participant Site as Monitored Site
    participant Email

    User->>Web: Create monitor
    Web->>API: Submit monitor
    API->>DB: Validate and save monitor
    API->>Queue: Schedule recurring check
    Queue->>Worker: Deliver check job
    Worker->>Site: Send HTTP request
    Site-->>Worker: HTTP response or failure
    Worker->>DB: Save check result
    Worker->>DB: Evaluate incident state
    Worker->>Queue: Queue notification if needed
    Queue->>Email: Deliver notification job
    Web->>API: Request monitor history
    API->>DB: Read checks and incidents
    API-->>Web: Return monitoring data
```

## Data model

The initial data model is expected to include:

  -----------------------------------------------------------------------
  Model                               Purpose
  ----------------------------------- -----------------------------------
  `User`                              Account and authentication
                                      information

  `Monitor`                           URL, interval, timeout, ownership,
                                      and current configuration

  `CheckResult`                       Individual monitoring check
                                      outcomes

  `Incident`                          Outage lifecycle, start time,
                                      resolution time, and reason

  `NotificationLog`                   Notification attempts and delivery
                                      status

  `StatusPage`                        Public status page configuration

  `StatusPageMonitor`                 Monitors associated with a status
                                      page
  -----------------------------------------------------------------------

Relationships:

-   A user can own many monitors.
-   A monitor can have many check results.
-   A monitor can have many incidents over time.
-   An incident can have notification records.
-   A user can own status pages.
-   A status page can include multiple monitors.

The database schema and constraints should be treated as the source of
truth as implementation progresses.

------------------------------------------------------------------------

## MVP scope

The first release should focus on a complete, reliable monitoring loop.

### Included in the MVP

-   [ ] User registration, login, and logout
-   [ ] Protected dashboard
-   [ ] Monitor creation, editing, activation, and deletion
-   [ ] HTTP/HTTPS GET checks
-   [ ] Configurable check intervals and timeouts
-   [ ] Background scheduling and worker processing
-   [ ] Check history and response-time tracking
-   [ ] Uptime calculations
-   [ ] Incident creation and recovery
-   [ ] Email notifications
-   [ ] Public status pages
-   [ ] Basic tests, logging, and security protections

### Not included in the first MVP

-   Multi-region monitoring
-   SMS notifications
-   Webhook notifications
-   Advanced request headers and custom assertions
-   Team collaboration and role management
-   Billing and subscriptions
-   AI-powered incident analysis
-   Native mobile applications
-   Enterprise observability features

These can be considered later based on actual user feedback and
operational needs.

------------------------------------------------------------------------

## Getting started

> The commands below describe the intended local development setup.
> Adjust them to match the scripts and package names implemented in the
> repository.

### Prerequisites

Install:

-   Node.js (use a current LTS release)
-   npm
-   Docker Desktop or Docker Engine with Compose
-   Git

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd pulsewatch
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

``` bash
cp .env.example .env
```

Fill in the required local values. Never commit real credentials or
production secrets.

### 4. Start infrastructure

``` bash
docker compose up -d
```

This should start the local PostgreSQL and Redis services.

### 5. Run database migrations

Once the Prisma schema and database scripts are configured, run the
repository's migration command. For example:

``` bash
npx prisma migrate dev
```

If Prisma lives in a workspace package, run the equivalent command from
that package or through its workspace script.

### 6. Start the applications

Use the scripts defined in the root `package.json`. The intended
development processes are:

-   Web application
-   API server
-   Monitoring worker

For example, a workspace may expose commands similar to:

``` bash
npm run dev --workspace=apps/web
npm run dev --workspace=apps/api
npm run dev --workspace=apps/worker
```

These are illustrative until the actual workspace scripts are created.

------------------------------------------------------------------------

## Environment variables

The exact names should be kept consistent between application code,
`.env.example`, and deployment settings.

Example categories:

``` dotenv
# Application
NODE_ENV=development
WEB_URL=http://localhost:3000
API_PORT=4000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pulsewatch

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
SESSION_SECRET=replace-with-a-long-random-secret

# Email provider
EMAIL_API_KEY=
EMAIL_FROM=

# Optional public configuration
PUBLIC_APP_URL=http://localhost:3000
```

Use strong, unique secrets outside local development. Do not use the
example credentials in production. Add any provider-specific variables
only when that integration is implemented.

------------------------------------------------------------------------

## Development workflow

A suggested workflow for contributors and for day-to-day development:

1.  Pick one small task from the project roadmap.
2.  Understand the behavior and expected result before coding.
3.  Update the relevant API contract or data model if needed.
4.  Implement the smallest complete change.
5.  Test the feature and its failure cases.
6.  Run the relevant test suite.
7.  Review the diff and remove temporary code.
8.  Commit with a clear message.

Example commit messages:

``` text
feat: add monitor creation endpoint
feat: schedule recurring monitor checks
fix: prevent duplicate incident creation
test: cover monitor ownership validation
docs: document local development setup
```

------------------------------------------------------------------------

## Security considerations

Monitoring arbitrary URLs introduces security risks. Security must be
part of the design, not an afterthought.

### Server-side request forgery (SSRF)

A user could attempt to make the monitoring worker request internal
services instead of public websites.

The monitoring engine must:

-   Accept only supported HTTP and HTTPS URL schemes.
-   Reject loopback, private, link-local, and reserved IP ranges.
-   Block cloud metadata endpoints.
-   Resolve and validate DNS results before connecting.
-   Protect against DNS rebinding by ensuring the connection uses a
    validated destination.
-   Revalidate redirect destinations or disable redirects.
-   Limit request timeouts and response sizes.
-   Avoid forwarding internal network details in user-facing errors.

### Account and application security

-   Hash passwords using a modern password hashing algorithm.
-   Use secure, HTTP-only cookies if using cookie-based sessions.
-   Apply CSRF protections where required by the authentication design.
-   Enforce ownership checks on every private resource.
-   Validate all incoming data.
-   Apply rate limits to sensitive endpoints.
-   Keep secrets out of source control.
-   Avoid exposing stack traces or sensitive details in API responses.
-   Ensure public status endpoints return only explicitly public data.

This README is not a substitute for a security review. The
implementation should be tested against the actual deployment
environment and threat model.

------------------------------------------------------------------------

## Testing

Testing should cover both expected behavior and failure conditions.

### API and application tests

-   Authentication and session behavior
-   Monitor CRUD operations
-   User ownership and authorization
-   Input validation
-   Uptime calculations
-   Incident state transitions
-   Public status page access rules

### Worker tests

-   Successful HTTP checks
-   HTTP error responses
-   DNS failures
-   Connection failures
-   Timeouts
-   Invalid and blocked destinations
-   Duplicate jobs
-   Retry behavior
-   Worker shutdown and restart
-   Incident deduplication

### End-to-end checks

-   Register and log in.
-   Create a monitor.
-   Confirm a check is executed.
-   Confirm its result is stored and displayed.
-   Simulate an outage using a controlled test endpoint.
-   Confirm an incident and notification are created.
-   Restore the endpoint.
-   Confirm the incident is resolved.

------------------------------------------------------------------------

## Deployment overview

A production deployment needs separate consideration for the web
application, API, worker, database, and Redis.

  -----------------------------------------------------------------------
  Part                                Deployment requirement
  ----------------------------------- -----------------------------------
  Web                                 Host the Next.js application

  API                                 Run the Express server with
                                      production environment variables

  Worker                              Run a persistent Node.js process;
                                      do not deploy it as a short-lived
                                      request-only function

  PostgreSQL                          Use managed production database
                                      hosting and backups

  Redis                               Use managed Redis with appropriate
                                      persistence and access controls

  Email                               Configure a verified sender and
                                      production API credentials
  -----------------------------------------------------------------------

Before inviting users:

-   Apply production database migrations.
-   Configure HTTPS and secure cookies.
-   Restrict CORS to trusted origins.
-   Verify worker scheduling and restart behavior.
-   Configure logs and error monitoring.
-   Test email delivery.
-   Configure database backups and data retention.
-   Run production smoke tests.

------------------------------------------------------------------------

## Roadmap

### Phase 1 --- Foundation

-   [ ] Repository and workspace setup
-   [ ] Local PostgreSQL and Redis
-   [ ] Prisma schema and migrations
-   [ ] Express API foundation
-   [ ] Authentication

### Phase 2 --- Monitor management

-   [ ] Monitor CRUD API
-   [ ] Dashboard UI
-   [ ] Monitor details and history pages

### Phase 3 --- Monitoring engine

-   [ ] BullMQ infrastructure
-   [ ] Recurring scheduling
-   [ ] HTTP monitoring worker
-   [ ] Check result persistence
-   [ ] SSRF protections

### Phase 4 --- Reliability features

-   [ ] Incident detection
-   [ ] Recovery handling
-   [ ] Uptime and response-time analytics
-   [ ] Email notifications
-   [ ] Public status pages

### Phase 5 --- Production readiness

-   [ ] Automated tests
-   [ ] Security review
-   [ ] Logging and operational monitoring
-   [ ] Deployment
-   [ ] Initial user feedback
-   [ ] Reliability improvements based on real usage

------------------------------------------------------------------------

## Contributing

Contributions, bug reports, and practical feedback are welcome.

When proposing a change:

1.  Explain the problem it solves.
2.  Keep the scope focused.
3.  Include tests for behavior changes.
4.  Update documentation when needed.
5.  Avoid adding complexity without a clear use case.

For bugs, include steps to reproduce, expected behavior, actual
behavior, and relevant logs with secrets and personal data removed.

## License

A license has not been selected yet. Add a `LICENSE` file before
presenting the project as open source. Until then, do not assume that
the repository is licensed for reuse.
