const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//data
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "lvl-dkl", start: "Синий", name: "Уровень ДКЛ", type: "text" },
  { param: "promocode", start: "S548dft57F", name: "Промокод", type: "text" },
  { param: "choise-flg", start: 0, name: "Флаг выбора", type: "checkbox" },
  { param: "reverse-flg", start: 0, name: "Реверс", type: "checkbox" },
  { param: "tbd", start: 40, name: "Часов до вылета", type: "text" },
  { param: "luggage-flg", start: 0, name: "Багаж", type: "checkbox" },
  { param: "seat-flg", start: 0, name: "Место", type: "checkbox" },
  { param: "meal-flg", start: 0, name: "Питание", type: "checkbox" },
  { param: "link", start: get("link"), name: "Ссылка", type: "input" }
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
          get(el.param) ? get(el.param) : set(el.param, el.start) && el.start
        }
   </div>`;
  });
};

// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

/* Готовим данные */

// распаковываем из кук
const dispatch = names => {
  return names.reduce((acc, el) => {
    get(el) ? acc.push(1) : acc.push(0);
    return acc;
  }, []);
};

// пакуем в куки
const packing = (arr, names) => {
  names.map((el, i) => set(el, arr[i]));
  return;
};

// считаем единицы
const full = arr =>
  arr.reduce((acc, el) => {
    return el === 1 ? acc + 1 : acc;
  }, 0);

// NEXT >>>
const next = arr => {
  const index = arr.indexOf(1);
  const next = typeof arr[index + 1] === "number" ? index + 1 : 0;
  return arr.map((el, i) => {
    return i === next ? 1 : 0;
  });
};

const flgs = ["luggage-flg", "seat-flg", "meal-flg"];
const lvl_dkl = get("lvl-dkl");

let arr = dispatch(flgs);

// Формируем рендер + проверка на время вылета, если < 36 часов, то не предлагаем пищу
let data = arr.map((el, i, arr) => {
  return typeof arr[i + 1] !== "number" && get("tbd") < 36 ? 0 : el;
});

arr = get("choise-flg") && full(arr) !== 3 ? arr : next(arr);

const result = arr => {
  const reverse = get("reverse-flg");
  const flags = reverse && get("choise-flg") ? flgs.reverse() : flgs;
  return full(arr) === 3
    ? "undefined"
    : get("choise-flg")
      ? flags[reverse ? arr.reverse().indexOf(1) : arr.indexOf(1)]
      : flags[arr.indexOf(1)];
};

//dom
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  if (location.host !== "booking.uralairlines.ru") {
    const body = $("body");
    body.append(dataForm(test_data)).append(banner);
    var bnr = $(".mx-banner");
  }
  const current = result(data);
  const head = `<span class="mx-banner-head">Добавьте комфорта в Ваш перелет</span>`;

  // для всех
  if (location.host !== "booking.uralairlines.ru") {
    if (current === "seat-flg") {
      bnr.append(
        `${head}<span class="mx-banner-text">Выберите кресло</span><span class="mx-banner-price ${
          get("it-is-dkl") ? "" : "__not-dkl"
        }">500</span>`
      );
    } else if (current === "luggage-flg") {
      bnr.append(
        `${head}<span class="mx-banner-text">Оформите доп. багаж</span><span class="mx-banner-price ${
          get("it-is-dkl") ? "" : "__not-dkl"
        }">1000</span>`
      );
    } else if (current === "meal-flg") {
      bnr.append(
        `${head}<span class="mx-banner-text">Выберите дополнительное питание</span><span class="mx-banner-price ${
          get("it-is-dkl") ? "" : "__not-dkl"
        }">200</span>`
      );
    } else {
      bnr.addClass("__not");
    }

    // если ДКЛ
    if (get("it-is-dkl") && get("lvl-dkl") === "Синий") {
      console.log("dkl");
      bnr.append(
        `<span class='mx-banner-promo'>${get(
          "promocode"
        )}</span><span class='mx-banner-desc'>10%</span>`
      );
    }

    // show
    setTimeout(function() {
      $(".mx-banner").addClass("__active");
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

    // Если выбор был сделан, ставим флаг
    get("choise-flg")
      ? get("reverse-flg") ? set("reverse-flg", 0) : set("reverse-flg", 1)
      : packing(arr, flgs);

    /* TODO: собрать линк и отдать в cеттер -->>> set(name, val) */

    if (location.host === "booking.uralairlines.ru") {
      if (
        document
          .getElementsByClassName("tableHeader")[0]
          .innerHTML.indexOf("Дополните данные") > 0
      ) {
        set(
          "clientName",
          document
            .getElementById("primaryTravellerLastName")
            .getAttribute("value")
        );
        set("pnrNbr", document.getElementById("pnrNbr").getAttribute("value"));
      }
    }
    current === "meal-flg"
      ? set("link", "https://shop.uralairlines.ru/services/food/")
      : set(
          "link",
          "https://www.uralairlines.ru/connector/check/?REC_LOC=" +
            get("pnrNbr") +
            "&DIRECT_RETRIEVE_LASTNAME=" +
            get("clientName")
        );
    console.log(get("link"));

    // onBtnClick
    $(".mx-banner-btn").click(e => {
      e.preventDefault();
      window.open(get("link"), "_self");
    });
  }
};

events.domReady(init);
