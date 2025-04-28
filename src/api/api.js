import request from '@/utils/request'

const BASE_URL = 'http://localhost:8080/api'

// 用户
export const getUserById = (id) => request.get(`${BASE_URL}/users/${id}`)
export const updateUser = (id, data) => request.put(`${BASE_URL}/users/${id}`, data)
export const login = (data) => request.post(`${BASE_URL}/auth/login`, data)
export const register = (data) => request.post(`${BASE_URL}/auth/register`, data)

// 图书
export const getRecommendedBooks = () => request.get(`${BASE_URL}/ebooks/recommended`)
export const getBookById = (id) => request.get(`${BASE_URL}/ebooks/${id}`)

// 借阅
export const getLoansByUser = (userId) => request.get(`${BASE_URL}/loans/user/${userId}`)
export const borrowBook = (data) => request.post(`${BASE_URL}/loans`, data)
export const getDueSoon = (userId) => request.get(`${BASE_URL}/loans/duesoon/${userId}`)

// 愿望清单
export const getWishlist = (userId) => request.get(`${BASE_URL}/wishlist/user/${userId}`)

// 支付
export const topUp = (data) => request.post(`${BASE_URL}/payments/topup`, data)

// 评论
export const getReviewsByLoan = (loanId) => request.get(`${BASE_URL}/reviews/loan/${loanId}`)
export const submitReview = (data) => request.post(`${BASE_URL}/reviews`, data)
