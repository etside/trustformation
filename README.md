# Trust Formation - Full Stack Website

A complete, production-ready web application for Trust Formation, a corporate service provider. Built with Node.js, Express, SQLite, and EJS templating.

## Features

- **Public Frontend** - Modern, responsive website with dynamic content
- **Admin Panel** - Password-protected dashboard to manage all content
- **Dynamic Theming** - Colors, text, images all editable from admin
- **Service Management** - Add, edit, delete, reorder services
- **Contact Form** - Message submissions viewable in admin
- **File Uploads** - Logo, hero images via Multer

## Tech Stack

- Node.js + Express.js
- SQLite (via better-sqlite3)
- EJS templating
- Multer (file uploads)
- bcryptjs (password hashing)
- Vanilla CSS (no framework dependency)

## Quick Start

### 1. Install Dependencies

```bash
cd trust-formation
npm install
```

### 2. Configure Environment (Optional)

Copy `.env` and edit as needed:

```bash
PORT=3000
SESSION_SECRET=your-secret-key
DB_PATH=./data/trust-formation.db
```

### 3. Start the Server

```bash
npm start
```

The app will:
- Create the SQLite database automatically
- Seed default data (services, settings, admin user)
- Start on http://localhost:3000

### 4. Access the Application

- **Public Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

### 5. Admin Login Credentials

- **Email:** admin@trustformation.net
- **Password:** Admin@2025

## Project Structure

```
trust-formation/
├── app.js                    # Express server entry point
├── package.json
├── .env                      # Environment variables
├── config/
│   └── database.js           # SQLite setup, schema, seed data
├── models/                   # (Models integrated in config/database.js)
├── routes/
│   ├── public.js             # Public routes (homepage, contact form)
│   ├── admin.js              # Admin routes (login, dashboard, CRUD)
│   └── api.js                # Public JSON API endpoints
├── views/
│   ├── index.ejs             # Main public page
│   ├── 404.ejs               # 404 page
│   ├── partials/             # Reusable page sections
│   │   ├── header.ejs
│   │   ├── hero.ejs
│   │   ├── services.ejs
│   │   ├── whyus.ejs
│   │   ├── banner.ejs
│   │   ├── contact.ejs
│   │   └── footer.ejs
│   └── admin/
│       ├── login.ejs         # Admin login page
│       └── dashboard.ejs     # Admin dashboard with tabs
├── public/
│   ├── css/
│   │   ├── style.css         # Public site styles
│   │   └── admin.css         # Admin panel styles
│   ├── js/
│   │   ├── main.js           # Public site scripts
│   │   └── admin.js          # Admin panel scripts
│   └── uploads/              # Uploaded files (logo, hero images)
├── data/                     # SQLite database (auto-created)
└── README.md
```

## Admin Panel Sections

1. **General Settings** - Colors, logo, hero content, contact info, social links, banner, footer
2. **Manage Services** - Add, edit, delete, drag-to-reorder service cards
3. **Why Choose Us** - Manage the "Why Choose Us" feature items
4. **Submissions** - View contact form messages

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all site settings (JSON) |
| GET | `/api/services` | Get all services (JSON) |
| GET | `/api/whyus` | Get why-us items (JSON) |
| POST | `/admin/api/update-settings` | Update site settings |
| POST | `/admin/api/upload` | Upload images |
| POST | `/admin/api/services/add` | Add a service |
| POST | `/admin/api/services/edit` | Edit a service |
| POST | `/admin/api/services/delete` | Delete a service |
| POST | `/admin/api/services/reorder` | Reorder services |
| POST | `/admin/api/whyus/add` | Add why-us item |
| POST | `/admin/api/whyus/edit` | Edit why-us item |
| POST | `/admin/api/whyus/delete` | Delete why-us item |

## Default Data

The app seeds the following on first run:
- 8 services (USA, UK, Canada, Bangladesh, E-Trade, Audit, Apostille, Trademark)
- 4 "Why Choose Us" items
- Default colors: Primary `#0F3B5C`, Accent `#F4A261`, Background `#F8FAFE`
- Admin user: admin@trustformation.net / Admin@2025
