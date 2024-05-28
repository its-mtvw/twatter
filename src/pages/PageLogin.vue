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
        v-model="username"
        label="UserName"
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseApp, db } from "boot/firebase";
import { collection, doc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async login() {
      const firebaseAuth = getAuth(firebaseApp);
      const usersRef = collection(db, "users");
      const docRef = doc(usersRef, this.username);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        this.message = "Username does not exist";
        return;
      }

      const email = `${this.username}@yourdomain.com`;

      try {
        await signInWithEmailAndPassword(firebaseAuth, email, this.password);
        this.message = "User logged in successfully!";
        localStorage.setItem("user", JSON.stringify({ user: this.username }));
        this.$router.push("/");
      } catch (error) {
        this.message = "Log in error: " + error.message;
      }
    },
  },
};
</script>
