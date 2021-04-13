<template>
  <!-- Section 1 -->
  <section class="w-full px-6 pb-12 antialiased bg-white">
    <div class="mx-auto max-w-7xl">
      <nav class="relative z-50 h-24 select-none">
        <div
          class="container relative flex flex-wrap items-center justify-between h-24 mx-auto overflow-hidden font-medium border-b border-gray-200 md:overflow-visible lg:justify-center sm:px-4 md:px-2"
        >
          <div class="flex items-center justify-start w-1/4 h-full pr-4">
            <a href="#_" class="inline-block py-4 md:py-0">
              <span class="p-1 text-xl font-black leading-none text-gray-900"
                ><span>HOLD</span><span class="text-indigo-600">.</span
                ><span>FARM</span></span
              >
            </a>
          </div>
          <div
            class="top-0 left-0 items-start hidden w-full h-full p-4 text-sm bg-gray-900 bg-opacity-50 md:items-center md:w-3/4 md:absolute lg:text-base md:bg-transparent md:p-0 md:relative md:flex"
            :class="{ 'flex fixed': state.showMenu, hidden: !state.showMenu }"
          >
            <div
              class="flex-col w-full h-auto overflow-hidden bg-white rounded-lg md:bg-transparent md:overflow-visible md:rounded-none md:relative md:flex md:flex-row"
            >
              <div
                class="flex flex-col items-start justify-center w-full space-x-6 text-center lg:space-x-8 md:w-2/3 md:mt-0 md:flex-row md:items-center"
              >
                <a
                  href="https://twitter.com/HoldFarm"
                  class="inline-block w-full py-2 mx-0 ml-6 font-medium text-left text-indigo-600 md:ml-0 md:w-auto md:px-0 md:mx-2 lg:mx-3 md:text-center"
                  >TWITTER</a
                >
                <a
                  href="https://t.me/HoldfarmTG"
                  class="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center"
                  >TELEGRAM</a
                >
                <a
                  href="https://holdfarm.medium.com/"
                  class="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center"
                  >MEDIUM</a
                >
                <a
                  href="https://github.com/holdfarm"
                  class="inline-block w-full py-2 mx-0 font-medium text-left text-gray-700 md:w-auto md:px-0 md:mx-2 hover:text-indigo-600 lg:mx-3 md:text-center"
                  >GITHUB</a
                >
              </div>
              <div
                class="flex flex-col items-start justify-end w-full pt-4 md:items-center md:w-1/3 md:flex-row md:py-0"
              >
                <a
                  href="https://docs.hold.farm"
                  class="inline-flex items-center w-full px-6 py-3 text-sm font-medium leading-4 text-white bg-indigo-600 md:px-3 md:w-auto md:rounded-full lg:px-5 hover:bg-indigo-500 focus:outline-none md:focus:ring-2 focus:ring-0 focus:ring-offset-2 focus:ring-indigo-600"
                  >DOCS</a
                >
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Hero Content -->
      <div
        class="container max-w-lg px-4 py-40 mx-auto text-left md:max-w-none md:text-center"
      >
        <h1
          class="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"
        >
          <span>HOLD </span>
          <span
            class="text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500"
            >TOKEN
          </span>
        </h1>
        <div
          class="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg"
        >
          generates passive income by allocating assets to other crypto farms,
          combining and picking best farming vaults.
        </div>
        <div class="flex flex-col items-center mt-12 text-center">
          <span class="relative inline-flex w-full md:w-auto">
            <a
              href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x0827d5140dddac32fe8d1dec2b88d56af31b476d"
              type="button"
              class="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Get $HOLD TOKEN
            </a>
            <span
              class="absolute top-0 right-0 px-2 py-1 -mt-3 -mr-6 text-xs font-medium leading-tight text-white bg-green-400 rounded-full"
              >PancakeSwap</span
            >
          </span>
          <a
            href="https://bscscan.com/address/0x0827d5140dddac32fe8d1dec2b88d56af31b476d"
            class="mt-3 text-sm text-indigo-500"
            >Smart Contract</a
          >
        </div>
      </div>
      <!-- End Main Hero Content -->
    </div>
  </section>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { reactive } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      showMenu: false,
    });

    return { state };
  },
});
</script>
