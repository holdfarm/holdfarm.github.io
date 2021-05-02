<template>
  <div v-if="state.timeLockVal > 99999" class="bg-gray-100 p-20 justify-center">
    <button
      @click="expandLP"
      class= "w-full h-24 px-6 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
    >
      Expand
    </button>
  </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { ethers } from "ethers";
import config from "../utils/config.json";
import moment from "moment";

import holdAbi from "../utils/hold.json";
import controllerAbi from "../utils/controller.json";

var provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const hold = new ethers.Contract(
  config.HOLD_CONTRACT_ADDRESS,
  holdAbi,
  provider
);

const controller = new ethers.Contract(
  config.CONTROLLER_CONTRACT_ADDRESS,
  controllerAbi,
  provider
);

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
      timeLockVal: 0,
    });
    onMounted(async () => {
      try {
        const oldHarvest = await controller.timeLock();
        state.oldHarvest = moment.unix(parseInt(oldHarvest)).fromNow();

        const timeLockVal = await controller.timeLocksecs();
        state.timeLockVal = parseInt(timeLockVal);

        const pendingExp = await hold.toMint();
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
