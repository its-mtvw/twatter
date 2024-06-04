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
            </q-avatar>
          </template>
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
        @click="toggleFollow(user)"
        color="primary"
        icon="person_add"
        size="sm"
        flat
        round
      >
        {{ isFollowing(user) ? "Unfollow" : "Follow" }}
      </q-btn>
    </div>

    <q-separator size="10px" color="grey-2" />
    <q-list separator>
      <transition-group
        appear
        enter-active-class="animated fadeIn slow"
        leave-active-class="animated fadeOut slow"
      >
        <q-item class="twatt q-py-md" v-for="twatt in tweets" :key="twatt.id">
          <q-item-section avatar top>
            <q-avatar size="xl">
              <img
                src="https://ichef.bbci.co.uk/news/480/cpsprodpb/7614/production/_105482203__105172250_gettyimages-857294664.jpg.webp"
              />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle1">
              <strong>@{{ twatt.user_id }}</strong>
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
              <span>{{ twatt.likes ? twatt.likes.length : 0 }}</span>
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
            {{ relativeDate(twatt.createdAt) }}
          </q-item-section>
        </q-item>
      </transition-group>
    </q-list>
  </q-page>
</template>

<script>
import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:3000",
});

export default {
  data() {
    return {
      id: "",
      email: "",
      password: "",
      tweets: [],
      newTwattContent: ""
    };
  },
  created() {
    this.verifyAccess();
  },
  methods: {
  async verifyAccess() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        this.$router.push({ name: "Login" });
        return;
      }
      const response = await instance.get("/tweets", {
        headers: { Authorization: `Bearer ${token}` }
      });
      this.tweets = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.error(err);
    }
  },
  async addNewTwatt() {
  try {
    const token = localStorage.getItem("token");
    const defaultImage = "https://example.com/default-image.jpg";
    const user_id ="2" // replace with your default image URL
    const response = await instance.post(
      "/tweets",
      { 
        content: this.newTwattContent,
        img: defaultImage,
        user_id: user_id // replace this.userId with the actual user id
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    this.tweets.unshift(response.data);
    this.newTwattContent = "";
  } catch (error) {
    console.error(error);
  }
},
  async deleteTwatt(twatt) {
  try {
    const token = localStorage.getItem("token");
    const response = await instance.delete(`/tweets/${twatt.tweet_id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Check if the deletion was successful before updating the state
    if (response.status === 200) {
      // Remove the deleted tweet from the local data
      this.tweets = this.tweets.filter(t => t.tweet_id !== twatt.tweet_id);
      // Refresh the tweets data from the server
      await this.verifyAccess();
    } else {
      console.error('Failed to delete tweet:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting tweet:', error);
  }
},


  likeTwatt(twatt) {
    // Implement liking functionality here
  },
  relativeDate(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    return new Date(date).toLocaleDateString();
  }
}

};
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
