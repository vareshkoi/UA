const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

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

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:cookies.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const content = `<span class="mx-banner-head">Пора задуматься<br>о новой поездке</span><span class="mx-banner-promo">${promocd}</span><span class="mx-banner-route">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span>
<span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span>`;
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

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};
events.domReady(init);
