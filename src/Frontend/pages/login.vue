<template>
  <main>
    a
  </main>
</template>

<script>
export default {
  async mounted() {
    console.log(this.$route.query);
    if (this.$route.query.code) {
      try {
        const res = await this.$axios.$post('/auth/validate', {
          code: this.$route.query.code
        });
        localStorage.token = res;
      } finally {
        this.$router.push('/');
      }
    } else {
      window.location.href = '/api/auth/login';
    }
  }
};
</script>
