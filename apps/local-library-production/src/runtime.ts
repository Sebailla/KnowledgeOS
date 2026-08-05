import { loadLocalLibraryConfiguration } from "./config.js";
import { startLocalLibrary } from "./composition.js";
const library = await startLocalLibrary(loadLocalLibraryConfiguration(process.env));
await library.runMaintenance();
const stop = () => { library.close(); process.exit(0); };
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
setInterval(() => void library.runMaintenance(), 60 * 60 * 1000);
