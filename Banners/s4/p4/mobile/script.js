const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

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
  const head = `<span class="mx-banner-head">Пора задуматься о новой поездке</span>`;
  const arv = text => `<span class="mx-banner-to">${text}</span>`;
  const dep = text => `<span class="mx-banner-from"">${text}</span>`;
  const stuff = json => {
    return `${head}<div class="mx-banner-from-to">${dep(json.from)} - ${arv(
      json.to
    )}</span></div><span class="mx-banner-price">${Math.min.apply(
      null,
      json.months.map(key => {
        return Number(key.price);
      })
    )}</span>`;
  };

  $("body").append(banner);
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
      const fromto = $(".mx-banner-from-to");
      while (parseInt(fromto.height()) > 50) {
        fromto.css({
          "font-size": parseInt(fromto.css("font-size")) - 2 + "px"
        });
      }
    });
    // show
    parseInt(rank) === 4 //
      ? setTimeout(function() {
          bnr.addClass("__active");
        }, 1000)
      : null;
  }

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
}

okGo ? events.domReady(init) : null;
