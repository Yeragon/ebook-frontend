# 📚 Ebooks Frontend - API and Pages Mapping

**Project Authors:** Xiaoyao Yu, Yuandong Li  
**Email:** c4020626@newcastle.ac.uk

---

## 📦 Project Structure Overview

---

## 🚀 Global Axios Request Handler

| File                   | Purpose                                                                                             |
| :--------------------- | :-------------------------------------------------------------------------------------------------- |
| `src/utils/request.js` | Centralized Axios wrapper. Adds Authorization token automatically and handles session expiry (401). |

---

## 📡 API - Page Mapping

| API Endpoint                         | Functionality                                 | Page (Vue File)                                                |
| :----------------------------------- | :-------------------------------------------- | :------------------------------------------------------------- |
| `/api/auth/login`                    | User login                                    | `src/views/Login.vue`                                          |
| `/api/auth/register`                 | User registration                             | `src/views/Register.vue`                                       |
| `/api/auth/resetpassword`            | Reset password                                | `src/views/ResetPassword.vue`                                  |
| `/api/books`                         | Fetch all books (for homepage recommendation) | `src/views/Home.vue`, `src/views/HomeLogged.vue`               |
| `/api/books/category/{categoryName}` | Fetch books by category                       | `src/views/Category.vue`                                       |
| `/api/ebook/{id}`                    | Fetch details of a single ebook               | `src/views/BookDetail.vue`, `src/views/BookDetailUnlogged.vue` |
| `/api/loan/borrow`                   | Borrow a book                                 | `src/views/BookDetail.vue`                                     |
| `/api/wishlist/add`                  | Add a book to the wishlist                    | `src/views/BookDetail.vue`                                     |
| `/api/wishlist/list`                 | Fetch wishlist items                          | `src/views/Wishlist.vue`                                       |
| `/api/loans/duesoon`                 | Fetch books that are due soon                 | `src/views/HomeLogged.vue`, `src/views/DueSoon.vue`            |
| `/api/loans/onloan`                  | Fetch books currently on loan                 | `src/views/OnLoan.vue`                                         |
| `/api/review/list?ebookId={id}`      | List reviews for a specific ebook             | `src/views/BookDetail.vue`                                     |
| `/api/review/add`                    | Submit a new review for an ebook              | `src/views/BookDetail.vue`                                     |
| `/api/account/update`                | Update user profile information               | `src/views/EditPage.vue`                                       |

---

## 🗺 Page Routing and Navigation

| Page                             | URL Path                  | Vue File                 |
| :------------------------------- | :------------------------ | :----------------------- |
| Homepage (not logged in)         | `/`                       | `Home.vue`               |
| Homepage (logged in)             | `/dashboard`              | `HomeLogged.vue`         |
| Login page                       | `/login`                  | `Login.vue`              |
| Registration page                | `/register`               | `Register.vue`           |
| Reset password page              | `/resetpassword`          | `ResetPassword.vue`      |
| Book details (logged in)         | `/bookdetail/:id`         | `BookDetail.vue`         |
| Book details (not logged in)     | `/bookdetailunlogged/:id` | `BookDetailUnlogged.vue` |
| My Account page                  | `/myaccount`              | `MyAccount.vue`          |
| Edit My Information page         | `/editpage`               | `EditPage.vue`           |
| Wishlist page                    | `/wishlist`               | `Wishlist.vue`           |
| Due Soon books page              | `/duesoon`                | `DueSoon.vue`            |
| On Loan books page               | `/onloan`                 | `OnLoan.vue`             |
| Category-specific book list page | `/category/:name`         | `Category.vue`           |

---

## 📋 Important Notes

- All frontend API requests are prefixed with `/api` and proxied to `http://localhost:8080` via Vite's proxy setup.
- Authorization token (`Bearer Token`) is automatically attached to API headers when the user is logged in.
- Session expiry (HTTP 401) will trigger auto logout and redirection to `/login`.

---

## 📬 Contact

- **Authors:** Xiaoyao Yu, Yuandong Li
- **Email:** c4020626@newcastle.ac.uk, c4045321@newcastle.ac.uk

---

# 🎯 Summary

This documentation provides a full mapping between the frontend pages and the backend API endpoints.

It helps backend developers:

- Quickly locate the frontend file related to each API.
- Understand the data flow and integration points between frontend and backend.
- Facilitate collaboration between frontend and backend teams.

Thank you for reviewing the project!
