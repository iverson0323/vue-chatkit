<template>
  <div class="login-form">
    <h5 class="text-center">Chat Login</h5>
    <hr />
    <!-- 当组件内有button按钮时，只有一个点击时会触发submit事件，阻止默认事件触发，可以防止刷新 -->
    <b-form @submit.prevent="onSubmit">
      <b-alert variant="danger" :show="hasError">{{ error }}</b-alert>

      <b-form-group id="userInputGroup" label="User Name" label-for="userInput">
        <b-form-input
          id="userInput"
          type="text"
          placeholder="Enter user name"
          v-model="userId"
          autocomplete="off"
          :disabled="loading"
          required
        ></b-form-input>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        class="ld-ext-right"
        v-bind:class="{ running: loading }"
        :disabled="isValid"
      >
        Login
        <div class="ld ld-ring ld-spin"></div>
      </b-button>
    </b-form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "login-form",
  data() {
    return {
      userId: ""
    };
  },
  computed: {
    // 绑定的是disabled的状态，考虑当事件执行时的禁止操作状态
    // input、button
    isValid: function() {
      const result = this.userId.length < 3;
      return result ? result : this.loading;
    },
    ...mapState(["loading", "error"]),
    ...mapGetters(["hasError"])
  },
  methods: {
    ...mapActions(["login"]),

    async onSubmit() {
      const result = await this.login(this.userId);

      if (result) {
        this.$router.push("chat");
      }
    }
  }
};
</script>
