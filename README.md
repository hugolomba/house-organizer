# Housemates

![screenshot](public/images/screenshot.png)

🔗 Live demo: https://housemates.hugolomba.com

**Housemates** is a full-stack web application designed to help people organise, manage and access everything in a shared house.
People living in shared houses often struggle to manage shared information.
This is usually scattered across messaging apps, making it hard to find, easy to forget and frustrating to manage.
Housemates solves this by centralising all shared-house information in one secure place.

It provides a protected space where house members can:

- manage bills and shared expenses
- track tasks and responsibilities
- create alerts with different priority levels
- store shared credentials
- invite new members using an invite code

## Key Features

### House Management

- Create a new house or join an existing one using an invite code
- Secure, house-based access control
- Invite and manage house members
- the app keeps an activity feed of all actions taken in the house

### Dashboard Overview

- Active alerts sorted by priority (urgent, high, medium, low)
- Upcoming bills due in the next days
- Pending tasks
- Recent activity feed
- In the desktop version, it also has a dashboard style layout for better visual organisation

### Bills & Shared Expenses

- Create, edit and delete bills
- Split bills between house members
- Track how much each user owes
- Manual payment tracking
- Paid / unpaid status per user share

### Tasks

- Create and assign tasks
- Track task completion status
- Track tasks by room or category

### Alerts

- See alerts overview on dashboard
- Create alerts related to the house
- Priority levels: urgent, high, medium, low
- Mark alerts as resolved

### Rooms

- Create and manage house rooms
- Organise responsibilities per room
- Define room-specific tasks
- Define users in rooms (e.g. Alice is user of Alice's room)
- Define common rooms (e.g. kitchen, living room)

### Credentials

- Store shared credentials (e.g. Wi-Fi, services)
- **Securely encrypted** storage of credentials
- Accessible only to authorised house members

### Activity Feed

- Track recent house activity
- See who created, updated or deleted bills, tasks, alerts and credentials

---

## Authentication & Authorisation

- Email and password authentication
- Google authentication
- Session handling with **BetterAuth**
- Protected routes and server actions
- Authorisation checks to ensure users can only access and modify houses they belong to

---

## Tech Stack

- **Frontend:** Next.js (App Router) with Typescript and Tailwind CSS
- **Backend:** Next.js Server Actions with Typescript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** BetterAuth
- **Architecture:** Server Components + Client Components with Typescript
- **Security:** Authentication and authorisation at route and action level

---

## Future Improvements

- Push and email notifications for alerts and bills
- Real payment integrations
- Activity analytics and insights
- Role-based permissions (e.g. admin, member)
- Mobile app version
- More integrations (e.g. calendar sync, task management tools)
