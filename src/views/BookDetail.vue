<!-- src/views/BookDetail.vue -->
<template>
  <div class="book-detail-container">
    <!-- 顶部导航 -->
    <div class="header">
      <h1 class="logo" @click="$router.push('/dashboard')">Ebooks</h1>
      <el-avatar :src="userAvatar" @click="$router.push('/myaccount')" />
    </div>

    <!-- 书籍信息 -->
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

    <!-- 留言弹窗 -->
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

    <!-- 最新评论 -->
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import request from '@/utils/request';

export default {
  setup() {
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
        book.value = res.data || {};
      } catch (error) {
        console.error('Failed to fetch book detail', error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await request.get(`/review/list?ebookId=${bookId}`);
        comments.value = res.data || [];
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    const loanBook = async () => {
      try {
        await request.post('/loan/borrow', {
          ebookId: bookId,
          accountId: userId
        });
        ElMessage.success('Successfully loaned this book!');
      } catch (error) {
        ElMessage.error('Loan failed.');
      }
    };

    const addToWishlist = async () => {
      try {
        await request.post('/wishlist/add', {
          ebookId: bookId,
          accountId: userId
        });
        ElMessage.success('Added to Wishlist!');
      } catch (error) {
        ElMessage.error('Already in Wishlist or failed.');
      }
    };

    const submitComment = async () => {
      if (!newComment.value.trim()) {
        ElMessage.warning('Please enter a comment.');
        return;
      }
      try {
        await request.post('/review/add', {
          ebookId: bookId,
          rating: 5,
          comment: newComment.value
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
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  color: #00bcd4;
  font-family: 'Lucida Handwriting', cursive;
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
