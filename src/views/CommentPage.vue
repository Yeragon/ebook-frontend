<template>
    <div>
      <h2>Comments</h2>
      <ul>
        <li v-for="r in reviews" :key="r.id">
          <p>{{ r.comment }} - <strong>{{ r.rating }}/5</strong></p>
        </li>
      </ul>
      <textarea v-model="comment"></textarea>
      <input type="number" v-model="rating" min="1" max="5" />
      <button @click="submit">Submit Review</button>
    </div>
  </template>
  
  <script setup>
  /*
  Author: Xiaoyao Yu
  Created: April 20, 2025
  Last Modified: May 8, 2025
  Module: User Side - Comment Page Component
  Description:
    - Displays a list of user reviews associated with a specific loan
    - Allows the user to submit a new review with comment text 
    - Uses Composition API (ref, onMounted) for reactive state and lifecycle hook
    - Communicates with backend API for review fetch and submission
*/
  import { ref, onMounted } from 'vue'
  import request from '@/utils/request'
  
  const reviews = ref([])
  const comment = ref('')
  const rating = ref(5) // User input: rating (1-5 stars), Scalable function
  const loanId = 1
  
  /**
 * @hook onMounted
 * @description Fetches reviews from backend API based on the loan ID when the component is mounted.
 * The response data is saved to the reactive `reviews` array for display in the template.
 * @author Xiaoyao Yu
 * @date 2025-04-20
 */
  onMounted(async () => {
    const res = await request.get(`http://localhost:8080/api/reviews/loan/${loanId}`)
    reviews.value = res.data
  })
  /**
 * @function submit
 * @description Submits a new review to the backend, including the comment text and rating.
 * After successful submission, a confirmation alert is shown. 
 * Can be optimized :may later update this to show a modal, reset the form, or refresh the review list.
 * @author Xiaoyao Yu
 * @date 2025-04-21
 */
  async function submit() {
    await request.post(`http://localhost:8080/api/reviews`, {
      loanId,
      comment: comment.value,
      rating: rating.value
    })
    alert('Submitted')
  }
  </script>