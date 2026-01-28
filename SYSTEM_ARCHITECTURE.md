# Urban Clone - System Architecture & Design Document

## 1. High-Level Architecture

The system follows a **Microservices Architecture** to ensure scalability for millions of users across multiple cities.

### Core Services:
1.  **API Gateway (Kong/Nginx)**: Handles rate limiting, auth routing, and load balancing.
2.  **Auth Service**: Manages User/Partner Identity, OTP (Twilio), OAuth, and JWT issuance.
3.  **Catalog Service**: Manages Cities, Categories, Services, Pricing, and Tax rules. (Read-heavy, cached via Redis).
4.  **Booking Service**: core state machine for Job lifecycles (Created -> Scheduled -> Assigned -> Started -> Completed). Handles locking slots (Redis Distributed Locks).
5.  **Matching Engine (Geo-Spatial)**: Assigns partners based on Location (PostGIS), Skill, Rating, and Availability.
6.  **Partner Service**: Manages Partner profiles, KYC, Training, and Inventory.
7.  **Payment Service**: Wraps Payment Gateways (Stripe/Razorpay), handles Split Payments (Commission vs Partner Payout), and Wallets.
8.  **Notification Service**: Async event bus (Kafka/RabbitMQ) for Push/SMS/Email.

---

## 2. Database Schema (PostgreSQL)

### `users`
| Field | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | |
| phone | VARCHAR | UNIQUE | |
| email | VARCHAR | UNIQUE | |
| current_city_id | UUID | FK | Default context |
| wallet_balance | DECIMAL | | |

### `partners`
| Field | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | |
| user_id | UUID | FK | Link to auth user |
| status | ENUM | | ONBOARDING, ACTIVE, SUSPENDED |
| current_lat | FLOAT | | Real-time location |
| current_long | FLOAT | | Real-time location |
| rating | FLOAT | | 4.8 default |
| tier | ENUM | | SILVER, GOLD, PLATINUM |

### `services`
| Field | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | |
| category_id | UUID | FK | e.g., Cleaning, Salon |
| base_price | DECIMAL | | |
| gst_rate | DECIMAL | | e.g., 18.0 |
| duration_min | INT | | Estimated time |

### `bookings`
| Field | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | |
| customer_id | UUID | FK | |
| partner_id | UUID | FK | Nullable (until assigned) |
| status | ENUM | | REQUESTED, ASSIGNED, STARTED, COMPLETED, CANCELLED |
| scheduled_time | TIMESTAMP | | |
| total_amount | DECIMAL | | |
| otp_start | VARCHAR | | 4-digit start code |
| otp_end | VARCHAR | | 4-digit end code |

---

## 3. API Specification

### Customer APIs
*   `POST /auth/otp/send`: Trigger login.
*   `GET /catalog/categories?city_id={id}`: Get services.
*   `POST /bookings`: Create a job request.
    *   *Payload*: `{ service_ids: [], slot_time: ISO, address_id: UUID }`
*   `GET /bookings/{id}/track`: Long-poll/Socket for status.

### Partner APIs
*   `GET /partner/jobs/nearby`: Get available leads.
*   `POST /partner/jobs/{id}/accept`: Lock a job.
*   `POST /partner/jobs/{id}/status`: Update (En Route, Arrived, etc).

---

## 4. Operational Flows & Edge Cases

### Booking Flow
1.  **Slot Locking**: When user selects a time, a 10-min Redis lock is placed.
2.  **Surge Pricing**: If `demand > supply * threshold` in a geohash, apply `1.2x` multiplier.

### Assignment Logic (The "Batched Dispatch")
1.  **Instant**: Notification sent to Top 5 partners within 5km. First to accept wins.
2.  **Scheduled**: Batch processing every 30 mins to optimize route efficiency for partners.

### Edge Cases Handled
1.  **Partner No-Show**: Auto-reassign after T-30 mins. Trigger escalation to Ops Admin.
2.  **Payment Failure**: Do not cancel immediately. Allow "Pay at Completion" fallback if user credit score > threshold.
3.  **Location Mismatch**: Alert if Partner marks "Arrived" but GPS is > 500m from User Address.
