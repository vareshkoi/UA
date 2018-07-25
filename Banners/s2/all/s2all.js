/*Геттеры и сеттеры данных в visitor*/
const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

/* Данные для тестовой таблицы*/
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "promo", start: "", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    start:
      "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018.",
    name: "Описание промокода",
    type: "text"
  },
  { param: "disc", start: 10, name: "Скидка", type: "text" },
  {
    param: "exp",
    start: "15.08.2018",
    name: "Срок действия скидки",
    type: "text"
  },
  {
    param: "expired-bonus",
    start: 0,
    name: "Бонусы, которые сгорят",
    type: "text"
  },
  { param: "bonus", start: 0, name: "Бонусы (ДКЛ)", type: "text" },
  {
    param: "acrl3m-bonus",
    start: 0,
    name: "Бонусы за 3 месяца(неДКЛ)",
    type: "text"
  },
  {
    param: "sensitivitys",
    start: 0,
    name: "Чувствительность",
    type: "checkbox"
  },
  {
    param: "registration",
    start: 0,
    name: "Регистрация < 3м ",
    type: "checkbox"
  },
  { param: "search-from-decod", start: "", name: "Пункт вылета", type: "text" },
  {
    param: "search-to-decod",
    start: "",
    name: "Пункт назначения",
    type: "text"
  },
  {
    param: "search-dep",
    start: "15.06.2018",
    name: "Дата вылета",
    type: "text"
  }
];
//roadmap
/*Массивы вариантов отображения баннеров для ДКЛ и НЕДКЛ*/
const dkl = [
  [
    [0, 0, 0, 0, 0, 1],
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
    [0, 1, 1, 1, 0, 1],
    [0, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 1, 1],
    [0, 1, 1, 0, 0, 1],
    [1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1],
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
const sensitivity = !!get("sensitivitys");
const search_from_decod = get("search-from-decod");
const search_to_decod = get("search-to-decod");
const search_dep = get("search-dep");
const registr = !!get("registration");
const variant = [
  expired_bonus > 0,
  bonus > 10000,
  acrl3m_bonus > 100,
  promo ? promo.length > 0 : 0,
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
        console.log(acc);
        return i > 1 && i !== 5 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);
console.log("research: ", research);

/* Тестовая форма */

/*рендеринг полей формы*/
const dataFields = data => {
  return data.map(el => {
    return el.type === "checkbox" || el.type === "radio"
      ? `<div><label>${el.name}</label><input class=${el.param} name="${
          el.type
        }-group" type=${el.type} ${
          get(el.param) ? "checked" : set(el.param, el.start)
        }>
   </div>`
      : `<div><label>${el.name}</label><input class=${el.param} name="${
          el.type
        }-group" type=${el.type} value=${
          get(el.param) ? get(el.param) : set(el.param) && el.start
        }
   </div>`;
  });
};

/*wrapper тестовой формы*/
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:aircraft_tail-1.png)!\')"><i class='mx-banner-close'>+</i><button class="mx-banner-btn">Продолжить</button></div>`;
const init = () => {
  /*сбор данных из поисковой формы*/
  const selectArea = { val: "" };
  if (location.href === "https://www.uralairlines.ru/") {
    set("search-from-decod", $("[name=origin-city-name]").val());
    set(
      "search-from",
      $("[name=origin-city-name]")
        .next()
        .text()
    );
    // set("search_adlt", $("[name=count-aaa]").val());
    $(".sel_option").on("click", function() {
      selectArea.val = $(this)
        .text()
        .split("\n")[2]
        .split(" ")
        .reverse()[0];
      setTimeout(function() {
        console.log("selArea", selectArea);
        if (
          selectArea.val ===
          $("[name=origin-city-name]")
            .next()
            .text()
        ) {
          set("search-from-decod", $("[name=origin-city-name]").val());
          set("search-from", selectArea.val);
          console.log(get("search-from"));
        } else if (
          selectArea.val ===
          $("[name=destination-city-name]")
            .next()
            .text()
        ) {
          set("search-to", selectArea.val);
          set("search-to-decod", $("[name=destination-city-name]").val());
        }
      }, 1000);
      setTimeout(function() {
        $("#datepicker1").on("change", function() {
          set("search-dep", $("#datepicker1").val());
        });
        $("#datepicker2").on("change", function() {
          set("search-ret", $("#datepicker2").val());
        });
      }, 1000);
    });
  }

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

  console.log(
    "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018."
  );
  /**/

  /*Компоненты баннера*/
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const txt = txt => `<span class="mx-banner-txt">${txt}</span>`;
  const from = `<span class="mx-banner-from">${search_from_decod}</span>`;
  const to = `<span class="mx-banner-to">${search_to_decod}</span>`;
  const fromTo = `<div class="mx-banner-from-to">${from}${to}</span>`;
  const promo = `<span class="mx-banner-promo">${get("promo")}</span>`;
  //const desc = `<span class="mx-banner-desc">Скидка на авиабилет<br>${search_from_decod}-${search_to_decod}</span>`;
  const desc = `<span class="mx-banner-desc">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>`;
  // const disc = `<span class="mx-banner-disc">${get("disc")}%</span>`;
  const disc = `<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
  const exp = `<span class="mx-banner-exp"><br>Количество билетов со скидкой по<br>промокоду ограничено!</span>`;
  const bonuses = `<span class="mx-banner-bonuses">Ваш баланс: ${bonus} бонусов<span>`;
  const profit = burn =>
    `<span class="mx-banner-pretext">Со скидкой</span><span class="mx-banner-profit">${burn}</span>`;
  const light = `<span class="mx-banner-light">* Сгорают в течении 3 месяцев</span>`;
  const offer = `<span class="mx-banner-offer">Билеты по данному направлению<br>пользуются спросом</span>`;
  const burnDKL = `<span class = "mx-banner-burn">${expired_bonus} ₽ сгорают <br> в течение 3-х месяцев</span>`;

  /*отрисовка баннера в соответствии с вариантом research*/
  switch (research) {
    case 0:
      bnr
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(txt("Билеты по данному направлению<br>пользуются спросом"));
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(txt("Продолжите поиск авиабилета<br>вы искали направление"))
        .append(fromTo)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(exp);
      break;
    case 2:
      bnr
        .addClass("__three")
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(exp)
        .append(bonuses);
      break;

    case 3:
      bnr
        .addClass("__four")
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(profit(expired_bonus))
        .append(light)
        .append(offer);
      break;

    case 4:
      bnr
        .addClass("__five")
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(
          `<span class="mx-banner-light">Билеты по данному направлению<br>пользуются спросом<span>`
        )
        .append(txt("Ваш баланс"))
        .append(`<span class="mx-banner-bonuses">${bonus} бонусов<span>`);
      break;

    case 5:
      bnr
        .addClass("__six")
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(profit(acrl3m_bonus))
        .append(
          `<span class="mx-banner-light">*Для того чтобы начислить бонусы<br>за прошлые полеты в течение 3 месяцев<br>зарегистрируйтесь в программе «Крылья»<span>`
        );
      break;
    case 6:
      bnr
        .addClass("__seven")
        .append(txt("Мы сохранили Ваш заказ<br>продолжите покупку"))
        .append(fromTo)
        .append(promo)
        .append(desc)
        .append(disc)
        .append(exp)
        .append(burnDKL);
      break;
  }
  /*адаптивнный текст */
  const arvTxt = $(".mx-banner-to");
  const depTxt = $(".mx-banner-from");
  const bnrW = $(".mx-banner").width();
  const heightK = 1;
  let widthK = 1;

  while (arvTxt.height() > 32) {
    arvTxt.css({
      "font-size": parseInt(arvTxt.css("font-size")) - 2 + "px"
    });
  }
  const arvW = arvTxt.width();
  const depW = depTxt.width();

  depTxt.css({
    "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
  });

  /*Показать баннер*/
  research !== -1
    ? setTimeout(function() {
        console.log("show");
        bnr.addClass("__active");
      }, 1000)
    : null;

  /*Закрыть баннер*/
  $(".mx-banner-close").click(function() {
    $(this)
      .parent()
      .removeClass("__active");
  });

  /*обработчик событий формы*/
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

  /*кнопка баннера со ссылкой*/
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
