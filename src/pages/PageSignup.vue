<template>
  <div
    class="q-pa-md"
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
        clear-icon="close"
        filled
        color="blue-6"
        v-model="password"
        label="Password"
        style="width: 400px"
      />
      <q-btn color="primary" label="Sign Up" @click="signUp" />
      <p>{{ message }}</p>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { route } from "quasar/wrappers";
const axios_instance = axios.create({
  baseURL: "http://localhost:3000",
});
export default {
  data() {
    return {
      email: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async signUp() {
      try {
        axios_instance
          .post("/signup", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            localStorage.setItem("token", response.data.token);
            console.log(JSON.stringify(response));
            this.message = "User created successfully";
          });
      } catch (error) {}
    },
  },
};
</script>
