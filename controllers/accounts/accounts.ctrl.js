const models = require("../../models");

exports.get_join = (_, res) => {
  res.render("accounts/join.html");
};

exports.post_join = async (req, res) => {
  try {
    await models.User.create(req.body);
    res.send(
      "<script>alert('회원가입 성공');\
      location.href='/accounts/login'</script>"
    );
  } catch (e) {
    console.log(e);
  }
};

exports.get_login = (req, res) => {
  res.render("accounts/login.html");
};
