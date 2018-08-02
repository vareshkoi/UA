const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "dkl-lvl", start: "Синий", name: "Уровень ДКЛ", type: "text" },
  { param: "promocode", start: "S548dft57F", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    name: "Описание промокода",
    type: "text",
    start: "Скидка на_доп. услуги 10%"
  },
  { param: "tbd", start: 40, name: "Часов до вылета", type: "text" },
  { param: "seat-flg", start: 0, name: "Место", type: "checkbox" },
  { param: "luggage-flg", start: 0, name: "Багаж", type: "checkbox" },
  { param: "meal-flg", start: 0, name: "Питание", type: "checkbox" }
];

/* Тестовая форма */
// рендеринг полей формы
const dataFields = data => {
  return data.reduce((acc, el) => {
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

// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

/* Готовим данные */

// распаковываем из кук
const dispatch = names => {
  return names.reduce((acc, el) => {
    get(el) ? acc.push(1) : acc.push(0);
    return acc;
  }, []);
};

// NEXT >>>
const next = (index, size) => {
  let next = index + 1;
  return next < size ? next : 0;
};

let flgs = ["seat-flg", "luggage-flg", "meal-flg"];

// если < 36 часов, то не предлагаем пищу
flgs = get("tbd") < 36 ? flgs.slice(0, 2) : flgs;
let arr = dispatch(flgs);

// ищем флаги 0
let choises = arr.toString().match(/0/gi);
choises = !choises ? 0 : choises.length;

// карусель
const whirligig = size => {
  const index = get("index") === undefined ? 0 : next(get("index"), size);
  set("index", index);
  return index;
};

// качели
const swing = flgs => {
  const reverse = get("reverse") ? 0 : 1;
  const _flgs = reverse ? flgs.reverse() : flgs;
  set("reverse", reverse);
  return _flgs[0];
};

let result;

switch (choises) {
  case 0:
    result = "nothing";
    break;
  case 1:
    result = flgs[arr.indexOf(0)];
    break;
  case 2:
    result = swing(flgs); //
    break;
  case 3:
    result = flgs[whirligig(arr.length)];
    break;
}

const descriptionParse = text => {
  const discount = text.match(/\d+\%/g).toString(); // ищем скидку
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

//dom
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const current = result;
  const head = `<span class="mx-banner-head">Добавьте комфорта в Ваш перелет</span>`;
  // для всех
  if (current === "seat-flg") {
    bnr.append(
      `${head}<span class="mx-banner-text">Выберите кресло</span><span class="mx-banner-price">500</span>`
    );
  } else if (current === "luggage-flg") {
    bnr.append(
      `${head}<span class="mx-banner-text">Оформите доп. багаж</span><span class="mx-banner-price">1000</span>`
    );
  } else if (current === "meal-flg") {
    bnr.append(
      `${head}<span class="mx-banner-text">Скидки на питание</span><span class="mx-banner-price">200</span>`
    );
  } else {
    bnr.addClass("__not");
  }

  // если ДКЛ
  if (get("it-is-dkl")) {
    bnr.append(
      `<span class='mx-banner-promo'>${get(
        "promocode"
      )}</span><span class='mx-banner-desc-text'>${descriptionParse(
        get("desc-promo")
      ).discountText.replace(
        /_/gi,
        "<br>"
      )}</span><span class='mx-banner-desc'>${
        descriptionParse(get("desc-promo")).discount
      }</span>`
    );
  }

  // show
  setTimeout(function() {
    if (get("it-is-dkl") && get("dkl-lvl") === "Синий") {
      $(".mx-banner").addClass("__active");
    } else if (!get("it-is-dkl")) {
      $(".mx-banner").addClass("__active");
    }
  }, 1000);

  // hide
  $(".mx-banner-close").click(function() {
    $(this)
      .parent()
      .removeClass("__active");
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

  /* TODO: собрать линк и отдать в cеттер -->>> set(name, val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};

events.domReady(init);
