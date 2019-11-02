<template>
  <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">Vue Chat</b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text>{{ user.name }} |</b-nav-text>
      <b-nav-item href="#" @click="onLogout" active>Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "ChatNavBar",
  computed: {
    ...mapState(["user", "reconnect"])
  },
  methods: {
    ...mapActions(["logout", "login"]),
    ...mapMutations(["setReconnect"]),

    onLogout() {
      this.$router.push({ path: "/" });
      this.logout();
    },

    unload() {
      if (this.user.username) {
        // 设置下一次需要重新连接的标志
        this.setReconnect(true);
      }
    }
  },

  mounted() {
    // 刷新的时候、或者页签关闭的时候
    window.addEventListener("beforeunload", this.unload);

    if (this.reconnect) {
      // 进行重新登录，如果是因为页面刷新的原因
      this.login(this.user.username);
    }
  }
};
</script>

<style>
#chat-navbar {
  margin-bottom: 15px;
}
</style>
