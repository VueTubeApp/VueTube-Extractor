import ytClient from "./ytClient";

type ytContext = {
  client: ytClient;
  user: { lockedSafetyMode: boolean };
  request: { useSsl: boolean };
};

export default ytContext;
