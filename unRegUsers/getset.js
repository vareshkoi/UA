// Ванильный AJAX запрос
var ajax = {};
ajax.x = function() {
  if (typeof XMLHttpRequest !== "undefined") {
    return new XMLHttpRequest();
  }
  var versions = [
    "MSXML2.XmlHttp.6.0",
    "MSXML2.XmlHttp.5.0",
    "MSXML2.XmlHttp.4.0",
    "MSXML2.XmlHttp.3.0",
    "MSXML2.XmlHttp.2.0",
    "Microsoft.XmlHttp"
  ];

  var xhr;
  for (var i = 0; i < versions.length; i++) {
    try {
      xhr = new ActiveXObject(versions[i]);
      break;
    } catch (e) {}
  }
  return xhr;
};

ajax.send = function(url, callback, method, data, async) {
  if (async === undefined) {
    async = true;
  }
  var x = ajax.x();
  x.open(method, url, async);
  x.onreadystatechange = function() {
    if (x.readyState == 4) {
      callback(x.responseText);
    }
  };
  if (method == "POST") {
    x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  }
  x.send(data);
};

ajax.get = function(url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(
    url + (query.length ? "?" + query.join("&") : ""),
    callback,
    "GET",
    null,
    async
  );
};

ajax.post = function(url, data, callback, async) {
  var query = [];
  for (var key in data) {
    query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
  }
  ajax.send(url, callback, "POST", query.join("&"), async);
};
//
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

// проверка на пустую строку
function notEmpty(str) {
  if (str.length > 0) {
    visitor.clearData("pnr");
    visitor.clearData("date");
  }
  return str.length > 0;
}

/*
* [4] ToStore - ищем в сторе существующие MId's и дописываем новые
* */

function toStore(fresh) {
  const _data = visitor.getData("mmids");
  let data = _data ? (Array.isArray(_data) ? _data : JSON.parse(_data)) : [];
  data = data.reduce((acc, val) => {
    fresh.indexOf(val) > -1 ? acc : acc.push(val);
    return acc;
  }, []);
  visitor.setData("mmids", data.concat(fresh));
  console.log(_data, data);
}

// [3] Handler
function handler(arr) {
  if (arr.length > 0) {
    // т.к. data может вернуть [""] пишем доп проверку
    toStore(
      arr.reduce((acc, val) => {
        notEmpty(val) ? acc.push(val) : acc;
        return acc;
      }, [])
    );
  }
}

// [1] чекаем куки макса
var pnr = visitor.getData("pnr");
var date = visitor.getData("date");
console.log("[1] _ pnr&date: ", pnr, date);
// [2] если pnr & date не пустые, просим сервис вернуть MemberId
if (pnr && date) {
  ajax.get(
    "https://client.uralairlines.ru/member",
    { pnr: pnr, date: date.split("T")[0] },
    function(data) {
      data = JSON.parse(data); // парсим строку в массив
      console.log("[2] _ data req: ", data);
      return handler(data); // передаем в Handler
    }
  );
}
// TODO: expiration date
setCookie("mxmmids", visitor.getData("mmids"), { path: "/" });
