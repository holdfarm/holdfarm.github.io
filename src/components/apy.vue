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
import axios from "axios";

export default defineComponent({
  setup() {
    const state = reactive({
      apy: 0,
    });

    onMounted(async () => {
      try {
        axios
          .get("https://api.holdfarm.workers.dev/")
          .then(function(response) {
            // handle success
            console.log(response.data);

            state.apy = response.data.apy.toFixed(3);
          })
          .catch(function(error) {
            console.log(error);
          })
          .then(function() {
            // always executed
          });

  
      } catch (e) {
        console.log(e);
      }
    });

    return { state };
  },
});
</script>
