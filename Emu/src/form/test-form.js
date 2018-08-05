import { get } from "../utils/cookies";
/* Render Form 1.2.0
* - TODO: toggle button for varieties of data 1.3.0
* - send form handler 1.2.0
* - checkboxes 1.1.0
* - inputs 1.0.0
* */
export const renderForm = data => {
  return `<form onsubmit="return false"  class="test-form"><input type="button" value="Тест" onclick="(param => // send form handler
  Array.from(param).map(el => {
    const type = el.getAttribute('type');
    const name = el.getAttribute('class');
    return type === 'checkbox'
          ? document.cookie = name + '=' + el.checked
          : name !== null ? document.cookie = name + '=' + el.value : ''
  }) && location.reload()
)(this.form.elements)">${data.reduce((acc, el) => {
    const dom = param => {
      let dom = "";
      switch (el.type) {
        case "checkbox":
          dom = `<div><label>${el.name}</label><input class="${el.param}" name="${el.type}-group" type="${el.type}" ${param === "true" ? "checked" : ""}>
   </div>`;
          break;
        case "text":
          dom = `<div><label>${el.name}</label><input class="${el.param}" type="${el.type}" value="${param !== undefined ? param : el.start}">
   </div>`;
          break;
      }
      return dom;
    };
    return acc + dom(get(el.param));
  }, "")}</form>`;
};
