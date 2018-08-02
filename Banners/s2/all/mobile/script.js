/*Геттеры и сеттеры данных в visitor*/
const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

/*Массивы вариантов отображения баннеров для ДКЛ и НЕДКЛ*/
const dkl = [
  [
    [0, 0, 0, 0, 0, 1],
    [0, 0, 1, 0, 0, 1],
    [0, 0, 0, 1, 0, 1],
    [0, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1]
  ],
  [
    [0, 0, 1, 1, 0, 1],
    [0, 0, 1, 0, 1, 1],
    [0, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 1, 1]
  ],
  [
    [0, 1, 1, 1, 0, 1],
    [0, 1, 1, 0, 1, 1],
    [0, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 1, 1]
  ],
  [
    [1, 0, 0, 0, 1, 1],
    [1, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1],
    [1, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1]
  ],
  [
    [0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1, 1],
    [0, 1, 0, 0, 1, 1],
    [0, 1, 0, 0, 0, 1],
    [1, 1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1, 1],
    [1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 1],
    [1, 1, 1, 0, 0, 1]
  ],
  [[]],
  [[1, 0, 1, 1, 0, 1], [1, 0, 1, 0, 1, 1], [1, 0, 1, 1, 1, 1]]
];
const nodkl = [
  [[0, 0, 0, 1], [0, 0, 1, 1]],
  [[0, 1, 1, 1], [1, 1, 1, 1]],
  [[]],
  [[]],
  [[]],
  [[1, 0, 1, 1], [1, 0, 0, 1]],
  [[]]
];

/*поиск соответсвий*/
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

const expired_bonus = Number(get("expired-bonus"));
const bonus = Number(get("bonus"));
const acrl3m_bonus = Number(get("acrl3m-bonus"));
const promo = get("promo");
const sensitivity = !!get("sensitiveness");
const search_from_decod = get("search-from-decod");
const search_to_decod = get("search-to-decod");
const search_dep = get("search-dep");
const registr = !!get("registration");
const variant = [
  expired_bonus > 0,
  bonus > 10000,
  acrl3m_bonus > 100,
  promo !== undefined ? (promo.length > 0 ? promo : 0) : 0,
  sensitivity === true,
  registr === true,
  [
    search_from_decod !== undefined
      ? search_from_decod.length !== 0 ? 1 : 0
      : 0,
    search_to_decod !== undefined ? (search_to_decod.length !== 0 ? 1 : 0) : 0,
    search_dep !== undefined ? (search_dep.length !== 0 ? 1 : 0) : 0
  ].reduce((acc, el) => {
    return el === 1 ? acc.concat(el) : acc;
  }, []).length === 3
    ? 1
    : 0
].map(el => (el ? 1 : 0));
console.log("variant: ", variant);
/*Анализ переменных и поиск соответствующего массива*/
const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i === 2 ? acc : acc.concat(el);
      }, [])
    : variant.reduce((acc, el, i) => {
        return i > 1 && i !== 5 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:aircraft_tail-1.png)!\')"><i class='mx-banner-close'>+</i><button class="mx-banner-btn">Продолжить</button></div>`;
const init = () => {
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
  /**/

  /*Компоненты баннера*/
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const txt = txt => `<span class="mx-banner-txt">${txt}</span>`;
  const from = `<span class="mx-banner-from">${search_from_decod}</span>`;
  const to = `<span class="mx-banner-to">${search_to_decod}</span>`;
  const fromTo = `<div class="mx-banner-from-to">${from}<br>${to}</span>`;
  const fromTo2 = `<div class="mx-banner-from-to">${from} - ${to}</span>`;
  const promo = `<span class="mx-banner-promo">${get("promo")}</span>`;
  const desc = `<span class="mx-banner-desc">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>`;
  const disc = `<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
  const exp = `<span class="mx-banner-exp">Количество билетов со скидкой по<br>промокоду ограничено!</span>`;
  const bonuses = `<span class="mx-banner-bonuses">Ваш баланс: ${bonus} бонусов<span>`;
  const profit = burn =>
    `<span class="mx-banner-pretext">Со скидкой</span><span class="mx-banner-profit">${burn}</span>`;
  const profit2 = burn => `<span class="mx-banner-profit">${burn}</span>`;
  const light = `<span class="mx-banner-light">* Сгорают в течении 3 месяцев</span>`;
  const offer = `<span class="mx-banner-offer">Билеты по данному направлению<br>пользуются спросом</span>`;
  const burnDKL = `<span class="mx-banner-burn">${expired_bonus} ₽ сгорают в течение 3-х месяцев</span>`;
  console.log(research);

  /*отрисовка баннера в соответствии с вариантом research*/
  switch (research) {
    case 0:
      bnr
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(txt("Вы искали направление"))
        .append(fromTo)
        .append(promo);
      break;
    case 2:
      bnr
        .addClass("__three")
        .append(txt("Вы искали направление"))
        .append(fromTo)
        .append(promo)
        .append(bonuses);
      break;

    case 3:
      bnr
        .addClass("__four")
        .append(txt("Мы сохранили Ваш заказ"))
        .append(fromTo2)
        .append(profit(expired_bonus))
        .append(light);
      break;

    case 4:
      bnr
        .addClass("__three")
        .addClass("__almost")
        .append(txt("Вы искали направление"))
        .append(fromTo)
        .append(bonuses);
      break;

    case 5:
      bnr
        .addClass("__six")
        .append(fromTo)
        .append(profit2(acrl3m_bonus));
      break;
    case 6:
      bnr
        .addClass("__seven")
        .append(txt("Мы сохранили Ваш заказ"))
        .append(fromTo2)
        .append(promo)
        .append(burnDKL);
      break;
  }
  if (research === 3 || research === 5) {
    /*адаптивнный текст */
    const arvTxt = $(".mx-banner-to");
    const depTxt = $(".mx-banner-from");
    const heightK = 1;

    while (arvTxt.height() > 32) {
      arvTxt.css({
        "font-size": parseInt(arvTxt.css("font-size")) - 2 + "px"
      });
    }
    depTxt.css({
      "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
    });
  } else {
    // adaptive text
    const arvTxt = $(".mx-banner-to");
    const depTxt = $(".mx-banner-from");
    const bnrH = $(".mx-banner").width();
    const arvH = arvTxt.width();
    const depH = depTxt.width();
    const heightK = 0.6;
    let widthK = 1;

    arvH > bnrH ? (widthK = bnrH / arvH) : null;

    arvTxt.css({
      "font-size": parseInt(arvTxt.css("font-size")) * widthK + "px"
    });

    depTxt.css({
      "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
    });
  }

  /*Показать баннер*/
  research !== -1
    ? setTimeout(function() {
        bnr.addClass("__active");
      }, 1000)
    : null;

  /*Закрыть баннер*/
  $(".mx-banner-close").click(function() {
    $(this)
      .parent()
      .removeClass("__active");
  });

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  /*кнопка баннера со ссылкой*/
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
