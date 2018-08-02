const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
//roadmap
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

const x = get("bonuses");
const y = get("points");
const z = get("burn");
const promocd = get("promo");

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


//dom
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:plane.png)!\')"><i class='mx-banner-close'>+</i></div>`;
const init = () => {
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const head1 = `<span class="mx-banner-head">Самое время найти обратный рейс</span>`;
  const head2 = `<span class="mx-banner-head">Cуммируйте скидку с бонусами</span>`;
  const head3 = `<span class="mx-banner-head">Выберите обратный рейс со скидкой</span>`;
  const summ = `<span class="mx-banner-summ">${x}</span>`;
  const discountDkl = `<span class="discount-dkl-head">Ваш баланс</span><span class="discount-dkl">${z}</span><span class="discount-dkl-prop">* Сгорают в течении 3 месяцев</span>`;
  const discountNoDkl = `<span class="discount-no-dkl">${y}</span>`;
  const promo_bottom = `<span class="mx-banner-promo __bottom">${get(
    "promocode"
  )}</span>`;
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
        .addClass("__one")
        .append(head1)
        .append(promo_bottom)
        .append(btn());
      break;
    case 2:
      bnr
        .addClass("__two")
        .append(head2)
        .append(summ)
        .append(btn("Выбрать"));
      break;
    case 3:
      bnr
        .addClass("__three")
        .append(head3)
        .append(discountDkl)
        .append(btn());
      break;
    case 4:
      bnr
        .addClass("__four")
        .append(head3)
        .append(discountNoDkl)
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

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};

events.domReady(init);
