# 📚 Ebooks Frontend - Startup Guide + API Page Mapping

**Project Authors:** Xiaoyao Yu, Yuandong Li  
**Email:** c4020626@newcastle.ac.uk, c4045321@newcastle.ac.uk

---

## 📦 Project Structure Overview

This project is the frontend of the eBook loaning system, built using Vue 3 + Element Plus + Vite, communicating with a Spring Boot backend via RESTful APIs.

---

## ⚙️ Startup Configuration Guide

### ✅ Prerequisites

- Node.js: Recommended v16.x or v18.x
- Package Manager: npm or yarn
- IDE: VS Code with Vue extensions

### 📦 Install Dependencies

```bash
git clone https://github.com/Yeragon/ebook-frontend.git
cd ebook-frontend
npm install
```

### 🚀 Run Development Server

```bash
npm run dev
```

Visit at: `http://localhost:5173`

### 🌍 Environment Configuration

Ensure `.env.development` exists in the root directory:

```env
VITE_BASE_API=http://localhost:8080/api
```

Vite will proxy all `/api` requests to the backend server.

---

## 🔗 Global Axios Request Handling

| File                   | Description                                                                                 |
| :--------------------- | :------------------------------------------------------------------------------------------ |
| `src/utils/request.js` | Axios wrapper, automatically adds Authorization token and handles session expiration (401). |

---

## 📡 API to Page Mapping

| API Endpoint                         | Functionality                             | Page (Vue File)                                                |
| :----------------------------------- | :---------------------------------------- | :------------------------------------------------------------- |
| `/api/auth/login`                    | User login                                | `src/views/Login.vue`                                          |
| `/api/auth/register`                 | User registration                         | `src/views/Register.vue`                                       |
| `/api/auth/resetpassword`            | Reset password                            | `src/views/ResetPassword.vue`                                  |
| `/api/books`                         | Fetch all books (homepage recommendation) | `src/views/Home.vue`, `src/views/HomeLogged.vue`               |
| `/api/books/category/{categoryName}` | Fetch books by category                   | `src/views/Category.vue`                                       |
| `/api/ebook/{id}`                    | Fetch book details                        | `src/views/BookDetail.vue`, `src/views/BookDetailUnlogged.vue` |
| `/api/loan/borrow`                   | Borrow a book                             | `src/views/BookDetail.vue`                                     |
| `/api/wishlist/add`                  | Add a book to the wishlist                | `src/views/BookDetail.vue`                                     |
| `/api/wishlist/list`                 | Get wishlist items                        | `src/views/Wishlist.vue`                                       |
| `/api/loans/duesoon`                 | Fetch books due soon                      | `src/views/HomeLogged.vue`, `src/views/DueSoon.vue`            |
| `/api/loans/onloan`                  | Fetch currently borrowed books            | `src/views/OnLoan.vue`                                         |
| `/api/review/list?ebookId={id}`      | List reviews for a specific ebook         | `src/views/BookDetail.vue`                                     |
| `/api/review/add`                    | Submit a review                           | `src/views/BookDetail.vue`                                     |
| `/api/account/update`                | Update user profile                       | `src/views/EditPage.vue`                                       |

---

## 🗺 Page Routing Map

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

## 📬 Contact

- **Authors:** Xiaoyao Yu, Yuandong Li
- **Email:** c4020626@newcastle.ac.uk, c4045321@newcastle.ac.uk

---
