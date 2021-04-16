<template>
  <section class="py-20">
    <div
      class="container items-center max-w-6xl px-4 px-10 mx-auto sm:px-20 md:px-32 lg:px-16"
    >
      <div class="flex flex-wrap items-center -mx-3">
        <div class="order-1 w-full px-3 lg:w-1/2 lg:order-0">
          <div class="w-full lg:max-w-md">
            <h2
              class="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading"
            >
              Total Value Locked
            </h2>
            <p class="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
              TVL across all modules of FARM
            </p>
            <ul>
              <li class="flex items-center py-2 space-x-4 xl:py-3">
                <svg
                  class="w-8 h-8 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  ></path>
                </svg>
                <span class="font-medium text-gray-500">
                  {{ state.lpLocked }} BNB
                </span>
              </li>
              <li class="flex items-center py-2 space-x-4 xl:py-3">
                <svg
                  class="w-8 h-8 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                <span class="font-medium text-gray-500">
                  {{ state.tvlBalance }} CAKE
                </span>
              </li>
              <li class="flex items-center py-2 space-x-4 xl:py-3">
                <svg
                  class="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                <span class="font-medium text-gray-500">1.07 ETH</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="w-full mb-8 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
          <img
            class="mx-auto sm:max-w-sm lg:max-w-full"
            src="../assets/tvl.jpg"
            alt="tvl image"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { ethers } from "ethers";
import config from "../utils/config.json";

import holdAbi from "../utils/hold.json";
import routerAbi from "../utils/router.json";
import farmAbi from "../utils/farm.json";

var provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const hold = new ethers.Contract(
  config.HOLD_CONTRACT_ADDRESS,
  holdAbi,
  provider
);
const router = new ethers.Contract(
  config.PANCAKE_ROUTER_CONTRACT_ADDRESS,
  routerAbi,
  provider
);
const farm = new ethers.Contract(config.FARM_CONTRACT, farmAbi, provider);
import { onMounted, reactive } from "vue";
import { formatEther, parseEther } from "ethers/lib/utils";
export default defineComponent({
  setup() {
    const state = reactive({
      lpLocked: 0,
      tvlBalance: 0,
    });

    onMounted(async () => {
      let wbnbBal = 1;
      try {
        const amountsOut = await router.getAmountsOut(parseEther("1.0"), [
          config.HOLD_CONTRACT_ADDRESS,
          config.WBNB_ADDRESS,
        ]);

        wbnbBal = parseFloat(formatEther(amountsOut[1])).toFixed(4);
      } catch (e) {
        console.log(e);
      }

      const cakeBal = await farm.stakedWantTokens(
        7,
        config.CONTROLLER_CONTRACT_ADDRESS
      );
      state.tvlBalance = parseFloat(formatEther(cakeBal)).toFixed(4);

      const bal = await hold.balanceOf(config.PAIR_ADDRESS);
      const lpLocked = formatEther(bal);

      state.lpLocked = parseFloat(2 * lpLocked * wbnbBal).toFixed(4);
    });

    return { state };
  },
});
</script>
