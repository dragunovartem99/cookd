import "@fontsource-variable/source-serif-4";
import { mount } from "svelte";

import "./app.css";
import App from "./App.svelte";

mount(App, { target: document.querySelector("#app")! });
