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
        v-model="username"
        label="UserName"
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
import { getAuth } from "firebase/auth";
import { firebaseApp, db } from "boot/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async signUp() {
      const firebaseAuth = getAuth(firebaseApp);
      const usersRef = collection(db, "users");
      const docRef = doc(usersRef, this.username);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.message = "Username already exists";
        return;
      }

      const email = `${this.username}@yourdomain.com`;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          firebaseAuth,
          email,
          this.password
        );

        await setDoc(docRef, { uid: userCredential.user.uid });

        this.message = "User signed up successfully!";
      } catch (error) {
        this.message = "Sign up error: " + error.message;
      }
    },
  },
};
</script>
