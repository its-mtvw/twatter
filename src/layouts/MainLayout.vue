<template>
  <q-layout view="lHr lpR fFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
        />

        <q-toolbar-title class="text-weight-bold">
          {{ $route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      :width="283"
      bordered
    >
      <img src="../assets/twatter-logo.png" alt="logo" style="width: 69px" />
      <p v-if="currentUser">Logged in as: {{ username }}</p>
      <q-list>
        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="home" size="md" />
          </q-item-section>
          <q-item-section class="text-h6">Home</q-item-section>
        </q-item>
        <q-item to="/about" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon color="primary" name="help" size="md" />
          </q-item-section>

          <q-item-section class="text-h6">About</q-item-section>
        </q-item>
        <q-item to="/login" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon color="primary" name="login" size="md" />
          </q-item-section>

          <q-item-section class="text-h6">Login</q-item-section>
        </q-item>
        <q-item to="/signup" clickable v-ripple exact>
          <q-item-section avatar>
            <q-icon color="primary" name="add" size="md" />
          </q-item-section>

          <q-item-section class="text-h6">Signup</q-item-section>
        </q-item>
        <q-item v-if="currentUser" clickable v-ripple @click="logout">
          <q-item-section avatar>
            <q-icon color="primary" name="logout" size="md" />
          </q-item-section>

          <q-item-section class="text-h6">Logout</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-drawer show-if-above v-model="rightDrawerOpen" side="right">
      <q-input
        placeholder="Search the Twatter"
        rounded
        filled
        class="q-ma-md"
        outlined
        place
        dense
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-list seperator bordered padding>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Sports</q-item-label>
            <q-item-label class="text-weight-bold"
              >The Twatter team won</q-item-label
            >
            <q-item-label caption
              >The twatter team won their very own game SURPISING</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Sports</q-item-label>
            <q-item-label class="text-weight-bold"
              >The Twatter team won</q-item-label
            >
            <q-item-label caption
              >The twatter team won their very own game SURPISING</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Sports</q-item-label>
            <q-item-label class="text-weight-bold"
              >The Twatter team won</q-item-label
            >
            <q-item-label caption
              >The twatter team won their very own game SURPISING</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-pa-md">
          <q-item-section>
            <q-item-label overline class="text-grey">Sports</q-item-label>
            <q-item-label class="text-weight-bold"
              >The Twatter team won</q-item-label
            >
            <q-item-label caption
              >The twatter team won their very own game SURPISING</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>5 min ago</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseApp } from "boot/firebase";

export default {
  data() {
    return {
      leftDrawerOpen: false,
      currentUser: null,
    };
  },
  computed: {
    username() {
      return this.currentUser ? this.currentUser.email.split("@")[0] : "";
    },
  },
  methods: {
    async logout() {
      const auth = getAuth(firebaseApp);
      try {
        await signOut(auth);
        this.currentUser = null;
      } catch (error) {
        console.error("Error signing out: ", error);
      }
    },
  },

  created() {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  },
};
</script>
