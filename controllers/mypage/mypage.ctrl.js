const models = require("../../models");

exports.get_likes = async (req, res) => {
  const user = await models.User.findOne({
    where: {
      id: req.user.id,
    },
    include: ["Likes"],
  });
  res.render("mypage/likes.html", { shops: user.dataValues.Likes });
};
