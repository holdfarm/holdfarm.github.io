<template>
  <div>
    <section class="bg-white-100">{{ state.apy }}</section>
  </div>
</template>

<script>
import { onMounted, reactive } from "vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const state = reactive({
      apy: 0,
    });

    onMounted(async () => {
      try {
        return fetch("https://api.holdfarm.workers.dev/", {
          method: "get",
          headers: {
            "content-type": "application/json",
          },
        })
          .then((res) => {
            if (!res.ok) {
              // create error instance with HTTP status text
              const error = new Error(res.statusText);
              error.json = res.json();
              throw error;
            }

            return res.json();
          })
          .then((json) => {
            // set the response data
            console.log("xx");
            console.log(json.data);

            state.apy = json.data;
          })
          .catch(() => {})
          .then(() => {});
      } catch (e) {
        console.log(e);
      }
    });

    return { state };
  },
});
</script>
