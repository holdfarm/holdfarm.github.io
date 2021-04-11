<template>
  <Navbar />
  <Icons />
  <Token />
  <Tvl />
  <Expansion />
  <FAQ />
  <Footer />
</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Token from "./components/Token";
import Tvl from "./components/Tvl";
import Expansion from "./components/Expansion";
import Icons from "./components/Icons";
import FAQ from "./components/FAQ";

export default {
  name: "App",
  components: {
    Navbar: Navbar,
    Footer: Footer,
    Token: Token,
    Tvl: Tvl,
    Expansion: Expansion,
    Icons: Icons,
    FAQ: FAQ,
  },
};
</script>
