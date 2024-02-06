import { defineManifest } from "@crxjs/vite-plugin";
import packageData from "../package.json" assert { type: "json" };

export default defineManifest({
  name: packageData.name,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: "img/logo.png",
    32: "img/logo.png",
    48: "img/logo.png",
    128: "img/logo.png",
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo.png",
  },
  options_page: "options.html",
  devtools_page: "devtools.html",
  background: {
    service_worker: "src/background/index.js",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*"],
      js: ["src/contentScript/index.js"],
    },
  ],
  side_panel: {
    default_path: "sidepanel.html",
  },
  web_accessible_resources: [
    {
      resources: [
        "img/logo.png",
        "img/logo.png",
        "img/logo.png",
        "img/logo.png",
      ],
      matches: [],
    },
  ],
  permissions: ["sidePanel", "storage"],
  chrome_url_overrides: {
    newtab: "newtab.html",
  },
});
