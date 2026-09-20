import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/400-italic.css";
import "@fontsource/ibm-plex-serif/500.css";
import "@fontsource/ibm-plex-serif/600.css";
import { mount } from "svelte";

import "./app.css";
import App from "./App.svelte";

mount(App, { target: document.querySelector("#app")! });
