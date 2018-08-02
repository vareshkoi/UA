const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  {
    param: "friends",
    start: 0,
    name: "Есть еще пассажиры в заказе",
    type: "checkbox"
  },
  { param: "card-lvl", start: "Синий", name: "Уровень карты", type: "text" },
  { param: "fav-place", start: "4F", name: "Любимое место", type: "text" }
];

/* Тестовая форма */
// рендеринг полей формы
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
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

const banner1 = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><span class="mx-banner-head">Успейте забронировать ваше любимое кресло</span><span class="mx-banner-armchair">${
  get("fav-place") === "undefined" ? "4F" : get("fav-place")
}</span><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const banner2 = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><span class="mx-banner-head">Выберите ваше любимое место</span><br><br><span class="mx-banner-head">Оформите дополнительный багаж со скидкой</span><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(dataForm(test_data));
  get("friends") ? body.append(banner2) : body.append(banner1);

  // show
  setTimeout(function() {
    if (get("it-is-dkl") && get("card-lvl") !== "Синий") {
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
