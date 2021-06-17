const models = require("../../models");

exports.get_shops_detail = async (req, res) => {
  const shop = await models.Shops.findOne({
    where: { id: req.params.id },
    include: ["Menu"],
  });

  let cartList = {}; //장바구니 리스트
  let cartLength = 0;
  if (typeof req.cookies.cartList !== "undefined") {
    cartList = JSON.parse(unescape(req.cookies.cartList));
    cartLength = Object.keys(cartList).length;
  }

  res.render("shops/detail.html", { shop, cartLength });
};
