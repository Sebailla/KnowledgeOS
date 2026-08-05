import { env } from "node:process";
import {
  MasterLibraryTransport,
  type MasterLibraryConnectionConfiguration,
} from "@knowledgeos/sync";

let configuration:
  MasterLibraryConnectionConfiguration = {
    baseURL:
      env.KNOWLEDGEOS_MASTER_LIBRARY_URL ??
      "http://127.0.0.1:8787",
    ...(env.KNOWLEDGEOS_MASTER_LIBRARY_TOKEN
      ? {
          token:
            env.KNOWLEDGEOS_MASTER_LIBRARY_TOKEN,
        }
      : {}),
  };

export function transportConfiguration() {
  return configuration;
}

export function saveTransportConfiguration(
  value: MasterLibraryConnectionConfiguration,
) {
  configuration = value;
  return configuration;
}

export function masterLibraryTransport() {
  return new MasterLibraryTransport(
    configuration,
  );
}
