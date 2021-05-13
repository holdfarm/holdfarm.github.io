<template>
  <section class="bg-gray-100 py-16">
    <div
      class=" items-center max-w-6xl px-4 px-10 mx-auto sm:px-20 md:px-32 lg:px-16"
    >
      <div class="grid grid-cols-3 gap-4">
        <div>
          <div class="mb-6">
            <label class="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              >Bet Amount
            </label>
            <input
              v-model="betamount"
              type="number"
              step="0.01"
              placeholder="Bet Amount"
              required
              class="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
            />
          </div>
        </div>
        <div>
          <label class="block mb-2 text-sm text-gray-600 dark:text-gray-400">
            Maxbet :
          </label>
          {{ maxbet }}
        </div>
      </div>
      <div>
        <button
          class=" px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          @click="play(2)"
        >
          Play 2X
        </button>
        <button
          class=" px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          @click="play(24)"
        >
          Play 4X
        </button>
        <button
          class=" px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none"
          @click="play(10)"
        >
          Play 10X
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import { ethers } from "ethers";
import abi from "../assets/game.json";
import holdAbi from "../utils/hold.json";

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
    return { maxbet: 1, betamount: 0 };
  },
  async mounted() {
    const temp2 = await game.maxbet();
    this.maxbet = (temp2.toString() / 10000000000000000).toFixed(4);
  },
  methods: {
    async play(betcase) {
      if (this.betamount < this.maxbet) {
        let betamount = this.betamount;

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
              betamount
            );
            console.log(temp1);
          }
        }
      }
    },
  },
});
</script>
