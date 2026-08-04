import { MacOSCoreHost } from "./host.js";

const host = new MacOSCoreHost();

process.once(
  "SIGINT",
  () => void host.stop().then(
    () => process.exit(0),
  ),
);

process.once(
  "SIGTERM",
  () => void host.stop().then(
    () => process.exit(0),
  ),
);

await host.start();
