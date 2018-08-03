const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

/*
* TEST FORM
* */

// Interface
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "one-way", start: 0, name: "В один конец", type: "checkbox" },
  { param: "bonuses", start: 0, name: "Бонусы", type: "text" },
  {
    param: "points",
    start: 0,
    name: "Бонусы за 3 месяца (для не ДКЛ)",
    type: "text"
  },
  { param: "burn", start: 0, name: "к Сгоранию", type: "text" },
  { param: "promocode", start: "S548dft57F", name: "Промокод", type: "text" },
  {
    param: "desc-promo",
    start:
      "Скидка на авиабилет_Москва-Санкт-Петербург 10% Действует до 15.08.2018.",
    name: "Описание промокода",
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

// Roadmap
const dkl = [
  [[0, 0, 0, 0, 0]],
  [[1, 0, 0, 0, 1], [1, 0, 0, 1, 1]],
  [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 1, 0, 0, 1], [0, 1, 0, 1, 1]],
  [[0, 0, 1, 1, 0], [0, 0, 1, 1, 1]],
  [[]]
];
const nodkl = [
  [[0, 0, 0, 0]],
  [[1, 0, 0, 1], [1, 0, 1, 1]],
  [[]],
  [[]],
  [[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 1, 1], [0, 1, 0, 1]]
];

// поиск соответсвий
const matchSearch = (x, arr) => {
  let result = -1;
  arr.map((row, i) => {
    return row.map(col => {
      return col.toString() === x.toString() ? (result = i) : null;
    });
  });
  return result;
};

// Проверка промокода
const promoCheck = promo => {
  return promo ? (promo.length > 0 ? 1 : 0) : 0;
};

// Готовим данные
const x = get("bonuses");
const y = get("points");
const z = get("burn");
const promocd = promoCheck(get("promocode"));

const variant = [
  x < 100, //
  x > 100 && x < 10000,
  x > 10000,
  y < 100,
  y > 100,
  z > 0,
  promocd
].map(el => {
  return el ? 1 : 0;
});

const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i === 3 || i === 4 ? acc : acc.concat(el);
      }, [])
    : variant.reduce((acc, el, i) => {
        return i > 2 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);

const descriptionParse = text => {
  const discount = text.match(/\d+\%/g).toString(); // ищем скидку
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

// DOM
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:plane.png)!\')"><i class='mx-banner-close'>+</i></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const head1 = `<span class="mx-banner-head">Самое время найти обратный рейс</span>`;
  const head2 = `<span class="mx-banner-head">Cуммируйте скидку с бонусами</span>`;
  const head3 = `<span class="mx-banner-head">Выберите обратный рейс</span>`;
  const summ = `<span class="mx-banner-summ">${x}</span>`;
  const discountDkl = `<span class="discount-dkl-head">Со скидкой</span><span class="discount-dkl">${z}</span><span class="discount-dkl-prop">* Сгорают в течении 3 месяцев</span>`;
  const discountNoDkl = `<span class="discount-no-dkl">${y}</span>`;
  const discountNoDklDesk = `<span class="discount-no-dkl-desk">*Для того чтобы начислить бонусы<br>за прошлые полеты в течении 3-х месяцев<br>зарегистрируйтесь в программе «Крылья»</span>`;
  const promo = `<span class="mx-banner-promo">${get("promocode")}</span>`;
  const promo_bottom = `<span class="mx-banner-promo __bottom">${get(
    "promocode"
  )}</span>`;
  const discountDate = `<span class="mx-discount-date">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>`;
  const discount = `<span class="mx-discount">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
  const btn = text =>
    `<button class="mx-banner-btn">${text ? text : "Выбрать"}</button>`;
  console.log(research);
  switch (research) {
    case -1: //
      bnr.append(head1).append(btn());
      break;
    case 0:
      bnr.append(head1).append(btn());
      break;
    case 1:
      bnr
        .append(head1)
        .append(promo_bottom)
        .append(discountDate)
        .append(discount)
        .append(btn());
      break;
    case 2:
      bnr
        .append(head2)
        .append(summ)
        .append(btn("Выбрать"));
      break;
    case 3:
      bnr
        .append(head3)
        .append(discountDkl)
        .append(btn());
      break;
    case 4:
      bnr
        .append(head3)
        .append(discountNoDkl)
        .append(discountNoDklDesk)
        .append(btn());
      break;
    default:
  }

  // show
  get("one-way")
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

  // Send form data
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
