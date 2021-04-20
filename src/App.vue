<template>
  <Navbar />
  <Token />
  <Tvl />
  <Expansion />
  <Footer />
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Token from "./components/Token";
import Tvl from "./components/Tvl";
import Expansion from "./components/Expansion";


export default {
  name: "App",
  components: {
    Navbar: Navbar,
    Footer: Footer,
    Token: Token,
    Tvl: Tvl,
    Expansion: Expansion,
  },
};
</script>
