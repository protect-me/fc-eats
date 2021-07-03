const models = require("../../models");
const Shops = require("../../models/Shops");

exports.get_shops_detail = async (req, res) => {
  try {
    const shop = await models.Shops.findOne({
      where: { id: req.params.id },
      include: ["Menu", "LikeUser", "Tag"],
    });

    let active = false;
    if (req.isAuthenticated()) {
      const user = await models.User.findByPk(req.user.id);
      active = await shop.hasLikeUser(user);
    }

    const countLike = await shop.countLikeUser();

    let cartList = {}; //장바구니 리스트
    //쿠키가 있는지 확인해서 뷰로 넘겨준다
    let cartLength = 0;
    let sameShops = true;
    if (typeof req.cookies.cartList !== "undefined") {
      //장바구니데이터
      cartList = JSON.parse(unescape(req.cookies.cartList));

      cartLength = Object.keys(cartList).length;

      for (let key in cartList) {
        if (cartList[key].shop_id !== parseInt(req.params.id))
          sameShops = false;
      }
    }

    res.render("shops/detail.html", {
      shop,
      cartLength,
      sameShops,
      active,
      countLike,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.post_shops_like = async (req, res) => {
  try {
    const shop = await models.Shops.findByPk(req.params.shop_id);
    const user = await models.User.findByPk(req.user.id);

    const status = await user.addLikes(shop);

    res.json({
      status,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.delete_shops_like = async (req, res) => {
  try {
    const shop = await models.Shops.findByPk(req.params.shop_id);
    const user = await models.User.findByPk(req.user.id);

    // await Shop.removeLikeUser(user) 아래와 같은 효과
    await user.removeLikes(shop);

    res.json({
      message: "success",
    });
  } catch (e) {}
};
