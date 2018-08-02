const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

/* Готовим данные */

// распаковываем из кук
const dispatch = names => {
  return names.reduce((acc, el) => {
    get(el) ? acc.push(1) : acc.push(0);
    return acc;
  }, []);
};

// NEXT >>>
const next = (index, size) => {
  let next = index + 1;
  return next < size ? next : 0;
};

let flgs = ["seat-flg", "luggage-flg", "meal-flg"];

// если < 36 часов, то не предлагаем пищу
flgs = get("tbd") < 36 ? flgs.slice(0, 2) : flgs;
let arr = dispatch(flgs);

// ищем флаги 0
let choises = arr.toString().match(/0/gi);
choises = !choises ? 0 : choises.length;

// карусель
const whirligig = size => {
  const index = get("index") === undefined ? 0 : next(get("index"), size);
  set("index", index);
  return index;
};

// качели
const swing = flgs => {
  const reverse = get("reverse") ? 0 : 1;
  const _flgs = reverse ? flgs.reverse() : flgs;
  set("reverse", reverse);
  return _flgs[0];
};

let result;

switch (choises) {
  case 0:
    result = "nothing";
    break;
  case 1:
    result = flgs[arr.indexOf(0)];
    break;
  case 2:
    result = swing(flgs); //
    break;
  case 3:
    result = flgs[whirligig(arr.length)];
    break;
}

//dom
const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const current = result;
  const head = `<span class="mx-banner-head">Добавьте комфорта в Ваш перелет</span>`;
  // для всех
  if (current === "seat-flg") {
    bnr.append(
      `${head}<div class="mx-center"><span class="mx-banner-text">Выберите кресло</span><span class="mx-banner-price">500</span></div>`
    );
  } else if (current === "luggage-flg") {
    bnr.append(
      `${head}<div class="mx-center"><span class="mx-banner-text">Оформите доп. багаж</span><span class="mx-banner-price">1000</span></div>`
    );
  } else if (current === "meal-flg") {
    bnr.append(
      `${head}<div class="mx-center"><span class="mx-banner-text">Скидки на питание</span><span class="mx-banner-price">200</span></div>`
    );
  } else {
    bnr.addClass("__not");
  }

  // если ДКЛ
  if (get("it-is-dkl")) {
    bnr.append(`<span class='mx-banner-promo'>${get("promocode")}`);
  }

  // show
  setTimeout(function() {
    if (get("it-is-dkl") && get("dkl-lvl") === "Синий") {
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

  /* TODO: собрать линк и отдать в cеттер -->>> set(name, val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};

events.domReady(init);
