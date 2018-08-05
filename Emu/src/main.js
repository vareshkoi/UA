"use strict";

import { renderForm } from "./form/test-form";
import { data } from "./data/test-data";
import { get } from "./utils/cookies";
import { urlToCookie } from "./utils/urlparser";

require("./main.scss");

// Точка входа
const appContainer = document.querySelector("#app");

//Парсим URL
urlToCookie(document.location.href);

appContainer.innerHTML = `<div class="main-component">${
  get("testform") === "on" ? renderForm(data) : ""
}</div>`;
