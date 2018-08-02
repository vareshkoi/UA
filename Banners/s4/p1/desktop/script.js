const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
const test_data = [
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
const rmap = [1, 1];

/* Готовим данные */

const promocd = get("promocd");
const promocdDesc = get("desc-promo");

const variant = [promocd, promocdDesc].map(el => {
  return el ? 1 : 0;
});

const research = variant.toString() === rmap.toString();
console.log(rmap, variant, research);

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

// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:cookies.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data)).append(banner);
  const bnr = $(".mx-banner");
  const head = `<span class="mx-banner-head">Ваши доступные промокоды</span>`;
  const content = `<span class="mx-banner-promo">${promocd}</span><span class="mx-banner-desc">${descriptionParse(
    promocdDesc
  ).discountText.replace(/_/gi, "<br>")}</span><span class="mx-banner-disc">${
    descriptionParse(promocdDesc).discount
  }</span><span class="mx-banner-exp">${descriptionParse(
    promocdDesc
  ).expirationText.replace(/_/gi, "<br>")}</span>`;
  if (research) {
    bnr.append(head).append(content);

    setTimeout(function() {
      console.log("show");
      bnr.addClass("__active");
    }, 1000);
  }

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
