const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);
//data
//
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  {
    param: "sensitiveness",
    start: 1,
    name: "Чувствтельность",
    type: "checkbox"
  },
  {
    param: "city-reg",
    start: "Москва",
    name: "Город регистрации",
    type: "text"
  },
  {
    param: "rec-dir",
    start: "Москва-Уфа, Сочи-Москва, Санкт-Петербург-Сочи",
    name: "Рекомендованные направления",
    type: "text"
  },
  {
    param: "price",
    start: 3000,
    name: "Цена",
    type: "text"
  },
  {
    param: "acrl3m-bonus",
    start: 0,
    name: "Бонусы за 3 месяца (неДКЛ)",
    type: "text"
  },
  { param: "bonus", start: 0, name: "Бонусы (ДКЛ)", type: "text" },
  {
    param: "registration",
    start: "3",
    name: "Сколько месяцев назад зарег-ся",
    type: "text"
  },
  { param: "promocd", start: "S548dft57F", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    start:
      "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018.",
    name: "Описание промокода",
    type: "text"
  }
];

//roadmap
const dkl = [
  [
    [0, 1, 0, 0, 1],
    [0, 0, 1, 0, 1],
    [0, 1, 1, 0, 1],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1]
  ],
  [[0, 1, 0, 1, 1], [0, 0, 1, 1, 1], [0, 1, 1, 1, 1]],
  [[1, 1, 0, 1, 1], [1, 0, 1, 1, 1], [1, 1, 1, 1, 1]],
  [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1]
  ],
  [[]]
];
const nodkl = [
  [[0, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1]],
  [[0, 1, 1, 1]],
  [[]],
  [[]],
  [[1, 0, 0, 1], [1, 1, 0, 1], [1, 0, 1, 1], [1, 1, 1, 1]]
];

//поиск соответсвий
// console.log("arr", arr);
const matchSearch = (x, arr) => {
  let result = -1;
  arr.map((row, i) => {
    return row.map(col => {
      return col.toString() === x.toString() ? (result = i) : null;
    });
  });
  return result;
};

/* Готовим данные */

const acrl3m_bonus = get("acrl3m-bonus");
const bonus = Number(get("bonus"));
const registration = Number(get("registration"));
const sensitivity = get("sensitiveness");
const promocd = get("promocd");
//
const cityReg = get("city-reg");
const recDir = get("rec-dir");
//

const variant = [
  acrl3m_bonus > 100,
  bonus > 10000,
  registration <= 3,
  sensitivity ? 1 : 0,
  promocd !== undefined ? (promocd.length > 0 ? 1 : 0) : 0,
  [
    cityReg !== undefined ? (cityReg.length !== 0 ? 1 : 0) : 0,
    recDir !== undefined ? (recDir.length !== 0 ? 1 : 0) : 0
  ].reduce((acc, el) => {
    return el === 1 ? acc.concat(el) : acc;
  }, []).length === 2
    ? 1
    : 0
].map(el => {
  return el ? 1 : 0;
});
console.log("variant", variant);
const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i === 0 ? acc : acc.concat(el);
      }, [])
    : variant.reduce((acc, el, i) => {
        return i >= 1 && i <= 2 ? acc : acc.concat(el);
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);
console.log("research", research);

// Рекомендованное направлениец v1
/*
* TODO: v2 - требуется доработка под JSON (формат рекомендованных направлений заисан в массив)
* */

const direction = (x, arr) => {
  let result = "";
  if (!!x && !!arr) {
    result = arr.split(",").reduce((acc, val) => {
      val.split("-")[0] === x ? acc.push(val) : acc;
      return acc;
    }, []);
  }
  return result.length > 0 ? result[0].split("-") : "";
};

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

const descriptionParse = text => {
  const discount = text.match(/\d+\%/g).toString(); // ищем скидку
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

console.log(
  "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018."
);

/**/

// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

//dom
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:sea.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;

const init = () => {
  //
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);

  //dom
  const bnr = $(".mx-banner");
  const fromTo = `<div class="mx-banner-from-to"><span class="mx-banner-from">${
    direction(cityReg, recDir)[0]
  }</span><span class="mx-banner-to">${
    direction(cityReg, recDir)[1]
  }</span></div> `;
  const price = `<span class="mx-banner-price">${get("price")}</span>`;
  const promo = `<span class="mx-banner-promo">${promocd}</span>`;
  const desc = `<span class="mx-banner-desc">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>`;
  const disc = `<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
  const swag = `<span class="mx-banner-swag">${acrl3m_bonus}</span>`;
  const exp = `<span class="mx-banner-exp">Количество билетов со скидкой по<br>промокоду ограничено</span>`;
  const bon = `<span class="mx-banner-bon">Ваш баланс: ${bonus} бонусов</span>`;
  const balance = `<span class="mx-banner-balance">${bonus} Бонусов</span>`;
  const offer = `<span class="mx-banner-offer">Билеты по данному направлению<br>пользуются спросом.<br>Воспользуйтесь скидкой<br>на этот полёт</span>`;
  const offer2 = `<span class="mx-banner-offer">*Для того чтобы начислить бонусы<br>за прошлые полеты в течение 3 месяцев<br>зарегистрируйтесь в программе «Крылья»`;

  switch (research) {
    case 0:
      bnr
        .addClass("__one")
        .append(fromTo)
        .append(price);
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(fromTo)
        .append(price)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(exp);
      break;
    case 2:
      bnr
        .addClass("__three")
        .append(fromTo)
        .append(price)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(exp)
        .append(bon);
      break;
    case 3:
      bnr
        .addClass("__four")
        .append(fromTo)
        .append(price)
        .append(offer)
        .append(balance);
      break;
    case 4:
      bnr
        .addClass("__five")
        .append(fromTo)
        .append(price)
        .append(swag)
        .append(offer2);
      break;
  }

  // adaptive text
  const arvTxt = $(".mx-banner-to");
  const depTxt = $(".mx-banner-from");
  const bnrW = $(".mx-banner").width();
  const heightK = 0.8;
  let widthK = 1;

  while (arvTxt.height() > 32) {
    arvTxt.css({ "font-size": parseInt(arvTxt.css("font-size")) - 2 + "px" });
  }
  const arvW = arvTxt.width();
  const depW = depTxt.width();

  depTxt.css({
    "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
  });
  // show
  research > -1
    ? setTimeout(function() {
        console.log("show");
        bnr.addClass("__active");
      }, 1000)
    : null;

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

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
