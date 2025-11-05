import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  scroll,
  polygon,
  optimism,
  arbitrum,
  base,
  avalanche,
  sophon,
  kaia,
  sepolia,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  polygonAmoy,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NexusProvider from "@/components/nexus/NexusProvider";
import { AppProvider } from "./AppContext";

// const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const walletConnectProjectId = "5ccff0b96382c3591b17a986fc9b4b11";

const config = getDefaultConfig({
  appName: "Ezpay",
  projectId: walletConnectProjectId,
  chains: [
    mainnet,
    base,
    sophon,
    kaia,
    arbitrum,
    avalanche,
    optimism,
    polygon,
    scroll,
    sepolia,
    baseSepolia,
    arbitrumSepolia,
    optimismSepolia,
    polygonAmoy,
  ],
});

const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <NexusProvider
            config={{
              network: "mainnet",
              debug: true,
            }}
          >
            <AppProvider>{children}</AppProvider>
          </NexusProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
