export const castling = mmid =>
  Promise.all([
    fetch(`http://192.168.99.138/coreapi/entity/${mmid}`).then(res =>
      res.json()
    ), //json1
    fetch(`http://192.168.99.138/coreapi/responsys/${mmid}`).then(res =>
      res.json()
    ) //json2
  ]).then(res => {
    let json = res[0];
    const json2 = res[1];
    json.loyalty_json = json2;
    console.log(json);
  });
