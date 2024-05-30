<template>
  <q-page>
    <div v-for="user in users" :key="user.id">
      <p>{{ user.username }}</p>
      <q-btn
        @click="deleteUser(user)"
        color="primary"
        icon="delete"
        size="sm"
        flat
        round
      >
        Delete
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "boot/firebase";
import { useQuasar } from "quasar";

const $q = useQuasar();
let users = ref([]);

const fetchUsers = async () => {
  const userCollection = collection(db, "users");
  const userSnapshot = await getDocs(userCollection);
  users.value = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

onMounted(fetchUsers);

const deleteUser = async (user) => {
  try {
    await deleteDoc(doc(db, "users", user.id));
    users.value = users.value.filter((u) => u.id !== user.id);
    $q.notify({
      type: "positive",
      message: `User ${user.username} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user: ", error);
    $q.notify({
      // ...
    });
  }
};
</script>

<style>
/* Add your styles here */
</style>
