import { Contract } from "@ethersproject/contracts";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { useEffect, useMemo, useState } from "react";
import config from "../utils/config.json";
import controllerAbi from "../utils/controller.json";
import holdAbi from "../utils/hold.json";
import routerAbi from "../utils/router.json";
import farmAbi from "../utils/farm.json";
import { injected } from "./connectors";

import { ethers } from "ethers";
import web3 from "web3";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");

    if (wallet === "Injected") {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    }
  }, [activate, active]);

  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);
  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };

      const handleChainChanged = (chainId) => {
        console.log("chainChanged", chainId);
        activate(injected);
      };

      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };

      const handleNetworkChanged = (networkId) => {
        console.log("networkChanged", networkId);
        activate(injected);
      };
      ethereum.on("connect", handleConnect);
      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("connect", handleChainChanged);
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }

    return () => {};
  }, [active, error, suppress, activate]);
}

export function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return `You're connected to an unsupported network. Please, change network to Binance Smart Chain.`;
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export function useControllerContract() {
  return useMemo(() => {
    const currentProvider = new web3.providers.HttpProvider(
      "https://bsc-dataseed1.binance.org:443"
    );
    const web3Provider = new ethers.providers.Web3Provider(currentProvider);
    try {
      return new Contract(
        config.CONTROLLER_CONTRACT_ADDRESS,
        controllerAbi,
        web3Provider
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, []);
}

export function useHoldContract() {
  return useMemo(() => {
    const currentProvider = new web3.providers.HttpProvider(
      "https://bsc-dataseed1.binance.org:443"
    );
    const web3Provider = new ethers.providers.Web3Provider(currentProvider);
    try {
      return new Contract(config.HOLD_CONTRACT_ADDRESS, holdAbi, web3Provider);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, []);
}

export function useRouterContract() {
  return useMemo(() => {
    const currentProvider = new web3.providers.HttpProvider(
      "https://bsc-dataseed1.binance.org:443"
    );
    const web3Provider = new ethers.providers.Web3Provider(currentProvider);
    try {
      return new Contract(
        config.PANCAKE_ROUTER_CONTRACT_ADDRESS,
        routerAbi,
        web3Provider
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, []);
}

export function useFarmContract() {
  return useMemo(() => {
    const currentProvider = new web3.providers.HttpProvider(
      "https://bsc-dataseed1.binance.org:443"
    );
    const web3Provider = new ethers.providers.Web3Provider(currentProvider);
    try {
      return new Contract(
        config.FARM_CONTRACT,
        farmAbi,
        web3Provider
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, []);
}

export function useControllerActionContract() {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    try {
      return new Contract(
        config.CONTROLLER_CONTRACT_ADDRESS,
        controllerAbi,
        library.getSigner(account).connectUnchecked()
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [library, account]);
}
