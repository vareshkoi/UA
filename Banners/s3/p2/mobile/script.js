const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "bonus", start: "0", name: "Бонусы (ДКЛ)", type: "text" },
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
    param: "registration",
    start: "3",
    name: "Сколько месяцев назад зарег-ся",
    type: "text"
  },
  {
    param: "acrl3m-bonus",
    start: "0",
    name: "Бонусы за 3м (не ДКЛ)",
    type: "text"
  },
  { param: "promocd", start: "S548dft57F", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    start:
      "Скидка_на первую_покупку 10% Действует до 15.08.2018._Количество билетов со скидкой по_промокоду ограничено!",
    name: "Описание промокода",
    type: "text"
  },
  { param: "price", start: 2999, name: "Тариф", type: "text" }
];

//roadmap
const dkl = [[[1, 1, 1]], [[1, 1, 0]], [[1, 0, 1]], [[1, 0, 0]], [[]], [[]]];
const nodkl = [[[]], [[]], [[]], [[]], [[1, 0]], [[1, 1]]];

//

const descriptionParse = text => {
  const discount = text.match(/\d+\%/g).toString(); // ищем скидку
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

//поиск соответсвий
const matchSearch = (x, arr) => {
  let result = -1;
  arr.map((row, i) => {
    return row.map(col => {
      return col.toString() === x.toString() ? (result = i) : null;
    });
  });
  return result;
};

//
const acrl3m_bonus = Number(get("acrl3m-bonus"));
const bonus = Number(get("bonus"));
const promocd = get("promocd");
const reg = get("registration");
const variant = [
  acrl3m_bonus > 100,
  reg !== undefined ? (Number(reg) < 2 ? 1 : 0) : 1,
  bonus > 100,
  promocd
].map(el => {
  return el ? 1 : 0;
});
const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i !== 0 ? acc.concat(el) : acc;
      }, [])
    : variant.reduce((acc, el, i) => {
        return i !== 1 && i !== 2 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);

const cityReg = get("city-reg");
const recDir = get("rec-dir");

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

/**/
// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:river.jpg)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const from = `<span class="mx-banner-from">${
    direction(cityReg, recDir)[0]
  }</span>`;
  const to = `<span class="mx-banner-to">${
    direction(cityReg, recDir)[1]
  }</span>`;
  const fromTo = `<span class="mx-banner-from-to">${
    direction(cityReg, recDir)[0]
  } - ${direction(cityReg, recDir)[1]} </span>`;
  const price = `<span class="mx-banner-price">${get("price")}</span>`;
  const promo = `<span class="mx-banner-promo">${promocd}<span>`;
  const profit = `<center><span class="mx-banner-profit">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span><span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span></center>`;
  const balance = `<span class="mx-banner-balance">Ваш баланс: ${bonus} бонусов</span>`;
  const balance2 = `<span class="mx-banner-balance">Ваш баланс:<br>${bonus} бонусов</span>`;
  const noDkl = `<span class="mx-banner-nodkl">${acrl3m_bonus}</span>`;
  const txt = txt => `<span class="mx-banner-text">${txt}</span>`;
  console.log(variant, research);
  switch (research) {
    case 0:
      bnr
        .append(promo)
        .append(profit)
        .append(balance);
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(fromTo)
        .append(price)
        .append(balance2);
      break;
    case 2:
      bnr
        .addClass("__three")
        .append(promo)
        .append(profit);
      break;
    case 3:
      bnr
        .addClass("__two")
        .append(fromTo)
        .append(price);
      break;
    case 4:
      bnr
        .addClass("__two")
        .addClass("__center-btn")
        .append(fromTo)
        .append(noDkl);
      break;
    case 5:
      bnr
        .addClass("__four")
        .append(promo)
        .append(noDkl);
      break;
  }

  // // adaptive text
  // const arvTxt = $(".mx-banner-to");
  // const depTxt = $(".mx-banner-from");
  // const heightK = 0.4;
  //
  // while (arvTxt.height() > 50) {
  //   arvTxt.css({ "font-size": parseInt(arvTxt.css("font-size")) - 2 + "px" });
  // }
  //
  // depTxt.css({
  //   "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
  // });

  // show
  research > -1
    ? setTimeout(function() {
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
