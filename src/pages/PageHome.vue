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
              <strong>User</strong>
              <span class="text-grey-7">@user</span>
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
              <q-btn color="primary" icon="favorite" size="sm" flat round />
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
import { ref } from "vue";
import { formatDistanceToNow } from "date-fns";
import { useQuasar } from "quasar";
const newTwattContent = ref("");
const twatts = ref([
  {
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste sapiente magni nemo consectetur hic facere sed, in vel sit laudantium necessitatibus laboriosam optio distinctio esse saepe sunt. Sapiente, facere similique?",
    date: 1716743825852,
  },
  {
    content:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste sapiente magni nemo consectetur hic facere sed, in vel sit laudantium necessitatibus laboriosam optio distinctio esse saepe sunt. Sapiente, facere similique?",
    date: 1716743853476,
  },
]);

const relativeDate = (value) => {
  return formatDistanceToNow(value, new Date());
};

const addNewTwatt = () => {
  let newTwatt = {
    content: newTwattContent.value,
    date: Date.now(),
  };
  twatts.value.unshift(newTwatt);
  newTwattContent.value = ""; // clear the input after adding the new twatt
};
const deleteTwatt = (twatt) => {
  twatts.value = twatts.value.filter((t) => t !== twatt);
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
