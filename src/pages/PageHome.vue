<template>
  <q-page>
    <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
      <div class="col">
        <q-input
          bottom-slots
          v-model="newTwattContent"
          label="Whats Twatting?"
          counter
          maxlength="280"
          autogrow
        >
          <template v-slot:before>
            <q-avatar size="xl">
              <img
                src="https://ichef.bbci.co.uk/news/480/cpsprodpb/7614/production/_105482203__105172250_gettyimages-857294664.jpg.webp"
              />
            </q-avatar> </template
          >>
        </q-input>
      </div>
      <div class="col col-shrink">
        <q-btn
          @click="addNewTwatt"
          :disable="!newTwattContent"
          unelevated
          rounded
          color="primary"
          label="Twattes"
          class="q-mb-lg"
        ></q-btn>
      </div>
    </div>
    <div v-for="user in users" :key="user.id">
      <p>{{ user.username }}</p>
      <q-btn
        @click="followUser(user)"
        color="primary"
        icon="person_add"
        size="sm"
        flat
        round
      />
    </div>
    <q-separator size="10px" color="grey-2" />
    <q-list seperator>
      <transition-group
        appear
        enter-active-class="animated fadeIn slow"
        leave-active-class="animated fadeOut slow"
      >
        <q-item class="twatt q-py-md" v-for="twatt in twatts" :key="twatt.date">
          <q-item-section avatar top>
            <q-avatar size="xl">
              <img
                src="https://ichef.bbci.co.uk/news/480/cpsprodpb/7614/production/_105482203__105172250_gettyimages-857294664.jpg.webp"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1">
              <strong>@{{ twatt.user }}</strong>
            </q-item-label>
            <q-item-label class="twatt-content text-body1">
              {{ twatt.content }}
            </q-item-label>
            <div class="twatt-icons row justify-between q-mt-sm">
              <q-btn
                color="primary"
                icon="card_chatbubble"
                size="sm"
                flat
                round
              />
              <q-btn color="primary" icon="replay" size="sm" flat round />
              <q-btn
                @click="likeTwatt(twatt)"
                color="primary"
                icon="favorite"
                size="sm"
                flat
                round
              />
              <span>{{
                Array.isArray(twatt.likes) ? twatt.likes.length : 0
              }}</span>
              <q-btn
                @click="deleteTwatt(twatt)"
                color="primary"
                icon="delete"
                size="sm"
                flat
                round
              />
            </div>
          </q-item-section>

          <q-item-section side top>
            {{ relativeDate(twatt.date) }}
          </q-item-section>
        </q-item>
      </transition-group>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  query,
  where,
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "boot/firebase";
import { formatDistanceToNow } from "date-fns";
import { useQuasar } from "quasar";
let storedUser = localStorage.getItem("user");
let parsedUser = storedUser
  ? JSON.parse(storedUser)
  : { user: "defaultUsername" };
const username = ref(parsedUser.user);
const newTwattContent = ref("");
const twatts = ref([]);

const relativeDate = (value) => {
  return formatDistanceToNow(value, { addSuffix: true });
};

const addNewTwatt = async () => {
  let storedUser = JSON.parse(localStorage.getItem("user"));
  if (!storedUser) {
    alert("You need to be logged in to twatt");
    return;
  }
  let newTwatt = {
    content: newTwattContent.value,
    date: Date.now(),
    user: storedUser.user, // store the username of the user who posted the tweet
    likes: [],
  };
  const twattsCollection = collection(db, "twatts");
  await addDoc(twattsCollection, newTwatt);
  newTwattContent.value = ""; // clear the input after adding the new twatt
};

const deleteTwatt = async (twatt) => {
  let storedUser = JSON.parse(localStorage.getItem("user"));
  if (twatt.user === storedUser.user) {
    try {
      const twattDoc = doc(db, "twatts", twatt.id);
      await deleteDoc(twattDoc);
      // Remove the deleted twatt from your local state
      twatts.value = twatts.value.filter((t) => t.id !== twatt.id);
    } catch (error) {
      console.error("Error deleting twatt:", error);
    }
  } else {
    alert("You can only delete your own twatts");
  }
};
const likeTwatt = async (twatt) => {
  const twattDoc = doc(db, "twatts", twatt.id);
  if (Array.isArray(twatt.likes)) {
    if (twatt.likes.includes(username.value)) {
      // If the user has already liked the twatt, remove their like
      await updateDoc(twattDoc, { likes: arrayRemove(username.value) });
    } else {
      // If the user hasn't liked the twatt yet, add their like
      await updateDoc(twattDoc, { likes: arrayUnion(username.value) });
    }
    // Fetch the updated twatt document from the Firestore database
    const updatedTwatt = await getDoc(twattDoc);
    // Update the twatt.likes array in your local state
    twatt.likes = updatedTwatt.data().likes;
  }
};
const followUser = async (userId) => {
  try {
    if (currentUser) {
      const followerDocRef = doc(
        collection(db, "followers", userId, "followers"),
        currentUser.uid
      );
      const followingDocRef = doc(
        collection(db, "following", currentUser.uid, "following"),
        userId
      );

      await setDoc(followerDocRef, {
        userId: currentUser.uid,
        followedAt: serverTimestamp(),
      });

      await setDoc(followingDocRef, {
        userId: userId,
        followedAt: serverTimestamp(),
      });

      reload.value++;
    }
  } catch (error) {
    console.error("Error following user: ", error);
  }
};
onMounted(() => {
  const twattsCollection = collection(db, "twatts");
  const orderedQuery = query(twattsCollection, orderBy("date", "desc"));
  onSnapshot(orderedQuery, (snapshot) => {
    twatts.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      likes: doc.data().likes,
    }));
  });
});
</script>
<style>
.twatt-content {
  white-space: pre-line;
}
.twatt-icons {
  margin-left: 5px;
}
.twatt:not(:first-child) {
  border-top: 1px solid lightgray;
}
</style>
