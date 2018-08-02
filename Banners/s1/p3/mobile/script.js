const get = name => visitor.getData(name);

const banner1 = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><span class="mx-banner-head">Успейте забронировать ваше любимое кресло</span><span class="mx-banner-armchair">${
  get("fav-place") === "undefined" ? "4F" : get("fav-place")
}</span><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const banner2 = `<div class='mx-banner _fr' style="background-image: url(\'#$(ContentManager:kreslo.png)!\')"><span class="mx-banner-head head2">Выберите ваше любимое место</span><br><span class="mx-banner-head head2">Оформите дополнительный багаж со скидкой</span><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
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

  /* TODO: собрать линк и отдать в cеттер -->>> set(name, val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open(get("link"), "_self");
  });
};

events.domReady(init);
