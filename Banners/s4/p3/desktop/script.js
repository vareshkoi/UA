const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

/*
* TEST FORM
* */

// Interface
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  {
    param: "registration",
    start: 2,
    name: "Регистрация (месяцев назад)",
    type: "text"
  },
  {
    param: "recom-from",
    start: "Москва",
    name: "Рекоменд. направление откуда",
    type: "text"
  },
  {
    param: "recom-to",
    start: "Санкт-Петербург",
    name: "Рекоменд. направление куда",
    type: "text"
  },
  { param: "promo", start: "S548dft57F", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    start:
      "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018.",
    name: "Описание промокода",
    type: "text"
  },
  {
    param: "price",
    start: 6589,
    name: "Цена",
    type: "text"
  }
];

// Render
const dataFields = data => {
  return data.reduce((acc, el) => {
    const dom = param => {
      return el.type === "checkbox" || el.type === "radio"
        ? `<div><label>${el.name}</label><input class="${el.param}" name="${
            el.type
          }-group" type="${el.type}" ${param ? "checked" : ""}>
   </div>`
        : `<div><label>${el.name}</label><input class="${el.param}" type="${
            el.type
          }" value="${param !== undefined ? param : el.start}">
   </div>`;
    };
    return acc + dom(get(el.param));
  }, "");
};

// Wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

/*
* END OF TEST FORM
* */

//roadmap
const dkl = [
  [[1, 0, 1, 1], [1, 1, 1, 1]],
  [[0, 0, 1, 0], [0, 1, 0, 1], [1, 0, 0, 0], [1, 1, 1, 0]]
];
const nodkl = [[[0, 1, 1, 1]]];

//поиск соответсвий
const matchSearch = (x, arr) => {
  let result = -1;
  console.log(arr);
  arr.map((row, i) => {
    return row.map(col => {
      return col.toString() === x.toString() ? (result = i) : null;
    });
  });
  return result;
};

/* Готовим данные */

const recom_from = get("recom-from");
const recom_to = get("recom-to");
const registration = get("registration");
const promocd = get("promo");
const sensitivity = true; //расчитать и после get("sensitivity")

const variant = [
  registration < 3,
  sensitivity === true,
  [
    recom_from !== undefined ? (recom_from.length !== 0 ? 1 : 0) : 0,
    recom_to !== undefined ? (recom_to.length !== 0 ? 1 : 0) : 0
  ].reduce((acc, el) => {
    return el === 1 ? acc.concat(el) : acc;
  }, []).length === 2
    ? 1
    : 0,
  promocd ? promocd.length > 0 : 0
].map(el => {
  return el ? 1 : 0;
});

const research = matchSearch(variant, get("it-is-dkl") ? dkl : nodkl);

const descriptionParse = text => {
  const discount = text.match(/\d+\%/g); // ищем скидку
  discount !== null ? discount.toString() : "";
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

// DOM
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:cookies.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const content = `<span class="mx-banner-head">Пора задуматься<br>о новой поездке</span><span class="mx-banner-promo">${promocd}</span><span class="mx-banner-route">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>
<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span><span class="mx-banner-desc">Количество билетов со скидкой по<br>промокоду ограничено!</span>`;
  const noPromo = `<span class="mx-banner-head">Пора задуматься<br>о новой поездке</span><div class="mx-banner-from-to"> <span class="mx-banner-from"">${get(
    "recom-from"
  )}</span> <span class="mx-banner-to">${get(
    "recom-to"
  )}</span></div><span class="mx-banner-price">${get("price")}</span>`;
  if (promocd) {
    bnr.append(content);
  } else {
    bnr.append(noPromo);
  }
  // show
  setTimeout(function() {
    bnr.addClass("__active");
  }, 1000);

  // hide
  $(".mx-banner-close").click(function() {
    $(this)
      .parent()
      .removeClass("__active");
  });

  // adaptive text
  const arvTxt = $(".mx-banner-to");
  const depTxt = $(".mx-banner-from");
  const bnrH = $(".mx-banner").width();
  const arvH = arvTxt.width();
  const heightK = 0.6;
  let widthK = 1;

  arvH > bnrH ? (widthK = bnrH / arvH) : null;

  arvTxt.css({
    "font-size": parseInt(arvTxt.css("font-size")) * widthK + "px"
  });

  depTxt.css({
    "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
  });

  // обработчик событий формы
  $(".ok-test").click(e => {
    e.preventDefault();
    return (
      $(".test-data-form input").map((i, _) => {
        const el = $(_),
          type = el.attr("type"),
          name = el.attr("class");
        return type === "checkbox"
          ? el.is(":checked") ? set(name, true) : set(name, false)
          : set(name, el.val());
      }) && location.reload()
    );
  });

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
