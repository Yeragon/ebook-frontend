<!--
  FileName：BookDetail.vue
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：11/04/2025
  Last modified time：08/05/2025
  Module：User side - Logged status ebook info page
  Functions：
  1. Display the information of an ebook (cover, title, author, category, description);
  2. Offer multiple interaction buttons for users (Loan, Add to Wishlist, Comment);
  3. Display user-generated comments and support adding new ones;
  4. Fetch ebook info and comments data from the backend;
  5. Handle login status and provide logout functionality;
  6. Click logo "EBooks" to navigate to the dashboard.
-->

<template>
  <div class="book-detail-container">
    <!-- Header -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <div class="header-actions">
    <el-avatar :src="currentUser.avatar || ''" icon="el-icon-user" style="cursor: pointer;" @click="$router.push('/myaccount')" />
    <span class="user-name">{{ currentUser.name || 'User' }}</span>
    <span class="separator">|</span>
    <el-button type="text" @click="logout">Logout</el-button>
  </div>
    </div>

    <!-- Book Info -->
    <div class="book-info">
      <el-image :src="book.coverURL" style="width: 200px; height: 300px;"></el-image>
      <div class="book-meta">
        <h2>{{ book.title }}</h2>
        <p><strong>Author:</strong> {{ book.author }}</p>
        <p><strong>Category:</strong> {{ book.category }}</p>
        <p><strong>Description:</strong> {{ book.description }}</p>

        <div class="actions">
          <el-button type="primary" @click="loanBook">📖 Loan</el-button>
          <el-button type="warning" @click="addToWishlist">⭐ Wishlist</el-button>
          <el-button type="info" @click="commentDialogVisible = true">💬 Comment</el-button>
        </div>
      </div>
    </div>

    <!-- Comment Dialog -->
    <el-dialog title="Leave a Comment" v-model="commentDialogVisible">
      <el-input
        type="textarea"
        v-model="newComment"
        placeholder="Write your comment here..."
        rows="4"
      />
      <template #footer>
        <el-button @click="commentDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submitComment">Submit</el-button>
      </template>
    </el-dialog>

    <!-- Latest comment -->
    <div class="section-header">
      <h2>Latest Comments</h2>
    </div>
    <div v-if="comments.length > 0">
      <el-card v-for="comment in comments" :key="comment.id" class="comment-card">
        <p><strong>{{ comment.username }}:</strong> {{ comment.content }}</p>
      </el-card>
    </div>
    <div v-else class="no-comment">No comments yet.</div>
  </div>
</template>

<script>
/*
  Creator：Yuandong Li, Xiaoyao Yu
  Create time：04/11/2025
  Functions description：
    This script section implements the following logic:
      - fetchBookDetail：Fetch ebook detail from backend by ebook_id from route;
      - fetchComments：Fetch all user comments for the current ebook;
      - loanBook：Borrow the ebook for current logged-in user;
      - addToWishlist：Add the ebook into the current user's wishlist;
      - submitComment：Post a new comment for the ebook;
      - logout：Clear local storage and redirect to home;
      - openCommentDialog：Open the comment modal and clear query string.

  Tech Stack:
    - Vue 3 Composition API
    - Element Plus UI library
    - Route parameters passing, Axios asynchronous requests
*/

import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import request from '@/utils/request';
import { ElMessage } from 'element-plus';

export default {
  name: 'BookDetail',

  //data is used to store user data
  data() {
  return {
    currentUser: {}
  };
},

// created for initializing the current authenticated user data
created() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  },
 
  // Deal with the first load of this page(including check query)
  mounted() {
    console.log('Route query:', this.$route.query);
  if (this.$route.query.showComment === 'true') {
    this.openCommentDialog();
  }
},

  methods: {
    //Open comment dialog and clean current query in URL
    openCommentDialog() {
    this.showCommentModal = true; 
    this.$router.replace({ 
      name: this.$route.name, 
      params: this.$route.params, 
      query: {} 
    });
  },

    // User logout and move to Home page
    logout() {
      localStorage.removeItem('currentUser');
      this.$message.success('Logged out successfully!');
      this.$router.push('/');
    }
  },

  setup() {
    //Vue 3 Composition API
    const router = useRouter();
    const route = useRoute();
    const bookId = route.params.id;
    const book = ref({});
    const comments = ref([]);
    const commentDialogVisible = ref(false);
    const newComment = ref('');
    const userAvatar = ref('https://via.placeholder.com/100');
    const userId = JSON.parse(localStorage.getItem('currentUser'))?.userId;

    const fetchBookDetail = async () => {
  try {
    const res = await request.get(`/ebook/${bookId}`);
    const data = res.data || res;
    if (data?.coverURL) {
      book.value = data;
    } else {
      ElMessage.warning('Book not found or invalid data.');
      router.push('/');
    }
  } catch (error) {
    console.error('Failed to fetch book detail', error);
  }
};

    const fetchComments = async () => {
      try {
        const res = await request.get(`/review/list?ebookId=${bookId}`);
        comments.value = res || [];
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    const loanBook = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.userId;

    if (!userId) {
      ElMessage.error('User is not logged in!');
      return;
    }

    const res = await request.post('/loan/borrow', {
      userId,
      ebookId: bookId
    });

    if (res.data.code === 200) {
      ElMessage.success(res.data.message || 'Success!');
    } else {
      ElMessage.warning(res.data.message || 'Failed to loan book.');

    }
};

const addToWishlist = async () => {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.userId;

    if (!userId) {
      ElMessage.warning('Please log in to use wishlist.');
      return;
    }

    const wishlistItem = {
      userId,
      ebookId: bookId
    };

    const res = await request.post('/wishlist/add', wishlistItem);
    if (res.data.code === 200) {
  ElMessage.success(res.data.message || 'Success!');
} else {
  ElMessage.warning(res.data.message || 'Something went wrong');
}

};


const submitComment = async () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser?.userId;

  if (!userId) {
    ElMessage.warning('Please log in before commenting.');
    return;
  }

  if (!newComment.value.trim()) {
    ElMessage.warning('Please enter a comment.');
    return;
  }

  try {
    await request.post('/review/add', {
      userId,                
      ebookId: bookId,
      rating: 5,
      content: newComment.value  
    });

    ElMessage.success('Comment added!');
    commentDialogVisible.value = false;
    newComment.value = '';
    fetchComments();
  } catch (error) {
    ElMessage.error('Failed to submit comment.');
  }
};


    onMounted(() => {
      fetchBookDetail();
      fetchComments();
    });

    return {
      book,
      comments,
      commentDialogVisible,
      newComment,
      loanBook,
      addToWishlist,
      submitComment,
      userAvatar
    };
  }
};
</script>

<style scoped>
.book-detail-container {
  max-width: 1000px;
  margin: auto;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-name {
  font-size: 16px;
  font-weight: bold;
}
.separator {
  margin: 0 10px;
  font-size: 20px;
  color: #ccc;
}
.logo {
  color: #00bcd4;
  font-family: 'Lucida Handwriting', serif;
  font-size: 32px;
  cursor: pointer;
}

.book-info {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.book-meta {
  flex: 1;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.section-header {
  margin: 40px 0 20px;
}

.comment-card {
  margin-bottom: 10px;
}

.no-comment {
  color: #888;
  text-align: center;
}
</style>
