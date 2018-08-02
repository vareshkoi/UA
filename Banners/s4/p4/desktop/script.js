const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);
const test_data = [
  { param: "it-is-dkl", start: 0, name: "ДКЛ", type: "checkbox" },
  { param: "bonus", start: 0, name: "Бонусы ДКЛ", type: "text" }
];
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

// wrapper
const dataForm = data =>
  `<form class="test-data-form"><button class="ok-test">Тест</button>${dataFields(
    data
  )}</form>`;

// межсценарный приоритет
let rank = parseInt(get("rank"));
rank ? set("rank", rank + 1 > 4 ? 0 : rank + 1) : (rank = 4);
const okGo = parseInt(rank) === 4; //

function init() {
  //data
  let utm = document.location.href.split("utm-direction="); // UTM  метка
  //
  const banner =
    '<div class="mx-banner" style="background: url(\'#$(ContentManager:cookies.png)!\')"><button class="mx-banner-btn">Выбрать</button></div>';
  const head = `<span class="mx-banner-head">Пора задуматься<br>о новой поездке</span>`;
  const arv = text => `<span class="mx-banner-to">${text}</span>`;
  const dep = text => `<span class="mx-banner-from"">${text}</span>`;
  const stuff = json => {
    return `${head}<div class="mx-banner-from-to">${dep(json.from)}<br>${arv(
      json.to
    )}</span></div><span class="mx-banner-price">${Math.min.apply(
      null,
      json.months.map(key => {
        return Number(key.price);
      })
    )}</span>`;
  };

  $("body")
    .append(dataForm(test_data))
    .append(banner);
  const bnr = $(".mx-banner");

  if (utm.length > 1) {
    utm = utm.reverse()[0];
    utm = utm.indexOf("&") > 0 ? utm.split("&")[0] : utm; // проверяем на доп. параметры
    const fromTo = utm.split("_");
    $.get(
      `https://www.uralairlines.ru/ajax/special_ajax.php?from=${fromTo[0]}&to=${
        fromTo[1]
      }`
    ).done(data => {
      // запрос
      bnr.append(stuff(data));
      if (get("bonus") > 100 && get("it-is-dkl")) {
        bnr.append(
          `<span class="mx-bonus">Ваш баланс: ${get("bonus")} бонусов</span>`
        );
      }
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
    });
    // show
    parseInt(rank) === 4 //
      ? setTimeout(function() {
          bnr.addClass("__active");
        }, 1000)
      : null;
  }

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

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

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
}

okGo ? events.domReady(init) : null;
