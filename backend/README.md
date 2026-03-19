# List of Expected Features

---

## 🔐 1. Authentication & Authorization Features

(from Objectives, Modules, Security sections)

- 👍User registration (create account)
- 👍User login (email/username + password)
- 👍Admin login (separate role)
- 👍Password hashing before storing
- 👍Role-based access control (user / admin)
- 👍Protected APIs using authentication middleware
- 👍Logout (token/session invalidation)

📌 Used by: User, Admin
📌 DB: User, Admin tables

---

## 👤 2. User Management Features

### User Side

- 👍View user profile
- 👍Update profile details
- View own posted items (lost/found)
- Account status handling (active / blocked)

### Admin Side

- 👍View all registered users
- 👍Block or remove users
- 👍Monitor user activity

📌 Modules: User Profile, User Management

---

## 📦 3. Lost Item Management Features

\*👍 Post lost item

- Item name
- Category
- Description
- Lost date
- Lost location
- Image upload (URL based)
- 👍Update lost item details
- 👍Delete lost item (owner or admin)
- 👍View all lost items
- 👍View single lost item details
- 👍Change lost item status (Lost → Recovered)

📌 DB: Lost_item
📌 Modules: Lost Item, Item View

---

## 🎒 4. Found Item Management Features

- 👍Post found item
  - Item name
  - Category
  - Description
  - Found date
  - Found location
  - Image upload

- Update found item
- Delete found item
- 👍View all found items
- View found item details
- 👍Change found item status (Found → Returned)

📌 DB: Found_item
📌 Modules: Found Item, Item View

---

## 🔍 5. Item Search & Filter Features

- Search items by:
  - Item name
  - Category
  - Location
  - Status (Lost / Found)

- Separate filters for lost and found items
- View matched results list

📌 Module: Item Search

---

## 💬 6. User Communication Features

- Secure contact sharing between:
  - Item owner
  - Item finder

- Prevent public exposure of email/phone
- Trigger communication only after login

📌 Module: User Communication

---

## 🛡️ 7. Admin Item Moderation Features

- 👍View all lost & found items
- 👍Remove false or inappropriate items
- 👍Update item status
- 👍Monitor item posting activity

📌 Module: Item Management

---

## 📊 8. Report Generation Features (Admin)

- Generate system reports:
  - User activity report
  - Lost items report
  - Found items report

- Store report data
- View past generated reports

📌 DB: Report
📌 Module: Report Generation

---

# API Schemas

---

# 📡 FINDUP – BACKEND API LIST

Base URL (example):

```
/api/v1
```

---

## 🔐 1. Authentication & Authorization APIs

---

### 1.1 User Registration

**URL:** `/auth/register`
**Method:** `POST`

**Request Schema:**

```json
{
  "full_name": "string",
  "email": "string",
  "username": "string",
  "password": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

---

### 1.2 User Login

**URL:** `/auth/login`
**Method:** `POST`

**Request Schema:**

```json
{
  "email_or_username": "string",
  "password": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "token": "jwt_token",
  "role": "user"
}
```

---

### 1.3 Admin Login

**URL:** `/auth/admin/login`
**Method:** `POST`

**Request Schema:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "token": "jwt_token",
  "role": "admin"
}
```

---

### 1.4 👍Logout

**URL:** `/auth/logout`
**Method:** `POST`

**Request Schema:**

```json
{}
```

**Response Schema:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 2. User Management APIs

---

### 2.1 👍View User Profile

**URL:** `/users/me`
**Method:** `GET`
🔐 Protected (User)

**Response Schema:**

```json
{
  "user_id": "objectId",
  "full_name": "string",
  "email": "string",
  "username": "string",
  "status": "active"
}
```

---

### 2.2 👍Update User Profile

**URL:** `/users/me`
**Method:** `PUT`
🔐 Protected (User)

**Request Schema:**

```json
{
  "full_name": "string",
  "email": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "message": "Profile updated"
}
```

---

### 2.3 View Own Posted Items

**URL:** `/users/me/items`
**Method:** `GET`
🔐 Protected (User)

**Response Schema:**

```json
{
  "lost_items": [],
  "found_items": []
}
```

---

### 2.4 👍Admin – View All Users

**URL:** `/admin/users`
**Method:** `GET`
🔐 Protected (Admin)

**Response Schema:**

```json
{
  "users": [
    {
      "user_id": "objectId",
      "username": "string",
      "status": "active"
    }
  ]
}
```

---

### 2.5 👍Admin – Block / Unblock User

**URL:** `/admin/users/:userId/status`
**Method:** `PATCH`

**Request Schema:**

```json
{
  "status": "blocked"
}
```

**Response Schema:**

```json
{
  "success": true,
  "message": "User status updated"
}
```

---

## 📦 3. Lost Item APIs

---

### 3.1 👍Post Lost Item

**URL:** `/lost-items`
**Method:** `POST`
🔐 Protected (User)

**Request Schema:**

```json
{
  "item_name": "string",
  "category": "string",
  "description": "string",
  "lost_date": "date",
  "lost_loc": "string",
  "image": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "lost_item_id": "objectId"
}
```

---

### 3.2 👍View All Lost Items

**URL:** `/lost-items`
**Method:** `GET`

**Response Schema:**

```json
{
  "items": []
}
```

---

### 3.3 👍View Single Lost Item

**URL:** `/lost-items/:id`
**Method:** `GET`

**Response Schema:**

```json
{
  "item_name": "string",
  "category": "string",
  "status": "Lost"
}
```

---

### 3.4 👍Update Lost Item

**URL:** `/lost-items/:id`
**Method:** `PUT`

**Request Schema:**

```json
{
  "description": "string",
  "lost_loc": "string"
}
```

**Response Schema:**

```json
{
  "success": true,
  "message": "Lost item updated"
}
```

---

### 3.5👍 Delete Lost Item

**URL:** `/lost-items/:id`
**Method:** `DELETE`

**Response Schema:**

```json
{
  "success": true,
  "message": "Lost item deleted"
}
```

---

### 3.6 👍Change Lost Item Status

**URL:** `/lost-items/:id/status`
**Method:** `PATCH`

**Request Schema:**

```json
{
  "status": "Recovered"
}
```

**Response Schema:**

```json
{
  "success": true
}
```

---

## 🎒 4. Found Item APIs

_(Same structure as Lost Items)_

---

### 4.1 👍Post Found Item

**URL:** `/found-items`
**Method:** `POST`

**Request Schema:**

```json
{
  "item_name": "string",
  "category": "string",
  "description": "string",
  "found_date": "date",
  "found_loc": "string",
  "image": "string"
}
```

---

### 4.2👍 View All Found Items

**URL:** `/found-items`
**Method:** `GET`

---

### 4.3 👍Update Found Item Status

**URL:** `/found-items/:id/status`
**Method:** `PATCH`

**Request Schema:**

```json
{
  "status": "Returned"
}
```

---

## 🔍 5. Search & Filter API

---

### 5.1 Search Items

**URL:** `/search`
**Method:** `GET`

**Query Params:**

```
?type=lost
&category=wallet
&location=library
```

**Response Schema:**

```json
{
  "results": []
}
```

---

## 💬 6. User Communication API

---

### 6.1 Get Contact Details (Secure)

**URL:** `/communication/:itemId`
**Method:** `GET`
🔐 Protected

**Response Schema:**

```json
{
  "username": "string",
  "email": "string"
}
```

---

## 🛡️ 7. Admin Item Moderation APIs

---

### 7.1 👍View All Items

**URL:** `/admin/items`
**Method:** `GET`

---

### 7.2 👍Remove Item

**URL:** `/admin/items/:id`
**Method:** `DELETE`

---

## 📊 8. Report Generation APIs

---

### 8.1 Generate Report

**URL:** `/admin/reports`
**Method:** `POST`

**Request Schema:**

```json
{
  "report_type": "lost_items",
  "description": "Monthly report"
}
```

**Response Schema:**

```json
{
  "success": true,
  "report_id": "objectId"
}
```

---

### 8.2 View Reports

**URL:** `/admin/reports`
**Method:** `GET`
