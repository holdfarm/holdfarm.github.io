<template>
  <div
    class="container max-w-6xl mb-24 px-10 mx-auto sm:px-20 md:px-32 lg:px-16"
  >
    <div class="items-center">
      <div
        class="md:p-8 p-6 bg-white shadow-xl rounded-lg flex justify-between dark:bg-gray-800 md:items-center md:flex-row flex-col gap-12"
      >
        <div>
          <span class="text-bold text-gray-700 dark:text-gray-400 block">
            ESTIMATED EXPANSION
          </span>
          <span
            class="text-yellow-500 text-4xl md:text-4xl mt-2 font-black block"
          >
            {{ state.pendingExpBal }} HOLD
          </span>
        </div>
        <div class="self-end">
          <div class="md:text-right text-left md:block">
            <p
              class="text-xl md:mb-2 mb-0 dark:text-gray-100 flex items-center increase"
            >
              Last Token Buyback
            </p>
          </div>
          <p
            class="text-lg text-gray-600 md:text-right text-left dark:text-gray-400 md:block inline-block md:mb-0"
          >
            ({{ state.oldHarvest }})
          </p>
        </div>
        <button
          v-if="state.timeLock > 86400"
          @click="expandLP"
          class="inline-flex items-center justify-center w-full px-8 py-4 text-base font-bold leading-6 text-white bg-indigo-600 border border-transparent rounded-full md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
        >
          Expand
        </button>
      </div>
    </div>
  </div>
</template>

<script>
//   TIMELEFT, TIMEAGo, ESTIMATED EXPANSION
import { defineComponent } from "@vue/composition-api";
import { ethers } from "ethers";
import config from "../utils/config.json";
import moment from "moment";

import holdAbi from "../utils/hold.json";
// import routerAbi from "../utils/router.json";
import controllerAbi from "../utils/controller.json";
// import farmAbi from "../utils/farm.json";

var provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const hold = new ethers.Contract(
  config.HOLD_CONTRACT_ADDRESS,
  holdAbi,
  provider
);
// const router = new ethers.Contract(
//   config.PANCAKE_ROUTER_CONTRACT_ADDRESS,
//   routerAbi,
//   provider
// );

const controller = new ethers.Contract(
  config.CONTROLLER_CONTRACT_ADDRESS,
  controllerAbi,
  provider
);

// const farm = new ethers.Contract(config.FARM_CONTRACT, farmAbi, provider);

import { onMounted, reactive } from "vue";
import { formatEther } from "ethers/lib/utils";
export default defineComponent({
  data() {
    return { timeLockValbutton: 0 };
  },

  setup() {
    const state = reactive({
      nextHarvest: "",
      oldHarvest: "",
      pendingExpBal: 0,
      timeLock: 0,
    });

    onMounted(async () => {
      try {
        const oldHarvest = await controller.timeLock();
        const timeLockVal = await controller.timeLocksecs();
        const pendingExp = await hold.toMint();

        state.timelock = parseInt(timeLockVal);
        state.oldHarvest = moment.unix(parseInt(oldHarvest)).fromNow();
        state.pendingExpBal = formatEther(pendingExp);
      } catch (e) {
        console.log(e);
      }
    });

    const expandLP = async () => {
      await window.ethereum.enable();
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await newProvider.getNetwork();
      const signer = newProvider.getSigner();

      if (chainId !== 56) {
        alert("Switch to Binance Network.");
        return;
      }

      const controllerActionContract = new ethers.Contract(
        config.CONTROLLER_CONTRACT_ADDRESS,
        controllerAbi,
        signer
      );

      await controllerActionContract.harvest({
        gasPrice: 5000000000,
        gasLimit: 1500000,
      });
    };

    return { state, expandLP };
  },
});
</script>
