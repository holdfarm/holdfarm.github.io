<template>
  <section class="py-16">
    <div
      class=" items-center max-w-6xl px-4 px-10 mx-auto sm:px-20 md:px-32 lg:px-16"
    >
      <div class="container flex flex-wrap items-center ">
        <div class="order-1 w-full px-3 lg:w-1/2 lg:order-0">
          <div class="w-full lg:max-w-md">
            <h2
              class="mb-4 text-5xl font-bold leading-tight tracking-tight sm:text-4xl font-heading"
            >
              Total Value Locked
            </h2>
            <p class="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
              TVL across all modules of FARM
            </p>
          </div>
        </div>
        <div class="w-full mb-8 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-1">
            <div class="py-4">
              <div
                class="shadow-lg rounded-2xl p-4 bg-white-100 dark:bg-gray-800"
              >
                <div class="flex items-center">
                  <p class="text-2xl text-indigo-700 dark:text-gray-50 ml-2">
                    Locked In LP
                  </p>
                </div>
                <div class="flex flex-col justify-start">
                  <p
                    class="text-gray-800 text-5xl text-left dark:text-white font-bold my-4"
                  >
                    {{ state.lpLocked }} BNB
                  </p>
                </div>
              </div>
            </div>
            <div class="py-4">
              <div class="shadow-lg rounded-2xl p-4 bg-white-100 dark:bg-gray-800">
                <div class="flex items-center">
                  <p class="text-2xl text-indigo-700 dark:text-gray-50 ml-2">
                    Locked In Farms
                  </p>
                </div>

                <div class="flex flex-col justify-start">
                  <p
                    class="text-gray-800 text-5xl text-left dark:text-white font-bold my-4"
                  >
                    {{ state.tvlBalance }} CAKE
                  </p>
                </div>
              </div>
            </div>
          </div>
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
