import request from '@/utils/request'

const BASE_URL = 'http://localhost:8080/api'

// User
export const getUserById = (id) => request.get(`${BASE_URL}/users/${id}`)
export const updateUser = (id, data) => request.put(`${BASE_URL}/users/${id}`, data)
export const login = (data) => request.post(`${BASE_URL}/auth/login`, data)
export const register = (data) => request.post(`${BASE_URL}/auth/register`, data)

// ebooks
export const getRecommendedBooks = () => request.get(`${BASE_URL}/ebooks/recommended`)
export const getBookById = (id) => request.get(`${BASE_URL}/ebooks/${id}`)

// Borrow
export const getLoansByUser = (userId) => request.get(`${BASE_URL}/loans/user/${userId}`)
export const borrowBook = (data) => request.post(`${BASE_URL}/loans`, data)
export const getDueSoon = (userId) => request.get(`${BASE_URL}/loans/duesoon/${userId}`)

// wishlist
export const getWishlist = (userId) => request.get(`${BASE_URL}/wishlist/user/${userId}`)

// pay
export const topUp = (data) => request.post(`${BASE_URL}/payments/topup`, data)

// comment
export const getReviewsByLoan = (loanId) => request.get(`${BASE_URL}/reviews/loan/${loanId}`)
export const submitReview = (data) => request.post(`${BASE_URL}/reviews`, data)
