# TicketRush API Documentation

> Source of truth for FE developers. Update this file whenever any API route, request payload, response shape, validation rule, auth rule, or business behavior changes.

## 1. API conventions

### Base URL

```txt
/api
```

### Headers

For public APIs:

```txt
Accept: application/json
Content-Type: application/json
```

For authenticated APIs:

```txt
Authorization: Bearer <token>
Accept: application/json
Content-Type: application/json
```

### Standard success response

```json
{
  "success": true,
  "message": "Request processed successfully.",
  "data": {}
}
```

### Standard error response

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {}
}
```

### Auth method

- API authentication uses Laravel Sanctum Bearer token.
- Login and email verification return token.
- FE must store token securely and send it in `Authorization` header.

### Roles

| Role | Description |
|---|---|
| `admin` | System administrator. Can manage/approve events. |
| `organizer` | Event organizer. Can create and manage own events. |
| `customer` | Event customer. Can browse events, book seats, and manage tickets. |

## 2. Auth APIs

### 2.1 Customer register

```txt
POST /api/auth/register/customer
```

Auth: Public

Request body:

```json
{
  "name": "Nguyen Van A",
  "email": "customer@example.com",
  "password": "password",
  "password_confirmation": "password",
  "gender": "male",
  "birthday": "2000-01-01"
}
```

Validation:

| Field | Required | Rule |
|---|---:|---|
| `name` | Yes | string, max 255 |
| `email` | Yes | valid email, unique in users |
| `password` | Yes | string, min 6, confirmed |
| `password_confirmation` | Yes | must match password |
| `gender` | No | `male`, `female`, `other` |
| `birthday` | No | date, before today |

Behavior:

- Creates user with `role = customer`.
- Sends 6-digit verification code to email.
- Account cannot login until email is verified.

Success response `201`:

```json
{
  "success": true,
  "message": "Registration successful. Please check your email for the verification code.",
  "data": {
    "user_id": 1,
    "email": "customer@example.com"
  }
}
```

### 2.2 Organizer register

```txt
POST /api/auth/register/organizer
```

Auth: Public

Request body:

```json
{
  "name": "Tran Van B",
  "email": "organizer@example.com",
  "password": "password",
  "password_confirmation": "password",
  "organizer_name": "ABC Event Company",
  "tax_code": "0123456789"
}
```

Validation:

| Field | Required | Rule |
|---|---:|---|
| `name` | Yes | string, max 255 |
| `email` | Yes | valid email, unique in users |
| `password` | Yes | string, min 6, confirmed |
| `password_confirmation` | Yes | must match password |
| `organizer_name` | Yes | string, max 255 |
| `tax_code` | Yes | string, max 50, unique in users |

Behavior:

- Creates user with `role = organizer`.
- Sends 6-digit verification code to email.
- Account cannot login until email is verified.

Success response `201`:

```json
{
  "success": true,
  "message": "Registration successful. Please check your email for the verification code.",
  "data": {
    "user_id": 2,
    "email": "organizer@example.com"
  }
}
```

### 2.3 Verify email

```txt
POST /api/auth/verify
```

Auth: Public

Request body:

```json
{
  "email": "customer@example.com",
  "code": "123456"
}
```

Validation:

| Field | Required | Rule |
|---|---:|---|
| `email` | Yes | valid email, exists in users |
| `code` | Yes | string, exactly 6 characters |

Behavior:

- Verifies the registration code.
- Sets `email_verified_at`.
- Deletes used verification code.
- Returns Sanctum token.

Success response:

```json
{
  "success": true,
  "message": "Email verified successfully.",
  "data": {
    "token": "1|plain-text-token",
    "user": {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

Error response `422`:

```json
{
  "success": false,
  "message": "Invalid or expired verification code."
}
```

### 2.4 Resend verification code

```txt
POST /api/auth/resend-code
```

Auth: Public

Request body:

```json
{
  "email": "customer@example.com"
}
```

Behavior:

- Deletes old registration verification codes for the email.
- Sends a new 6-digit verification code.
- Code expires after 15 minutes.

Success response:

```json
{
  "success": true,
  "message": "A new verification code has been sent to your email."
}
```

### 2.5 Login

```txt
POST /api/auth/login
```

Auth: Public

Request body:

```json
{
  "email": "customer@example.com",
  "password": "password"
}
```

Validation:

| Field | Required | Rule |
|---|---:|---|
| `email` | Yes | valid email |
| `password` | Yes | string |

Behavior:

- Checks email and password.
- Blocks login if email is not verified.
- If email is unverified, sends a new verification code.
- Returns Sanctum token if successful.

Success response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "1|plain-text-token",
    "user": {
      "id": 1,
      "name": "Nguyen Van A",
      "email": "customer@example.com",
      "role": "customer"
    }
  }
}
```

Invalid credentials `401`:

```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

Unverified email `403`:

```json
{
  "success": false,
  "message": "Email not verified. A new verification code has been sent to your email."
}
```

### 2.6 Get current user

```txt
GET /api/auth/me
```

Auth: Bearer token required

Success response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Nguyen Van A",
    "email": "customer@example.com",
    "role": "customer",
    "gender": "male",
    "birthday": "2000-01-01",
    "organizer_name": null,
    "tax_code": null,
    "email_verified_at": "2026-05-11T02:00:00.000000Z"
  }
}
```

### 2.7 Logout

```txt
POST /api/auth/logout
```

Auth: Bearer token required

Behavior:

- Revokes current Sanctum token.

Success response:

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

## 3. Demo seed data

Run all default demo seeders:

```powershell
php artisan db:seed
```

Or run only demo data:

```powershell
php artisan db:seed --class=DemoDataSeeder
```

All demo accounts use password:

```txt
password
```

### 3.1 Demo accounts

| Role | Email | Password | Notes |
|---|---|---|---|
| `admin` | `admin@ticketrush.com` | `password` | Default system admin. |
| `organizer` | `organizer.music@ticketrush.com` | `password` | Organizer for music, DJ, theater, conference events. |
| `organizer` | `organizer.sport@ticketrush.com` | `password` | Organizer for sport, workshop, comedy events. |
| `customer` | `customer@ticketrush.com` | `password` | Verified customer account. |
| `customer` | `customer2@ticketrush.com` | `password` | Verified customer account. |

### 3.2 Demo events

The demo seeder creates approved, pending, and rejected events for API testing.

| Event | Category | Status | Featured |
|---|---|---|---|
| Neon Nights Festival 2024 | `dj` | `approved` | Yes |
| Chung Kết Cúp Bóng Đá Vô Địch Quốc Gia | `sport` | `approved` | Yes |
| The Midnight Sounds - Asia Tour 2024 | `music` | `approved` | No |
| Tech Summit Vietnam: AI & Tương lai | `conference` | `approved` | No |
| Ravetopia 2024: Đêm Giao Thừa | `dj` | `approved` | No |
| Vở Nhạc Kịch: Tiếng Gọi Nơi Hoang Dã | `theater` | `approved` | No |
| Workshop Sáng tạo Nội dung 2024 | `workshop` | `pending` | No |
| Comedy Night: Cười Xuyên Đêm | `comedy` | `rejected` | No |

Each demo event includes:

- Two seating zones: `VIP`, `Standard`.
- One non-seating walkway zone: `Lối đi trung tâm`.
- Generated seats with sample statuses: `available`, `locked`, `sold`.

### 3.3 Admin account

```txt
email: admin@ticketrush.com
password: password
```

Admin-only seed command:

```powershell
php artisan db:seed --class=AdminSeeder
```

## 4. Role middleware test APIs

All endpoints require Bearer token.

### 4.1 Admin ping

```txt
GET /api/admin/ping
```

Role: `admin`

Success:

```json
{
  "success": true,
  "message": "Admin access granted."
}
```

### 4.2 Organizer ping

```txt
GET /api/organizer/ping
```

Role: `organizer`

Success:

```json
{
  "success": true,
  "message": "Organizer access granted."
}
```

### 4.3 Customer ping

```txt
GET /api/customer/ping
```

Role: `customer`

Success:

```json
{
  "success": true,
  "message": "Customer access granted."
}
```

Forbidden response `403`:

```json
{
  "success": false,
  "message": "Forbidden. You do not have permission to access this resource."
}
```

## 5. Event categories

Backend stores and returns only the category `key`.

Current multilingual policy:

- TicketRush does not support multilingual event content yet.
- Event fields such as `name`, `description`, and `venue` are currently single-language text.
- Category labels below are Vietnamese display suggestions for FE.
- If multilingual support is needed later, update this documentation and API design first.

### 5.1 Supported category keys

| Key | Vietnamese label suggestion | Suggested icon |
|---|---|---|
| `music` | Nhạc sống | `music` |
| `dj` | DJ / EDM | `disc` |
| `theater` | Sân khấu & Nghệ thuật | `theater` |
| `sport` | Thể thao | `trophy` |
| `workshop` | Hội thảo & Workshop | `users` |
| `conference` | Hội nghị | `presentation` |
| `comedy` | Hài kịch | `smile` |
| `family` | Gia đình | `heart` |
| `other` | Khác | `ticket` |

### 5.2 FE TypeScript const suggestion

```ts
export const EVENT_CATEGORY_KEYS = [
  'music',
  'dj',
  'theater',
  'sport',
  'workshop',
  'conference',
  'comedy',
  'family',
  'other',
] as const;

export type EventCategoryKey = (typeof EVENT_CATEGORY_KEYS)[number];

export const EVENT_CATEGORIES: Array<{
  key: EventCategoryKey;
  label: string;
  icon: string;
}> = [
  { key: 'music', label: 'Nhạc sống', icon: 'music' },
  { key: 'dj', label: 'DJ / EDM', icon: 'disc' },
  { key: 'theater', label: 'Sân khấu & Nghệ thuật', icon: 'theater' },
  { key: 'sport', label: 'Thể thao', icon: 'trophy' },
  { key: 'workshop', label: 'Hội thảo & Workshop', icon: 'users' },
  { key: 'conference', label: 'Hội nghị', icon: 'presentation' },
  { key: 'comedy', label: 'Hài kịch', icon: 'smile' },
  { key: 'family', label: 'Gia đình', icon: 'heart' },
  { key: 'other', label: 'Khác', icon: 'ticket' },
];
```

### 5.3 API category behavior

- Event create/update accepts only supported category keys.
- Public event APIs return the category key in `category`.
- FE should map `category` to a display label from its local constants.
- Do not expect category labels from backend event objects.

## 6. Public Event APIs

Public event APIs can be used by both anonymous users and logged-in customers.

Only events with `status = approved` are returned.

### 6.1 Homepage data

```txt
GET /api/events/homepage
```

Auth: Public

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `category` | No | Filter by category key, e.g. `music`, `dj`, `sport` |

Example:

```txt
GET /api/events/homepage?category=music
```

Success response:

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "key": "music",
        "name": "Nhạc sống",
        "icon": "music"
      }
    ],
    "featured_events": [
      {
        "id": 1,
        "name": "Neon Nights Festival 2024",
        "description": "Đêm nhạc điện tử bùng nổ với dàn line-up quốc tế.",
        "category": "dj",
        "thumbnail_url": "https://example.com/neon-thumb.jpg",
        "banner_url": "https://example.com/neon-banner.jpg",
        "venue": "Nhà thi đấu Phú Thọ",
        "starts_at": "2024-11-15T20:00:00+07:00",
        "display_type": "stadium",
        "is_featured": true,
        "organizer": {
          "id": 2,
          "name": "Tran Van B",
          "organizer_name": "ABC Event Company"
        }
      }
    ],
    "special_events": []
  }
}
```

FE usage suggestion:

- `categories`: render category tabs in homepage nav.
- `featured_events`: render large hero/event cards.
- `special_events`: render event card grid under “Sự kiện đặc biệt”.

### 6.2 Event list

```txt
GET /api/events
```

Auth: Public

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `category` | No | Filter by category key |
| `q` | No | Search keyword across name, description, venue |
| `per_page` | No | Page size, default 12 |

Example:

```txt
GET /api/events?category=music&q=festival&per_page=12
```

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Neon Nights Festival 2024",
      "description": "Đêm nhạc điện tử bùng nổ với dàn line-up quốc tế.",
      "category": "dj",
      "thumbnail_url": "https://example.com/neon-thumb.jpg",
      "banner_url": "https://example.com/neon-banner.jpg",
      "venue": "Nhà thi đấu Phú Thọ",
      "starts_at": "2024-11-15T20:00:00+07:00",
      "display_type": "stadium",
      "is_featured": true,
      "organizer": {
        "id": 2,
        "name": "Tran Van B",
        "organizer_name": "ABC Event Company"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 1
  }
}
```

### 6.3 Event detail

```txt
GET /api/events/{event}
```

Auth: Public

Behavior:

- Returns event only if `status = approved`.
- Returns `404` if event is not approved.

Success response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Neon Nights Festival 2024",
    "description": "Đêm nhạc điện tử bùng nổ với dàn line-up quốc tế.",
    "category": "dj",
    "thumbnail_url": "https://example.com/neon-thumb.jpg",
    "banner_url": "https://example.com/neon-banner.jpg",
    "venue": "Nhà thi đấu Phú Thọ",
    "starts_at": "2024-11-15T20:00:00+07:00",
    "display_type": "stadium",
    "is_featured": true,
    "organizer": {
      "id": 2,
      "name": "Tran Van B",
      "organizer_name": "ABC Event Company"
    }
  }
}
```

## 7. Organizer Event APIs

Organizer event APIs require Bearer token and role `organizer`.

### 7.1 List organizer events

```txt
GET /api/organizer/events
```

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `status` | No | Filter by `pending`, `approved`, `rejected` |
| `category` | No | Filter by category key |
| `per_page` | No | Page size, default 12 |

Example:

```txt
GET /api/organizer/events?status=pending&category=dj&per_page=12
```

Response:

```json
{
  "data": [
    {
      "id": 1,
      "organizer_id": 2,
      "name": "Neon Nights Festival 2024",
      "description": "Đêm nhạc điện tử bùng nổ với dàn line-up quốc tế.",
      "category": "dj",
      "thumbnail_url": "https://example.com/neon-thumb.jpg",
      "banner_url": "https://example.com/neon-banner.jpg",
      "is_featured": true,
      "sort_order": 1,
      "venue": "Nhà thi đấu Phú Thọ",
      "starts_at": "2024-11-15T20:00:00+07:00",
      "ends_at": "2024-11-15T23:00:00+07:00",
      "status": "pending",
      "display_type": "stadium",
      "master_width": 80,
      "master_length": 60
    }
  ]
}
```

### 7.2 Create organizer event

```txt
POST /api/organizer/events
```

Request body:

```json
{
  "name": "Neon Nights Festival 2024",
  "description": "Đêm nhạc điện tử bùng nổ với dàn line-up quốc tế.",
  "category": "dj",
  "thumbnail_url": "https://example.com/neon-thumb.jpg",
  "banner_url": "https://example.com/neon-banner.jpg",
  "is_featured": true,
  "sort_order": 1,
  "venue": "Nhà thi đấu Phú Thọ",
  "starts_at": "2024-11-15 20:00:00",
  "ends_at": "2024-11-15 23:00:00",
  "display_type": "stadium",
  "master_width": 80,
  "master_length": 60
}
```

Validation:

| Field | Required | Rule |
|---|---:|---|
| `name` | Yes | string, max 255 |
| `description` | No | string |
| `category` | Yes | one of supported category keys |
| `thumbnail_url` | No | string, max 2048 |
| `banner_url` | No | string, max 2048 |
| `is_featured` | No | boolean |
| `sort_order` | No | integer, min 0 |
| `venue` | No | string, max 255 |
| `starts_at` | No | date |
| `ends_at` | No | date, after_or_equal starts_at |
| `display_type` | Yes | `rectangular`, `arc`, `stadium` |
| `master_width` | Yes | integer, min 1, max 1000 |
| `master_length` | Yes | integer, min 1, max 1000 |

Behavior:

- `organizer_id` is taken from authenticated user.
- `status` is automatically set to `pending`.
- Admin approval is required before the event appears publicly.

Success response `201`:

```json
{
  "success": true,
  "message": "Event created successfully and is waiting for admin approval.",
  "data": {
    "id": 1,
    "organizer_id": 2,
    "name": "Neon Nights Festival 2024",
    "status": "pending",
    "category": "dj"
  }
}
```

### 7.3 Show organizer event

```txt
GET /api/organizer/events/{event}
```

Behavior:

- Organizer can only view events owned by themselves.
- Returns `403` if accessing another organizer's event.

### 7.4 Update organizer event

```txt
PUT /api/organizer/events/{event}
PATCH /api/organizer/events/{event}
```

Request body can be partial:

```json
{
  "name": "Neon Nights Festival 2024 - Updated",
  "category": "music",
  "is_featured": true,
  "sort_order": 2
}
```

Behavior:

- Organizer can only update events owned by themselves.
- After update, `status` is reset to `pending` for admin review again.

### 7.5 Delete organizer event

```txt
DELETE /api/organizer/events/{event}
```

Behavior:

- Organizer can only delete events owned by themselves.

Success response:

```json
{
  "success": true,
  "message": "Event deleted successfully."
}
```

## 8. Customer Order & Ticket APIs

Auth: Bearer token required. Role: `customer`.

These APIs allow customers to view their own paid orders and issued tickets.

### 8.1 List customer orders

```txt
GET /api/customer/orders
```

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `per_page` | No | Page size, default 12 |

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_code": "ORD-202411150001",
      "event": {
        "id": 1,
        "name": "Neon Nights Festival 2024",
        "thumbnail_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        "starts_at": "2024-11-15T20:00:00+07:00",
        "venue": "Nhà thi đấu Phú Thọ, TP.HCM"
      },
      "subtotal_amount": "3000000.00",
      "total_amount": "3150000.00",
      "currency": "VND",
      "status": "paid",
      "payment_method": "mock",
      "paid_at": "2024-11-10T10:30:00+07:00",
      "expires_at": null,
      "ticket_count": 2,
      "created_at": "2024-11-10T10:25:00+07:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 1
  }
}
```

### 8.2 Show customer order

```txt
GET /api/customer/orders/{order}
```

Behavior:

- Customer can only view orders placed by themselves.
- Returns `403` if accessing another customer's order.

Success response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "order_code": "ORD-202411150001",
    "event": {
      "id": 1,
      "name": "Neon Nights Festival 2024",
      "thumbnail_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
      "starts_at": "2024-11-15T20:00:00+07:00",
      "venue": "Nhà thi đấu Phú Thọ, TP.HCM"
    },
    "subtotal_amount": "3000000.00",
    "total_amount": "3150000.00",
    "currency": "VND",
    "status": "paid",
    "payment_method": "mock",
    "payment_reference": "MOCK-REF-123456",
    "paid_at": "2024-11-10T10:30:00+07:00",
    "expires_at": null,
    "created_at": "2024-11-10T10:25:00+07:00",
    "tickets": [
      {
        "id": 1,
        "ticket_code": "TICK-202411150001",
        "qr_code": "QR-202411150001",
        "status": "valid",
        "issued_at": "2024-11-10T10:30:00+07:00",
        "checked_in_at": null
      }
    ]
  }
}
```

### 8.3 List customer tickets

```txt
GET /api/customer/tickets
```

Query parameters:

| Name | Required | Description |
|---|---:|---|
| `per_page` | No | Page size, default 12 |

Success response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "ticket_code": "TICK-202411150001",
      "qr_code": "QR-202411150001",
      "status": "valid",
      "issued_at": "2024-11-10T10:30:00+07:00",
      "checked_in_at": null,
      "event": {
        "id": 1,
        "name": "Neon Nights Festival 2024",
        "thumbnail_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
        "starts_at": "2024-11-15T20:00:00+07:00",
        "venue": "Nhà thi đấu Phú Thọ, TP.HCM"
      },
      "seat": {
        "id": 1,
        "row_index": 1,
        "col_index": 1,
        "zone": {
          "id": 1,
          "name": "VIP",
          "price": "1500000.00"
        }
      },
      "order": {
        "id": 1,
        "order_code": "ORD-202411150001",
        "total_amount": "3150000.00"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 12,
    "total": 1
  }
}
```

### 8.4 Show customer ticket

```txt
GET /api/customer/tickets/{ticket}
```

Behavior:

- Customer can only view tickets issued to themselves.
- Returns `403` if accessing another customer's ticket.

Success response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "ticket_code": "TICK-202411150001",
    "qr_code": "QR-202411150001",
    "status": "valid",
    "issued_at": "2024-11-10T10:30:00+07:00",
    "checked_in_at": null,
    "event": {
      "id": 1,
      "name": "Neon Nights Festival 2024",
      "thumbnail_url": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
      "starts_at": "2024-11-15T20:00:00+07:00",
      "venue": "Nhà thi đấu Phú Thọ, TP.HCM"
    },
    "seat": {
      "id": 1,
      "row_index": 1,
      "col_index": 1,
      "zone": {
        "id": 1,
        "name": "VIP",
        "price": "1500000.00"
      }
    },
    "order": {
      "id": 1,
      "order_code": "ORD-202411150001",
      "total_amount": "3150000.00"
    },
    "created_at": "2024-11-10T10:30:00+07:00"
  }
}
```

## 9. Current migration requirements

Before manual testing, run:

```powershell
php artisan migrate
php artisan db:seed --class=AdminSeeder
```

## 10. Mail configuration

For real email delivery, configure SMTP in `.env`.

For local development, use log mailer:

```env
MAIL_MAILER=log
```

Then read verification codes in:

```txt
storage/logs/laravel.log
```

## 10. Documentation update rule

This file is the API source of truth for frontend integration.

Whenever backend changes affect API behavior, update this file in the same task, including:

- New routes.
- Removed routes.
- Changed request body.
- Changed response fields.
- Changed validation rules.
- Changed auth or role requirements.
- Changed status code or error message behavior.
- Changed enum/category/status values.
- Changed pagination or query parameters.
