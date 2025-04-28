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
  import { ref, onMounted } from 'vue'
  import request from '@/utils/request'
  
  const reviews = ref([])
  const comment = ref('')
  const rating = ref(5)
  const loanId = 1
  
  onMounted(async () => {
    const res = await request.get(`http://localhost:8080/api/reviews/loan/${loanId}`)
    reviews.value = res.data
  })
  
  async function submit() {
    await request.post(`http://localhost:8080/api/reviews`, {
      loanId,
      comment: comment.value,
      rating: rating.value
    })
    alert('Submitted')
  }
  </script>