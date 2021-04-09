import { InjectedConnector } from "@web3-react/injected-connector";
import config from "../utils/config";

export const injected = new InjectedConnector({
  supportedChainIds: [config.chainID],
});
