const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

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
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:sea.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;

const init = () => {
  //
  const body = $("body");
  body.append(banner);

  //dom
  const bnr = $(".mx-banner");
  const fromTo = `<div class="mx-banner-from-to"><span class="mx-banner-from">${
    direction(cityReg, recDir)[0]
  }</span><span class="mx-banner-to">${
    direction(cityReg, recDir)[1]
  }</span></div> `;
  const fromTo_one = `<div class="mx-banner-from-to">${
    direction(cityReg, recDir)[0]
  }-${direction(cityReg, recDir)[1]}</div> `;
  const price = `<span class="mx-banner-price">${get("price")}</span>`;
  const promo = `<span class="mx-banner-promo">${promocd}</span>`;
  const desc = `<span class="mx-banner-desc">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}</span>`;
  const disc = `<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
  const swag = `<span class="mx-banner-swag">${acrl3m_bonus}</span>`;
  const exp = `<span class="mx-banner-exp">Количество билетов со скидкой по<br>промокоду ограничено</span>`;
  const bon = `<span class="mx-banner-bon">Ваш баланс: ${bonus} бонусов</span>`;
  const bon2 = `<span class="mx-banner-bon">Воспользуйтесь скидкой на этот полет<br>Ваш баланс: ${bonus} бонусов</span>`;
  const balance = `<span class="mx-banner-balance">${bonus} Бонусов</span>`;
  const offer = `<span class="mx-banner-offer">Билеты по данному направлению<br>пользуются спросом.<br>Воспользуйтесь скидкой<br>на этот полёт</span>`;
  const offer2 = `<span class="mx-banner-offer">*Для того чтобы начислить бонусы за прошлые полеты<br>в течение 3 месяцев зарегистрируйтесь в программе «Крылья»`;

  console.log(variant, research);
  switch (research) {
    case 0:
      bnr
        .addClass("__one")
        .append(fromTo_one)
        .append(price);
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(fromTo)
        .append(price)
        .append(desc)
        .append(disc)
        .append(promo);
      break;
    case 2:
      bnr
        .addClass("__two")
        .append(fromTo)
        .append(price)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(bon);
      break;
    case 3:
      bnr
        .addClass("__three")
        .addClass("__almost")
        .append(fromTo)
        .append(price)
        .append(bon2);
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

  /*адаптивнный текст */
  if (research !== 0) {
    /*
    * TODO: подогнать под высоту текста скидки
    * */
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
    const bnrH = $(".mx-banner-from-to").width();
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

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
