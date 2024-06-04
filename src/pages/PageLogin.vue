<template>
  <div
    style="
      display: flex;
      justify-content: center;
      align-items: flex-start;
      height: 100vh;
    "
  >
    <div class="q-gutter-y-md column" style="max-width: 500px">
      <q-input
        clearable
        filled
        color="blue-6"
        v-model="email"
        label="Email"
        style="width: 400px"
      />
      <q-input
        type="password"
        clearable
        filled
        color="blue-6"
        v-model="password"
        label="Password"
        style="width: 400px"
      />
      <q-btn color="primary" label="Login" @click="login" />
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
const axios_instance = axios.create({
  baseURL: "http://localhost:3000",
});

export default {
  data() {
    return {
      email: "",
      password: "",
      message: ""
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios_instance.post("/login", {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem("token", response.data.token);
        this.$router.push({ name: "Home" });
      } catch (error) {
        this.message = "Login failed. Please check your credentials.";
        console.error(error);
      }
    },
  },
};
</script>
