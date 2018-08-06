import { set } from "./cookies";

//Переписывает параметры ссылки в cookies
export const urlToCookie = url =>
  url
    .split(/\?/)
    .reverse()[0]
    .split(/\&/)
    .map(el => {
      const arr = el.split("=");
      return {
        param: arr[0],
        value: arr[1]
      };
    })
    .map(el => set(el.param, el.value));
