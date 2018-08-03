"use strict";

require("./main.scss");
/* [1]
* Нативный set/get cookies
* */
import { get } from "./utils/cookies";
import { renderForm } from "./forms/test";

const testData = [
  { param: "seat", start: 1, name: "Место", type: "checkbox" },
  { param: "luggage", start: 0, name: "Багаж", type: "checkbox" },
  { param: "meal", start: 0, name: "Питание", type: "checkbox" }
];

const mask = ["seat", "luggage", "meal"];

const situation = arr => {
  return arr.reduce((acc, el) => {
    const result = get(el) ? acc.push(0) : acc.push(1);
    return acc;
  }, []);
};

function handler(e) {
  console.log(e);
}
const inside = situation(mask);
console.log(inside);

var appContainer = document.querySelector("#app");

appContainer.innerHTML = `<div class="boom"><button onclick=handler(e)>Ок</button>${renderForm(
  testData
)}</>`;
