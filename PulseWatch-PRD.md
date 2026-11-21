# PulseWatch — Product Requirements Document (PRD)

**Document status:** Draft for MVP development  
**Version:** 1.0  
**Product:** PulseWatch  
**Document owner:** Product / Engineering  
**Last updated:** 21 November 2026

---

## 1. Executive summary

PulseWatch is a lightweight website and HTTP API monitoring platform for indie hackers, independent developers, freelancers, startups, and small engineering teams.

A user adds a URL, chooses a monitoring interval, and PulseWatch periodically checks the endpoint in the background. It records availability and response-time data, detects sustained failures, creates and resolves incidents, sends email notifications, and provides a shareable public status page.

The MVP is focused on one complete and trustworthy monitoring workflow rather than a large feature set:

**Configure monitor → schedule check → execute request → store result → detect incident → notify user → show history and status.**

The primary product promise is simple: help users discover service outages without having to manually check their websites or APIs.

## 2. Product vision

Make dependable service monitoring accessible to people who build and operate websites and APIs, without requiring them to build or maintain monitoring infrastructure themselves.

### Product principles

1. **Reliability over feature count.** A monitoring result must be trustworthy before adding advanced functionality.
2. **Clarity over complexity.** Users should understand what is monitored, what happened, and what action may be needed.
3. **Useful alerts, not alert noise.** Consecutive-failure and recovery rules should reduce false positives and duplicate notifications.
4. **Secure by design.** Monitoring user-supplied URLs creates SSRF and abuse risks; those protections are release requirements.
5. **Transparent measurements.** Explain what the uptime and response-time metrics mean and what they do not mean.
6. **Build for real usage.** Instrument the system and learn from early users before scaling or adding enterprise features.

## 3. Problem statement

Website and API owners can experience downtime, slow responses, DNS problems, TLS failures, or deployment-related outages without noticing immediately.

For small teams and solo builders, monitoring may be absent, manually performed, or spread across tools that are too complex for their immediate needs.

This creates several problems:

- Service failures may be discovered by customers before the owner.
- Teams may not know when an outage began or how long it lasted.
- A single current status does not explain reliability over time.
- Repeated manual checks consume time and are easy to forget.
- Customers have no simple, continuously updated status page to consult.
- Unfiltered failure alerts can create noise and reduce trust in monitoring.

### Problem statement

Developers and small teams need a simple way to continuously check public websites and HTTP APIs, understand availability over time, and receive actionable notifications when sustained failures occur.

## 4. Target users and personas

### Primary persona: Indie hacker / solo SaaS founder

**Context:** Runs one or more small web products, often without a dedicated operations team.

**Needs:**
- Know when a product website or API becomes unavailable.
- Configure monitoring quickly.
- Receive an email when a problem occurs.
- Check recent uptime and incident history.

**Pain points:**
- Finds out about outages from users.
- Does not want to operate monitoring infrastructure.
- Needs a low-friction product with understandable results.

### Secondary persona: Freelance developer / agency maintainer

**Context:** Maintains websites and APIs for multiple clients.

**Needs:**
- Monitor multiple client endpoints.
- Quickly identify which service is unhealthy.
- Review historical incidents.
- Share a status page where appropriate.

**Pain points:**
- Manually checking many endpoints is inefficient.
- Client-reported failures can damage trust.
- Needs a clear record of service behavior.

### Secondary persona: Small startup engineering team

**Context:** Owns a small number of production services without a large SRE function.

**Needs:**
- Basic external availability monitoring.
- Incident and recovery notifications.
- A simple reliability history.
- A public status page.

**Pain points:**
- Wants basic monitoring without enterprise-tool overhead.
- Needs confidence that checks and alerts are actually running.

### Not the initial target

- Large enterprises requiring complex access controls, compliance certifications, and custom SLAs.
- Teams requiring distributed multi-region probes.
- Users seeking full application performance monitoring, distributed tracing, log aggregation, or infrastructure metrics.

## 5. Goals and non-goals

### MVP goals

- Let a user create an account and securely manage monitors.
- Let a user configure public HTTP/HTTPS endpoints for monitoring.
- Run scheduled checks independently of dashboard activity.
- Persist check outcomes and response-time measurements.
- Detect sustained outages and confirmed recovery.
- Send incident and recovery email notifications.
- Show monitor status, check history, uptime, and response-time trends.
- Allow users to publish a status page containing selected monitors.
- Operate safely against untrusted user-supplied URLs.
- Provide enough logs and operational visibility to troubleshoot the monitoring system itself.

### MVP non-goals

The MVP will not include:

- Multi-region or geographically distributed checks.
- Browser-based synthetic monitoring.
- Keyword or content assertions.
- Custom HTTP methods, request headers, authentication credentials, or request bodies.
- TCP, DNS-only, ping, or certificate-expiry monitoring as standalone monitor types.
- SMS, voice, Slack, Discord, or webhook notifications.
- Team workspaces, role-based access control, or organization billing.
- Subscription management or metered billing.
- AI-generated incident analysis.
- Native mobile applications.
- Full APM, tracing, log management, or infrastructure monitoring.
- Guaranteed enterprise SLA.

## 6. Product scope and release definition

### MVP release

A release is considered an MVP only when a user can complete this end-to-end journey:

1. Register and log in.
2. Create a valid HTTP/HTTPS GET monitor.
3. See the monitor in the dashboard.
4. Have the system execute recurring checks without user interaction.
5. See persisted check results and response-time history.
6. Trigger a controlled outage and have an incident opened after the configured failure threshold.
7. Receive an incident email.
8. Restore the endpoint and have the incident resolved after recovery confirmation.
9. Receive a recovery email.
10. Publish a status page showing selected monitor status.
11. Use the system without accessing another user's private data.

### Release priorities

- **P0 — Must have:** Required for MVP acceptance.
- **P1 — Should have:** Important, but can follow immediately after a stable MVP.
- **P2 — Later:** Explicitly out of MVP scope.

## 7. User journeys

### Journey A: Sign up and create first monitor

1. Visitor opens the landing page.
2. Visitor chooses sign up.
3. Visitor submits name, email, and password.
4. System validates input and creates the account.
5. User is authenticated and taken to the dashboard.
6. Dashboard explains that no monitors exist yet.
7. User selects **Add monitor**.
8. User enters a monitor name and URL.
9. User chooses an available interval and timeout.
10. System validates and saves the monitor.
11. Dashboard shows the new monitor with a pending or awaiting-first-check state.
12. First check runs and the result is displayed.

**Success:** The user can create a monitor and see its first result without technical setup outside the product.

### Journey B: Monitor becomes unavailable

1. A scheduled check is executed.
2. The request fails or returns a result classified as unhealthy.
3. The check result is saved.
4. Incident evaluation considers recent consecutive failures.
5. Once the failure threshold is met, an incident is opened.
6. Monitor status changes to down.
7. An incident notification is queued.
8. Email worker sends the notification.
9. Dashboard shows the open incident and its start time.

**Success:** A sustained outage creates one incident and one logical notification event.

### Journey C: Monitor recovers

1. A later scheduled check succeeds.
2. The result is stored.
3. Recovery policy confirms that the endpoint is healthy.
4. The open incident is resolved.
5. Resolution time and duration are recorded.
6. Monitor status changes to up.
7. A recovery notification is queued and delivered.
8. Dashboard history reflects the resolved incident.

**Success:** The incident is resolved once and a recovery email is not duplicated.

### Journey D: Review reliability

1. User opens a monitor details page.
2. User sees current status and recent check history.
3. User selects a time window.
4. System returns uptime and response-time information for that window.
5. User reviews incidents in the same period.

**Success:** The user can understand recent service behavior and identify periods of failure.

### Journey E: Publish a status page

1. User creates a status page.
2. User chooses a public title and unique slug.
3. User selects monitors to include.
4. User publishes the page.
5. An unauthenticated visitor opens the public URL.
6. Visitor sees only the selected public service information.

**Success:** Public visitors can view service status without gaining access to account or monitor-management data.

## 8. Functional requirements

### 8.1 Authentication and account management

**Priority:** P0

Requirements:

- FR-AUTH-01: A visitor can register with a name, email, and password.
- FR-AUTH-02: The system validates required fields and email format.
- FR-AUTH-03: The system prevents duplicate accounts for the same normalized email.
- FR-AUTH-04: Passwords are stored only as secure password hashes.
- FR-AUTH-05: A registered user can log in.
- FR-AUTH-06: A user can log out.
- FR-AUTH-07: A user can retrieve their current authenticated account.
- FR-AUTH-08: Private API endpoints require authentication.
- FR-AUTH-09: Sessions or tokens are invalidated according to the selected authentication design.
- FR-AUTH-10: Authentication secrets and session credentials are never returned in API response bodies or logs.

Acceptance criteria:

- Registration with valid details creates one account.
- Duplicate email registration is rejected with a safe, understandable error.
- Incorrect credentials do not authenticate the user.
- Unauthenticated requests to private endpoints are rejected.
- A logged-out user cannot continue using protected functionality with the old session.

### 8.2 Monitor management

**Priority:** P0

A monitor represents one endpoint the user wants PulseWatch to check.

Initial monitor fields:

- `id`
- `userId`
- `name`
- `url`
- `method` (MVP: GET)
- `intervalSeconds`
- `timeoutMs`
- `isActive`
- `createdAt`
- `updatedAt`

Requirements:

- FR-MON-01: An authenticated user can create a monitor.
- FR-MON-02: A monitor must have a valid name and supported HTTP/HTTPS URL.
- FR-MON-03: The MVP supports GET requests only.
- FR-MON-04: The user can select from supported check intervals.
- FR-MON-05: The user can configure a timeout within server-defined limits.
- FR-MON-06: A user can list only their own monitors.
- FR-MON-07: A user can retrieve an individual monitor they own.
- FR-MON-08: A user can update monitor name, URL, interval, timeout, and active state.
- FR-MON-09: A user can deactivate and reactivate a monitor.
- FR-MON-10: A user can delete a monitor they own.
- FR-MON-11: Ownership is verified on every read or mutation.
- FR-MON-12: Changes to interval or active state update the recurring schedule safely.
- FR-MON-13: Deactivated or deleted monitors do not continue receiving new scheduled checks.

Acceptance criteria:

- A user cannot read, update, or delete another user's monitor by guessing its ID.
- Invalid URL schemes are rejected.
- Deactivated monitors stop receiving new scheduled jobs.
- Updating a monitor does not create duplicate recurring schedules.
- Deleting a monitor follows a documented policy for historical data and related records.

### 8.3 Scheduling and background processing

**Priority:** P0

Requirements:

- FR-JOB-01: Monitor checks run in the background and do not depend on an active browser session.
- FR-JOB-02: Each active monitor receives recurring checks based on its configured interval.
- FR-JOB-03: Scheduling is coordinated through the queue infrastructure.
- FR-JOB-04: Duplicate scheduling is prevented or made harmless.
- FR-JOB-05: Jobs have stable identifiers or another deduplication strategy.
- FR-JOB-06: Transient processing failures can be retried with bounded backoff.
- FR-JOB-07: Permanent or exhausted failures are observable.
- FR-JOB-08: Worker concurrency is configurable.
- FR-JOB-09: Workers shut down gracefully.
- FR-JOB-10: A worker restart does not silently disable all recurring monitors.
- FR-JOB-11: Queue payloads contain only the identifiers and data needed to execute the job; the worker re-reads authoritative monitor configuration.
- FR-JOB-12: A monitor's current active state is checked before a request is executed.

Acceptance criteria:

- An active monitor is checked repeatedly at its configured interval within the scheduler's expected tolerance.
- Stopping and restarting a worker does not permanently stop recurring monitoring.
- A duplicate job cannot create duplicate incidents or corrupt monitor state.
- A deactivated monitor is not checked by stale queued jobs.

### 8.4 HTTP monitoring engine

**Priority:** P0

Requirements:

- FR-CHECK-01: The worker sends an HTTP GET request to the configured URL.
- FR-CHECK-02: The worker measures request duration.
- FR-CHECK-03: The worker records the HTTP status code when available.
- FR-CHECK-04: The worker records a success/failure classification.
- FR-CHECK-05: The worker records a normalized error category for transport failures.
- FR-CHECK-06: Requests have a strict timeout.
- FR-CHECK-07: Response body consumption is limited; the worker does not download arbitrary large bodies.
- FR-CHECK-08: Redirect handling follows the SSRF-safe redirect policy.
- FR-CHECK-09: One failed request does not crash the worker process.
- FR-CHECK-10: The worker persists a check result for each completed attempt, subject to documented handling of infrastructure-level job failures.
- FR-CHECK-11: The system distinguishes an HTTP response from a network-level failure.
- FR-CHECK-12: The MVP uses a documented health classification policy.

Initial classification proposal:

- A successful HTTP response is considered reachable.
- HTTP 2xx and 3xx may be classified as healthy if the configured redirect policy allows the final response.
- HTTP 4xx and 5xx are recorded as unhealthy by default for the MVP.
- DNS, connection, TLS, and timeout errors are unhealthy.
- The exact treatment of redirects and status-code ranges must be consistent, documented, and covered by tests.

Acceptance criteria:

- A controlled healthy endpoint produces a successful result with response time.
- A controlled 500 endpoint produces an unhealthy result with status code.
- A timeout produces an unhealthy result with a timeout category.
- A DNS failure produces an unhealthy result with a DNS category.
- A check failure is persisted and does not terminate the worker.

### 8.5 Check history and analytics

**Priority:** P0

Requirements:

- FR-HIST-01: Users can view check history for each monitor they own.
- FR-HIST-02: Each check result includes a timestamp, outcome, response time when available, status code when available, and safe error category.
- FR-HIST-03: Users can filter history by supported time range.
- FR-HIST-04: History endpoints use pagination or bounded result limits.
- FR-AN-01: The system calculates uptime for supported time windows.
- FR-AN-02: The system calculates average response time for a supported time window.
- FR-AN-03: The system displays response-time trends.
- FR-AN-04: The system displays incident history.
- FR-AN-05: Metric definitions and treatment of missing data are documented.

Metric definitions for the MVP:

- **Check success rate:** successful completed checks divided by all completed checks in the selected window.
- **Uptime percentage:** use the same explicitly documented calculation as the product's availability metric. The initial MVP may use check-based availability; it must not imply continuous measurement between checks.
- **Average response time:** arithmetic mean of recorded response times for successful checks in the selected window, unless a different definition is explicitly shown.
- **No data:** show “No data” or equivalent rather than displaying a misleading 100% uptime.

Acceptance criteria:

- Analytics are scoped to the authenticated user's monitor.
- The selected time window is applied consistently.
- Empty periods do not produce fabricated uptime.
- Dashboard values can be reconciled against stored check records.

### 8.6 Incident detection and lifecycle

**Priority:** P0

Requirements:

- FR-INC-01: The system evaluates check outcomes to determine monitor health.
- FR-INC-02: An incident is opened only after the configured consecutive-failure threshold is reached.
- FR-INC-03: The initial proposed threshold is two consecutive failed checks.
- FR-INC-04: At most one unresolved incident exists per monitor.
- FR-INC-05: An incident records start time and a reason/category.
- FR-INC-06: The monitor is marked down when an incident is opened.
- FR-INC-07: Recovery requires the configured successful-check confirmation policy.
- FR-INC-08: An incident is resolved once and records a resolution timestamp.
- FR-INC-09: Incident duration is calculated from start and resolution timestamps.
- FR-INC-10: Concurrent worker executions cannot create duplicate open incidents or resolve an incident multiple times.
- FR-INC-11: The system retains incident history according to the data-retention policy.

Initial proposed state model:

```text
UP
  └── failure threshold reached → DOWN (incident opened)

DOWN
  └── recovery confirmation reached → UP (incident resolved)
```

A monitor may have an intermediate internal state such as `PENDING` or `UNKNOWN` before sufficient checks exist. The UI must distinguish “not checked yet” from “up.”

Acceptance criteria:

- One failed check does not open an incident when the threshold is two.
- Two consecutive failed checks open one incident.
- Further failures during the same outage do not create additional open incidents.
- Confirmed recovery resolves the incident once.
- A later independent outage creates a new incident.

### 8.7 Email notifications

**Priority:** P0

Requirements:

- FR-NOT-01: The system queues an incident email when an incident is opened.
- FR-NOT-02: The system queues a recovery email when an incident is resolved.
- FR-NOT-03: Email delivery runs asynchronously.
- FR-NOT-04: Transient provider errors are retried with bounded backoff.
- FR-NOT-05: Notification events have deduplication keys or equivalent safeguards.
- FR-NOT-06: Notification attempts and outcomes are recorded.
- FR-NOT-07: Secrets and provider response details are not exposed to end users.
- FR-NOT-08: The email includes monitor name, URL, event type, and relevant incident time.
- FR-NOT-09: The system does not send an email for every failed check.

Acceptance criteria:

- Opening one incident creates one logical incident notification.
- Resolving one incident creates one logical recovery notification.
- A transient delivery error can be retried.
- Reprocessing the same notification event does not send duplicate messages where provider idempotency or application-level deduplication can prevent it.
- Delivery failure is visible to operators.

### 8.8 Public status pages

**Priority:** P0

Requirements:

- FR-SP-01: An authenticated user can create a status page.
- FR-SP-02: A status page has a title and unique public slug.
- FR-SP-03: The owner can add and remove their monitors from the page.
- FR-SP-04: The owner can publish or unpublish the page.
- FR-SP-05: An unauthenticated visitor can view a published page.
- FR-SP-06: An unpublished page is not publicly accessible.
- FR-SP-07: The public response contains only explicitly approved monitor and incident fields.
- FR-SP-08: Public pages show current monitor state and relevant incident information.
- FR-SP-09: Public pages do not reveal account email, internal IDs where unnecessary, credentials, private configuration, or internal error details.
- FR-SP-10: Slugs are validated and protected against collisions.

Acceptance criteria:

- A published status page can be viewed without authentication.
- An unpublished page cannot be viewed publicly.
- A user cannot add another user's monitor to their status page.
- Public API responses contain no private account or monitoring configuration data.

### 8.9 Dashboard and user experience

**Priority:** P0

Requirements:

- FR-UI-01: Authenticated users land on a dashboard.
- FR-UI-02: Dashboard lists the user's monitors.
- FR-UI-03: Each monitor shows a clear state: pending/unknown, up, or down.
- FR-UI-04: Dashboard shows useful summary metrics when data exists.
- FR-UI-05: Users can add, edit, activate, deactivate, and delete monitors.
- FR-UI-06: Monitor details show check history, response-time information, and incidents.
- FR-UI-07: Forms show validation errors.
- FR-UI-08: API failures show understandable error states.
- FR-UI-09: Pages include loading, empty, and error states.
- FR-UI-10: Core screens are usable on desktop and mobile viewport sizes.
- FR-UI-11: Status is communicated with text or icons as well as color.

Acceptance criteria:

- A first-time user can understand how to add a monitor.
- A user can identify a down monitor without relying on color alone.
- Slow or failed API responses do not leave the UI in an indefinite loading state.
- Destructive actions require confirmation where appropriate.

## 9. Information architecture and screens

### Public

- Landing page
- Sign up
- Login
- Public status page

### Authenticated

- Dashboard
- Monitors list
- Add monitor
- Edit monitor
- Monitor details
- Incident history (within monitor details or a dedicated view)
- Status pages list
- Create/edit status page
- Account settings (minimum account details and logout)

### Key screen content

**Dashboard**
- Total monitors
- Up/down/pending counts
- Monitor list
- Recent incidents
- Add monitor action

**Monitor details**
- Name and URL
- Current state
- Last checked time
- Uptime for selected windows
- Average response time
- Response-time chart
- Check history
- Incident history
- Edit/deactivate/delete actions

**Public status page**
- Page title and overall status
- Selected service list
- Current service states
- Active incidents
- Recent resolved incidents where appropriate
- Last updated time

## 10. Proposed API surface

Exact route naming may change during implementation, but the API should provide equivalent capabilities.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End session |
| GET | `/auth/me` | Get current user |

### Monitors

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/monitors` | Create monitor |
| GET | `/monitors` | List current user's monitors |
| GET | `/monitors/:id` | Get monitor details |
| PATCH | `/monitors/:id` | Update monitor |
| DELETE | `/monitors/:id` | Delete monitor |

### Monitor history and analytics

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/monitors/:id/checks` | Paginated check history |
| GET | `/monitors/:id/analytics` | Uptime and response-time metrics |
| GET | `/monitors/:id/incidents` | Incident history |

### Status pages

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/status-pages` | Create status page |
| GET | `/status-pages` | List owned status pages |
| PATCH | `/status-pages/:id` | Update status page |
| DELETE | `/status-pages/:id` | Delete status page |
| GET | `/public/status/:slug` | Get published public status page |

### System

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Basic API health |
| GET | `/ready` | Readiness check including required dependencies, if implemented |

All private endpoints must enforce authentication and resource ownership. Public endpoints must use a separate response schema that exposes only approved fields.

## 11. Data requirements

### Initial entities

| Entity | Important fields | Notes |
|---|---|---|
| User | id, name, normalized email, password hash, timestamps | Never expose password hash |
| Monitor | id, userId, name, URL, method, interval, timeout, active state, timestamps | User-owned |
| CheckResult | id, monitorId, status code, outcome, response time, error category, checkedAt | Append-oriented history |
| Incident | id, monitorId, state, reason, startedAt, resolvedAt | Enforce one open incident per monitor |
| NotificationLog | id, incidentId, event type, status, attempt count, timestamps | Supports delivery audit |
| StatusPage | id, userId, title, slug, published state, timestamps | Public slug unique |
| StatusPageMonitor | statusPageId, monitorId | Join table with ownership validation |

### Data integrity requirements

- Foreign keys must protect relationships.
- Indexes should support user monitor lists, monitor history by time, open incident lookups, and public slug lookups.
- Timestamps should be stored consistently in UTC.
- Incident state transitions must be transactional where needed.
- Unique constraints should support deduplication where practical.
- Historical check records should not be overwritten when a new check occurs.

### Retention

The MVP must define a retention policy before production launch. The initial policy may be conservative and configurable. Do not promise indefinite history until storage cost, deletion behavior, and retention jobs are implemented.

## 12. Non-functional requirements

### Reliability

- NFR-REL-01: A worker crash must not permanently disable monitoring schedules.
- NFR-REL-02: Job processing must be retryable and idempotent where required.
- NFR-REL-03: Database writes for incident transitions must preserve consistency.
- NFR-REL-04: Monitoring failures must be isolated per job.
- NFR-REL-05: The system must expose enough operational logs to diagnose missed checks and notification failures.

### Performance

Initial targets are engineering goals, not contractual SLAs:

- NFR-PERF-01: Normal dashboard API requests should generally complete within 500 ms at low MVP traffic, excluding external dependencies.
- NFR-PERF-02: Check execution must obey the configured timeout.
- NFR-PERF-03: History and analytics endpoints must use bounded queries and pagination.
- NFR-PERF-04: Worker concurrency and queue growth must be configurable and observable.
- NFR-PERF-05: Large response bodies must not be buffered without a strict limit.

### Security and privacy

- NFR-SEC-01: All production traffic uses HTTPS.
- NFR-SEC-02: Passwords are securely hashed.
- NFR-SEC-03: Private resources enforce user ownership.
- NFR-SEC-04: User-provided URLs are protected against SSRF, DNS rebinding, redirect bypass, and access to internal networks.
- NFR-SEC-05: Secrets are stored in environment/secret management, not source control.
- NFR-SEC-06: Sensitive values are redacted from logs.
- NFR-SEC-07: Rate limits protect authentication and resource-intensive endpoints.
- NFR-SEC-08: Public status responses expose only approved data.
- NFR-SEC-09: Data deletion and retention behavior is documented.

### Usability and accessibility

- NFR-UX-01: Core workflows work on modern desktop and mobile browsers.
- NFR-UX-02: Forms provide clear validation feedback.
- NFR-UX-03: Loading, empty, success, and error states are present.
- NFR-UX-04: Status is not communicated through color alone.
- NFR-UX-05: Keyboard navigation and semantic labels are supported on core forms and controls.

### Maintainability

- NFR-MNT-01: Frontend, API, and worker responsibilities remain clearly separated.
- NFR-MNT-02: Shared types and validation schemas are reused where appropriate.
- NFR-MNT-03: Business logic is not embedded entirely in route handlers.
- NFR-MNT-04: Database changes are managed through migrations.
- NFR-MNT-05: Setup and operational steps are documented.

## 13. Security and abuse threat model

The most important product-specific risk is that PulseWatch makes outbound requests to URLs supplied by users.

### Threats

- A malicious user submits `localhost`, private IPs, or internal hostnames.
- DNS resolves a public hostname to a private address.
- DNS answers change between validation and connection (DNS rebinding).
- A public URL redirects to a private or metadata address.
- A very large response consumes worker memory or bandwidth.
- A slow endpoint ties up worker concurrency.
- A user creates excessive monitors or extremely frequent checks.
- One user accesses another user's monitor or history.
- Public status pages accidentally expose private configuration.

### Required mitigations before public launch

- Strict URL scheme and hostname validation.
- Resolve DNS and validate all returned IPv4 and IPv6 addresses.
- Block loopback, private, link-local, multicast, reserved, and metadata ranges as appropriate.
- Pin or otherwise guarantee the connection destination is the validated address to mitigate rebinding.
- Disable redirects initially, or validate every redirect hop before following it.
- Enforce connection, total request, and response-size limits.
- Apply per-account monitor limits and minimum intervals.
- Apply rate limits to account and monitor creation endpoints.
- Enforce ownership checks at the service/data-access layer.
- Use a strict public status response allowlist.
- Log safe error categories rather than secrets or internal network details.

**Release blocker:** Do not expose arbitrary URL monitoring to untrusted public users until SSRF protections have been implemented and tested. A simple URL parser or string blocklist is not sufficient.

## 14. Monitoring PulseWatch itself

A monitoring product must also monitor its own operation.

Minimum operational signals:

- API health and readiness.
- Database connectivity.
- Redis connectivity.
- Worker heartbeat or last-seen timestamp.
- Queue waiting, active, delayed, and failed job counts.
- Age of the oldest overdue monitor check.
- Check execution duration and failure categories.
- Notification queue failures and delivery outcomes.
- Unexpected growth in queue depth or database storage.

Operators should be able to answer:

- Are checks being scheduled?
- Are workers processing them?
- Are results being persisted?
- Are incidents being evaluated?
- Are emails being delivered?
- Which dependency is failing?

## 15. Analytics and product success metrics

The MVP should measure product usefulness and system correctness without collecting unnecessary personal data.

### Activation

- Percentage of registered users who create their first monitor.
- Time from registration to first monitor creation.
- Percentage of monitors that complete a first check.

### Engagement

- Weekly active users.
- Active monitors per user.
- Percentage of users returning to review monitor history.
- Number of published status pages.

### Reliability

- Percentage of scheduled checks completed within scheduling tolerance.
- Worker job failure rate.
- Check execution error rate by category.
- Incident detection delay after threshold is reached.
- Notification enqueue-to-delivery time.
- Duplicate incident and duplicate notification rate.
- API error rate and latency.

### Initial learning goals

For the first 3–5 users, prioritize qualitative feedback:

- Did setup make sense?
- Did the first check happen as expected?
- Was the down notification timely and understandable?
- Did the user trust the uptime numbers?
- What was confusing or missing?
- Would the user keep monitoring a real service with PulseWatch?

Do not optimize for vanity metrics before monitoring correctness and user trust.

## 16. MVP acceptance test plan

The MVP is not accepted until these scenarios pass in a production-like environment.

| ID | Scenario | Expected result |
|---|---|---|
| AT-01 | Register with valid details | Account is created and user can authenticate |
| AT-02 | Register with duplicate email | Request is rejected safely |
| AT-03 | Access private endpoint unauthenticated | Request is rejected |
| AT-04 | Create valid monitor | Monitor is stored and appears in dashboard |
| AT-05 | Create monitor with unsupported scheme | Request is rejected |
| AT-06 | Attempt to access another user's monitor | Access is denied |
| AT-07 | Healthy endpoint check | Successful result and response time are stored |
| AT-08 | Endpoint returns HTTP 500 | Unhealthy result and status code are stored |
| AT-09 | Endpoint times out | Failure is recorded and worker continues |
| AT-10 | Two consecutive failures | One incident is opened |
| AT-11 | Additional failures during open incident | No duplicate open incident |
| AT-12 | Confirmed recovery | Incident is resolved once |
| AT-13 | Incident opens | One logical incident email is queued and delivered |
| AT-14 | Incident resolves | One logical recovery email is queued and delivered |
| AT-15 | Worker restarts | Recurring monitoring resumes |
| AT-16 | Monitor is deactivated | No new check is executed after schedule/state handling |
| AT-17 | Publish status page | Public visitor can see approved service status |
| AT-18 | Request unpublished status page | Public access is denied |
| AT-19 | Submit private IP or metadata URL | Monitoring request is blocked |
| AT-20 | Submit redirect to private destination | Redirect is blocked or safely rejected |
| AT-21 | Empty monitor history | UI displays no-data state, not fabricated uptime |
| AT-22 | Large history request | Response is bounded/paginated |

## 17. Risks, assumptions, and open decisions

### Risks

| Risk | Impact | Mitigation |
|---|---|---|
| SSRF vulnerability | Critical security exposure | Treat URL egress controls as a launch blocker |
| Worker downtime | Missed monitoring checks | Worker heartbeat, restart policy, queue observability |
| Duplicate jobs | Duplicate checks, incidents, or emails | Idempotency, stable job IDs, database constraints |
| False positives | Users lose trust | Consecutive failure and recovery confirmation rules |
| Email provider failure | Users miss alerts | Retry, delivery logs, operational alerting |
| High check volume | Queue and infrastructure costs | Monitor limits, minimum intervals, concurrency controls |
| Misleading uptime metric | Users make incorrect decisions | Clear calculation definitions and no-data state |
| Data growth | Higher database cost and slower queries | Retention policy, indexes, bounded queries |

### Assumptions for MVP planning

- The first release monitors public HTTP/HTTPS GET endpoints.
- Each monitor belongs to one user.
- Monitoring uses one execution region initially.
- Email is the only notification channel.
- Users choose from a bounded set of supported intervals.
- The first release targets low traffic and a small number of early adopters.
- A public status page is optional for each user.

### Decisions to finalize before implementation or launch

- Exact supported monitoring intervals and minimum interval.
- Exact timeout limits.
- Exact HTTP status classification policy.
- Whether redirects are disabled in the first release.
- Exact consecutive failure and recovery thresholds.
- Uptime calculation and missing-check treatment.
- Monitor and account limits for the free MVP.
- Check-result and incident retention periods.
- Authentication/session implementation details.
- Email provider and sender-domain setup.
- Hosting provider and production topology.
- Data deletion behavior when a monitor or account is deleted.

Record decisions in an architecture decision log rather than allowing undocumented behavior to emerge from implementation.

## 18. Suggested implementation phases

### Phase 1 — Foundation

- [ ] Repository and workspace setup
- [ ] PostgreSQL and Redis local infrastructure
- [ ] Prisma schema and migrations
- [ ] Express API foundation
- [ ] Authentication and session handling

### Phase 2 — Monitor management

- [ ] Monitor CRUD endpoints
- [ ] Ownership and validation
- [ ] Dashboard and monitor forms
- [ ] Monitor detail page

### Phase 3 — Monitoring engine

- [ ] BullMQ setup
- [ ] Recurring scheduler
- [ ] Worker lifecycle
- [ ] HTTP check execution
- [ ] Result persistence
- [ ] SSRF and egress protections

### Phase 4 — Reliability workflow

- [ ] Incident state machine
- [ ] Recovery logic
- [ ] Uptime and response-time analytics
- [ ] Email notification queue and worker
- [ ] Public status pages

### Phase 5 — Release readiness

- [ ] Unit, integration, and end-to-end tests
- [ ] Security review
- [ ] Logs and operational metrics
- [ ] Production deployment
- [ ] Smoke tests
- [ ] Early-user feedback and fixes

## 19. Definition of done

A feature is complete only when:

- [ ] The intended user behavior is implemented.
- [ ] Input validation and authorization are enforced.
- [ ] Loading, empty, success, and error states are handled where relevant.
- [ ] Important failure cases are tested.
- [ ] Logs are useful and do not expose secrets.
- [ ] Database changes are migrated.
- [ ] Documentation is updated.
- [ ] The feature works in the integrated application.
- [ ] The implementation does not bypass the product's security requirements.

The MVP is ready for an initial limited release when all P0 requirements and acceptance tests pass, critical security issues are resolved, and operators can observe the health of the API, queue, worker, database, and notification flow.

## 20. Product positioning

### One-line description

**PulseWatch helps developers know when their websites and APIs go down, understand their uptime, and get notified when service is restored.**

### Short description

Monitor websites and HTTP APIs in the background. Track uptime and response times, detect incidents, receive email alerts, and share a public status page.

### What PulseWatch is not

PulseWatch is not a full observability suite, an APM platform, or a guarantee that an application is functioning correctly from every user's location. In the MVP, it checks endpoint reachability and response behavior from a single monitoring region. A successful HTTP check does not prove that every application feature or user journey is working.

---

## Appendix A — Glossary

| Term | Meaning |
|---|---|
| Monitor | A configured endpoint that PulseWatch checks |
| Check | One execution of an HTTP request against a monitor |
| Check result | The stored outcome and measurements from one check |
| Interval | Time between scheduled checks |
| Timeout | Maximum allowed duration for a check request |
| Uptime | Availability estimate calculated from recorded checks |
| Incident | A period in which a monitor is considered unhealthy |
| Recovery | Transition from an incident state back to healthy |
| Worker | Background process that executes jobs |
| Queue | Infrastructure that stores and distributes background jobs |
| Idempotency | Property that makes repeated processing safe |
| SSRF | Server-Side Request Forgery; abuse of a server to make requests to unintended destinations |

## Appendix B — Core product promise

PulseWatch should answer four questions clearly:

1. **Is my endpoint responding?**
2. **How has it performed over time?**
3. **When did an outage happen, and has it recovered?**
4. **Will I be notified when something important happens?**

If the MVP answers these questions accurately and reliably, it has delivered its core value.
