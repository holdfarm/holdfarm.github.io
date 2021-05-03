<template>
  <div>
    <section class="w-full px-6 pb-12 antialiased bg-white">
      <div class="mx-auto max-w-7xl">
        <div
          class="container max-w-lg px-4 py-40 mx-auto text-left md:max-w-none md:text-center"
        >
          <h1
            class="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"
          >
            <span>{{ state.apy }} % </span>
            <span
              class="text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-green-500"
              >APR
            </span>
          </h1>
        </div>
      </div>
    </section>
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
        return fetch(
          "https://thingproxy.freeboard.io/fetch/https://api.holdfarm.workers.dev/",
          {
            method: "get",
            headers: {
              "content-type": "application/json",
            },
          }
        )
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
            console.log("loading APY");
            console.log(json);

            state.apy = json.apy.toFixed(3);
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
