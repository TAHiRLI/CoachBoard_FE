import { FlagProvider } from "@unleash/proxy-client-react";
import { PropsWithChildren } from "react";

const unleashConfig = {
  url: "https://unleash.coachboard.az/api/frontend",
  clientKey: import.meta.env.VITE_UNLEASH_APIKEY,
  appName: "coachboard-react",
  refreshInterval: 60,
};

export const FeatureFlagsProvider = ({ children }: PropsWithChildren) => {
  return <FlagProvider config={unleashConfig}>{children}</FlagProvider>;
};
