import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  frameworks: ["react"],
  aliases: {
    "@components": resolve(__dirname, "../components"),
    "@docs": resolve(__dirname, "./"),
    "@fea-lib/values": resolve(__dirname, "../libs/fea-lib/values/src/index.ts"),
    "@fea-lib/jscad": resolve(__dirname, "../libs/fea-lib/jscad/src/index.ts"),
  },
};
