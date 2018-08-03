const set = (name, val) => visitor.setData(name, val);
const get = name => visitor.getData(name);

//roadmap
const dkl = [[[1, 1, 1]], [[1, 1, 0]], [[1, 0, 1]], [[1, 0, 0]], [[]], [[]]];
const nodkl = [[[]], [[]], [[]], [[]], [[1, 0]], [[1, 1]]];

//
const descriptionParse = text => {
  const discount = text.match(/\d+\%/g).toString(); // ищем скидку
  const pool = text.split(discount); // разбиваем текст по смыслу
  return {
    discountText: pool[0],
    discount,
    expirationText: pool[1]
  };
};

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

//
const acrl3m_bonus = Number(get("acrl3m-bonus"));
const bonus = Number(get("bonus"));
const promocd = get("promocd");
const reg = get("registration");
const variant = [
  acrl3m_bonus > 100,
  reg !== undefined ? (Number(reg) < 2 ? 1 : 0) : 1,
  bonus > 100,
  promocd
].map(el => {
  return el ? 1 : 0;
});
const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i !== 0 ? acc.concat(el) : acc;
      }, [])
    : variant.reduce((acc, el, i) => {
        return i !== 1 && i !== 2 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);

const cityReg = get("city-reg");
const recDir = get("rec-dir");

const direction = (x, arr) => {
  let result = "";
  if (!!x && !!arr) {
    result = arr.split(",").reduce((acc, val) => {
      val.split("-")[0] === x ? acc.push(val) : acc;
      return acc;
    }, []);
  }
  return result.length > 0 ? result[0].split("-") : "";
};

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:river.jpg)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Выбрать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const fromTo = `<span class="mx-banner-from-to">${
    direction(cityReg, recDir)[0]
  } - ${direction(cityReg, recDir)[1]}</span>`;
  const from = `<span class="mx-banner-from">${
    direction(cityReg, recDir)[0]
  }</span>`;
  const to = `<span class="mx-banner-to">${
    direction(cityReg, recDir)[1]
  }</span>`;
  const price = `<span class="mx-banner-price">${get("price")}</span>`;
  const promo = `<span class="mx-banner-promo">${promocd}<span>`;
  const profit = `<center><span class="mx-banner-profit">${descriptionParse(
    get("desc-promo")
  ).discountText.replace(/_/gi, "<br>")}<br>${descriptionParse(
    get("desc-promo")
  ).expirationText.replace(/_/gi, "<br>")}</span><span class="mx-banner-disc">${
    descriptionParse(get("desc-promo")).discount
  }</span></center>`;
  const balance = `<span class="mx-banner-balance">${bonus} бонусов</span>`;
  const noDkl = `<span class="mx-banner-nodkl">${acrl3m_bonus}</span>`;
  const txt = txt => `<span class="mx-banner-text">${txt}</span>`;
  console.log(variant, research);
  switch (research) {
    case 0:
      bnr
        .append(promo)
        .append(profit)
        .append(balance);
      break;
    case 1:
      bnr
        .addClass("__two")
        .append(price)
        .append(txt("Воспользуйтесь скидкой на этот перелет"))
        .append(balance);
      break;
    case 2:
      bnr
        .addClass("__three")
        .append(promo)
        .append(profit);
      break;
    case 3:
      bnr
        .addClass("__four")
        .append(fromTo)
        .append(price);
      break;
    case 4:
      bnr
        .addClass("__four")
        .addClass("__almost")
        .append(fromTo)
        .append(noDkl)
        .append(
          txt(
            "Для того чтобы начислить бонусы за прошлые полеты<br>в течении 3-х месяцев зарегистрируйтесь в программе «Крылья»"
          )
        );
      break;
    case 5:
      bnr
        .addClass("__four")
        .append(promo)
        .append(noDkl)
        .append(
          txt(
            "Для того чтобы начислить бонусы<br>за прошлые полеты<br>в течении 3-х месяцев<br>зарегистрируйтесь в программе «Крылья»"
          )
        );
      break;
  }

  // adaptive text
  const arvTxt = $(".mx-banner-to");
  const depTxt = $(".mx-banner-from");
  const heightK = 0.4;

  while (arvTxt.height() > 50) {
    arvTxt.css({ "font-size": parseInt(arvTxt.css("font-size")) - 2 + "px" });
  }

  depTxt.css({
    "font-size": parseInt(arvTxt.css("font-size")) * heightK + "px"
  });

  // show
  research > -1
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
