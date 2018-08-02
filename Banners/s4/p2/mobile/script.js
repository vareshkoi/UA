const get = name => visitor.getData(name);

//roadmap
const dkl = [[[1]], [[0]]];
const nodkl = [[[0]], [[1]]];

//

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

/* Готовим данные */

const itIsDKL = !!get("it-is-dkl");

const variant = [itIsDKL === true, itIsDKL !== true].map(el => {
  return el ? 1 : 0;
});

const research = matchSearch(
  get("it-is-dkl")
    ? variant.reduce((acc, el, i) => {
        return i === 0 ? acc.concat(el) : acc;
      }, [])
    : variant.reduce((acc, el, i) => {
        return i === 1 ? acc.concat(el) : acc;
      }, []),
  get("it-is-dkl") ? dkl : nodkl
);

const banner = `<div class='mx-banner' style="background-image: url(\'#$(ContentManager:recommendus.png)!\')"><i class='mx-banner-close'>+</i><button class='mx-banner-btn'>Порекомендовать</button></div>`;
const init = () => {
  const body = $("body");
  body.append(banner);
  const bnr = $(".mx-banner");
  const head = `<span class="mx-banner-head">Порекомендуйте нас друзьям и близким</span>`;
  const social = `<ul class="mx-banner-social"><li class="mxvk"><a href="https://vk.com/ural_airlines"></a></li><li class="mxfb"><a href="https://www.facebook.com/UralAirlines"></a></li><li class="mxtw"><a href="https://twitter.com/Ural_Air_Lines"></a></li><li class="mxin"><a href="https://www.instagram.com/ural_airlines/"></a></li><li class="mxok"><a href="https://ok.ru/group/54942560419864"></a></li><ul>`;
  switch (research) {
    case 0:
      bnr.append(head);
      break;
    case 1:
      $(".mx-banner-btn").remove();
      bnr.append(head).append(social);
      break;
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

  /* TODO: собрать линк и отдать в cеттер -->>> set("link", val) */

  // onBtnClick
  $(".mx-banner-btn").click(e => {
    e.preventDefault();
    window.open("https://my.uralairlines.ru/personal/cabinet/");
  });
};
events.domReady(init);
