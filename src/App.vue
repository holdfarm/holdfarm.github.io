<template>
  <div>
    <Navbar />
    <game />
    <Token />
    <apy />
    <Tvl />
    <Expansion />
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Token from "./components/Token";
import Tvl from "./components/Tvl";
import apy from "./components/apy";
import Expansion from "./components/Expansion";
import game from "./components/game";

export default {
  name: "App",
  components: {
    Navbar: Navbar,
    Footer: Footer,
    Token: Token,
    Tvl: Tvl,
    Expansion: Expansion,
    apy: apy, game: game,
  },
};
</script>
