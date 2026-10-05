# HunarHub: Digital Marketplace for Local Micro-Entrepreneurs

**Detailed Project Report**

| | |
|---|---|
| **Project title** | HunarHub, Digital Marketplace for Local Micro-Entrepreneurs |
| **Submitted by** | Aditya Panwar |
| **Internship / Program** | Unified Mentor |
| **GitHub repository** | https://github.com/ap2912/Hunarhub |
| **Live deployment** | https://ap2912.github.io/Hunarhub/ |
| **Date** | [Submission Date] |

---

## 1. Executive Summary

HunarHub is a responsive web platform that connects customers with local micro-entrepreneurs such as cobblers, potters (kumhar), tailors, artisans and small vendors. These skilled people often rely on foot traffic and word of mouth, which limits their income and reach. HunarHub gives them a digital storefront where they can showcase skills, sell handmade products and accept service requests, while customers can easily discover and support local talent.

The application has three role-based experiences (customer, maker and admin) and covers the full journey: discovery, service booking, product purchase, order management, reviews and platform moderation.

---

## 2. Problem Statement

Micro-entrepreneurs currently face these challenges:

- No digital presence or marketing reach
- Limited customer discovery beyond their local area
- No structured way to accept service requests or orders
- Dependence on middlemen or offline sales
- Lack of transparency in pricing and availability

---

## 3. Objectives

### Primary Objectives
- Digitally connect local micro-entrepreneurs with customers
- Enable service booking and product selling from one platform
- Promote traditional skills and handmade products
- Increase income opportunities for small vendors

### Secondary Objectives
- Encourage local and sustainable commerce
- Reduce dependency on middlemen
- Provide entrepreneurs with simple digital tools
- Enable community-based economic growth

---

## 4. Scope

### In Scope (Implemented)
- Web-based responsive platform
- Entrepreneur profiles and service listings
- Product marketplace for handmade items
- Order and service request management
- Customer, maker and admin dashboards

### Out of Scope
- Native mobile applications
- International shipping
- Advanced AI recommendations
- Logistics and delivery management

---

## 5. Features Implemented

### 5.1 Customer Features
- Registration and login
- Browse makers by category (Cobbler, Potter, Tailor, Artisan, Small vendor)
- Search and filter by skill type, location, price range, rating and availability
- View maker profiles with skills, experience, gallery, pricing and reviews
- Place service requests by choosing a service, date, time and budget
- Shopping cart and checkout for handmade products
- Order and request history
- Save favorite makers
- Ratings, reviews and complaints

### 5.2 Micro-Entrepreneur (Maker) Features
- Registration and profile creation (new profiles start as pending until verified)
- Dashboard to manage profile
- Skill and service listing (create, edit, delete)
- Product listing with images and pricing (create, edit, delete)
- Accept or reject service requests
- Manage availability
- View orders and move them through statuses
- Earnings overview

### 5.3 Admin Features
- Approve, verify or suspend makers
- Manage categories and skills
- Monitor orders and service requests
- Handle disputes and complaints
- Platform analytics and reports

---

## 6. System Design

### 6.1 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Routing | react-router-dom (HashRouter) |
| Styling | Plain CSS with design tokens |
| State management | React Context API |
| Persistence | Browser `localStorage` (demo data layer) |
| Seed data | `src/data/seed.js` |
| Deployment | GitHub Pages (also compatible with Vercel and Netlify) |

### 6.2 Architecture

The current build is a single-page application (SPA). All pages are served as static files, and application state is held in a global React Context (`StoreContext`) that reads from and writes to `localStorage`.

```
Browser
  └── React SPA (Vite build)
        ├── Pages (Home, Explore, Profile, Cart, Dashboards ...)
        ├── Components (Navbar, FilterPanel, DataTable, Modal ...)
        └── StoreContext (global state)
              └── localStorage (key: hunarhub_db_v1)
                    └── seeded from src/data/seed.js
```

### 6.3 Core Data Entities

| Entity | Purpose |
|---|---|
| Users | Customers, makers and admins with roles |
| Micro-Entrepreneurs | Maker profiles, skills, location, availability, verification status |
| Categories / Skills | Cobbler, Potter, Tailor, Artisan, Small vendor |
| Services | Services offered by each maker with pricing |
| Products | Handmade items with images, price and stock |
| Service Requests | Customer bookings with date, time, budget and status |
| Orders | Product orders (one per maker at checkout) with status |
| Reviews | Ratings and feedback on makers |
| Complaints | Disputes raised by customers and handled by admin |

### 6.4 User Flow

1. User visits the platform
2. Registers or logs in
3. Browses local entrepreneurs
4. Views a profile or product
5. Places a service request or order
6. Entrepreneur confirms the request
7. Service is delivered or product is sold
8. User provides feedback

### 6.5 Design Language

- Near-black canvas (`#050505`) with a subtle technical grid
- Editorial typography (Inter Tight)
- Lime accent (`#B7FF2A`)
- Thin translucent borders and small corner radii
- Restrained motion that respects `prefers-reduced-motion`
- Design tokens stored in a single file (`src/styles/tokens.css`)
- An image fallback component so broken images never appear

---

## 7. Non-Functional Requirements

| Requirement | Approach |
|---|---|
| Performance | Static Vite build, locally stored images, no heavy animation libraries. Target: page load under 3 seconds. [Add Lighthouse score here] |
| Usability | Simple and intuitive navigation, responsive layout, consistent components |
| Reliability | Order and request statuses are tracked through defined status transitions, and checkout reduces stock |
| Security | Demo-level authentication only (see Limitations). Production security is planned for the backend phase |

---

## 8. Testing and Verification

The following flows were tested manually:

| Flow | Result |
|---|---|
| Search and filters on the Explore page change results | [Pass] |
| Maker profile shows services, products, gallery and reviews | [Pass] |
| Adding a review while signed in | [Pass] |
| Add to cart, quantity change, checkout creates one order per maker | [Pass] |
| Stock decreases after checkout | [Pass] |
| Service request creates a request ID | [Pass] |
| Maker accepts or rejects a request | [Pass] |
| Maker updates order status | [Pass] |
| Admin verifies or suspends a maker | [Pass] |
| Admin resolves a complaint | [Pass] |
| Layout on mobile, tablet and desktop widths | [Pass] |

> Update this table with what you actually tested. Remove or mark anything you did not verify.

---

## 9. Screenshots

> Insert screenshots here: Home, Explore with filters, Maker profile, Cart, Customer dashboard, Maker dashboard, Admin dashboard.

---

## 10. Key Performance Indicators (KPIs)

The platform is designed around the following KPIs from the project brief:

- Number of registered entrepreneurs
- Number of active users
- Service request conversion rate
- Product sales volume
- Average entrepreneur earnings
- Customer satisfaction ratings

The admin dashboard presents platform analytics based on the data in the system. [Edit this line to state exactly which of these KPIs your dashboard shows.]

---

## 11. Assumptions and Constraints

### Assumptions
- Entrepreneurs are willing to onboard digitally
- Customers support local businesses
- Basic internet access is available

### Constraints
- Digital literacy of entrepreneurs
- Limited initial geographic coverage
- Manual service fulfillment

---

## 12. Current Limitations

In the interest of transparency, these are the known limitations of this version:

1. **No backend or database.** All data is stored in the browser's `localStorage`, so data is not shared between different users or devices. A request placed by a customer on one device will not appear on a maker's dashboard on another device.
2. **Simulated authentication.** Demo login accepts any password and sessions are stored in `localStorage`. This is not suitable for production.
3. **No real payments, notifications or delivery.** These are outside the scope of this version.
4. **Concurrency.** Because there is no server, simultaneous bookings by multiple users cannot be handled yet.

---

## 13. Future Enhancements

### Technical Roadmap
1. Backend with Node.js and Express
2. MongoDB or PostgreSQL database for shared, persistent data
3. Secure authentication (password hashing with bcrypt and JWT) with role-based access control
4. REST APIs for service requests, status updates and notifications
5. Atomic stock updates and booking conflict checks for concurrent users
6. Input validation, rate limiting and other security hardening
7. Automated tests and a CI pipeline

### Product Roadmap
- Digital payments and wallets
- Logistics and delivery integration
- Native mobile applications
- Skill training and certification modules
- In-app notifications

---

## 14. Expected Impact

- Increased income for local micro-entrepreneurs
- Preservation and promotion of traditional skills
- Stronger local economies
- Digital inclusion of small vendors

---

## 15. Learnings

[Write 4 to 6 lines in your own words. For example: building a role-based multi-dashboard application in React, designing a reusable component system, managing global state with Context, handling forms and filters, deploying a Vite app to GitHub Pages, and what you would do differently next time.]

---

## 16. Conclusion

HunarHub delivers a complete, polished front-end experience for a local micro-entrepreneur marketplace. It demonstrates the full flow from discovery to service booking, ordering, fulfillment and admin oversight across three user roles. The next step is a backend with real authentication and a shared database, which will turn the demo into a production-ready platform that micro-entrepreneurs can actually use.

---

## 17. Links

- **GitHub repository:** https://github.com/ap2912/Hunarhub
- **Live demo:** https://ap2912.github.io/Hunarhub/
- **Demo accounts:**
  - Customer: `customer@hunarhub.demo`
  - Maker: `seller@hunarhub.demo`
  - Admin: `admin@hunarhub.demo`
  - Any password works in demo mode
