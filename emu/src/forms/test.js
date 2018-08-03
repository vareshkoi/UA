import { set, get } from "../utils/cookies";

export const renderForm = data => {
  return data.reduce((acc, el) => {
    console.log(el);
    const dom =
      el.type === "checkbox" || el.type === "radio"
        ? `<div><label>${el.name}</label><input class="${el.param}" name="${
            el.type
          }-group" type="${el.type}" ${
            get(el.param) ? "checked" : set(el.param, el.start)
          }>
   </div>`
        : `<div><label>${el.name}</label><input class="${el.param}" name="${
            el.type
          }-group" type="${el.type}" value="${
            get(el.param) ? get(el.param) : set(el.param, el.start) && el.start
          }"
   </div>`;
    return acc + dom;
  }, "");
};
