<template>
  <section class="bg-blue-100 py-16">
    <div
      class=" items-center max-w-6xl px-4 px-10 mx-auto sm:px-20 md:px-32 lg:px-16"
    >
      <div class="grid grid-cols-4 gap-4">
        <div>
          <input
            v-model="betamount"
            type="number"
            step="0.01"
            placeholder="Bet Amount"
            required
            class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
          />
        </div>
        <div>
          <button
            @click="play(2)"
            class="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Play 2X
          </button>
        </div>
        <div>
          <button
            class="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            @click="play(24)"
          >
            Play 4X
          </button>
        </div>
        <div>
          <button
            class="w-full bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            @click="play(10)"
          >
            Play 10X
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { ethers } from "ethers";
import abi from "../assets/game.json";
import holdAbi from "../utils/hold.json";
import { parseEther } from "ethers/lib/utils";

var provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);

const game = new ethers.Contract(
  "0xa6dc7e399f7bafb7dd72f8306b90e95ddac981c1",
  abi,
  provider
);

export default defineComponent({
  data() {
    return { maxbet: 1, betamount: null };
  },
  async mounted() {
    const temp2 = await game.maxbet();
    this.maxbet = (temp2.toString() / 1000000000000000000).toFixed(4) * 0.9;
  },
  methods: {
    async play(betcase) {
      let tempamount = Math.min(this.betamount, this.maxbet);
      let betamount = parseEther(tempamount.toString());

      await window.ethereum.enable();

      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = newProvider.getSigner();

      const gameset = new ethers.Contract(
        "0xa6dc7e399f7bafb7dd72f8306b90e95ddac981c1",
        abi,
        signer
      );

      const hold = new ethers.Contract(
        "0xb5e1f0264e249a593019f3893bd2272fb79bab05",
        holdAbi,
        signer
      );

      try {
        const temp2 = await gameset.bet(betcase, betamount);

        console.log(temp2);
      } catch (e) {
        if (e.code == -32603) {
          const temp1 = await hold.approve(
            "0xa6dc7e399f7bafb7dd72f8306b90e95ddac981c1",
            parseEther("1000")
          );
          console.log(temp1);
        }
      }
    },
  },
});
</script>
