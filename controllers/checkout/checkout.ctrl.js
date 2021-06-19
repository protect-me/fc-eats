const models = require("../../models");

exports.index = (req, res) => {
  let totalAmount = 0; //총결제금액
  let cartList = {}; //장바구니 리스트
  let shop_id = 0;
  let menuArray = [];

  //쿠키가 있는지 확인해서 뷰로 넘겨준다
  if (typeof req.cookies.cartList !== "undefined") {
    //장바구니데이터
    cartList = JSON.parse(unescape(req.cookies.cartList));

    //총가격을 더해서 전달해준다.
    for (const key in cartList) {
      totalAmount += parseInt(cartList[key].price);
      shop_id = cartList[key].shop_id;
      menuArray.push(parseInt(key));
    }
  }
  res.render("checkout/index.html", {
    cartList,
    totalAmount,
    shop_id,
    menuArray,
  });
};

exports.post_complete = async (req, res) => {
  try {
    const checkout = await models.Checkout.create(req.body);

    // const menuArray = req.body.menuArray;
    // menu_id 가 [ 1,3 ] 형식이라 [ 를 문자로 인식하는 문제
    const menuArray = JSON.parse(req.body.menuArray);

    async function asyncSetMenu(menu_id) {
      try {
        const menu = await models.ShopsMenu.findByPk(menu_id);
        const status = await checkout.addMenu(menu);
        if (typeof status == "undefined") {
          throw `menu :: ${menu_id}가 존재하지 않습니다.`;
        }
      } catch (e) {
        throw e;
      }
    }

    for (const menu_id of menuArray) await asyncSetMenu(menu_id);

    res.json({ message: "success" });
  } catch (e) {
    res.status(400).json({ message: e });
  }
};

exports.get_success = (_, res) => {
  res.render("checkout/success.html");
};
