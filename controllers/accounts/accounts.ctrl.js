const models = require("../../models");

exports.get_join = (_, res) => {
  res.render("accounts/join.html");
};

exports.get_login = (req, res) => {
  res.render("accounts/login.html");
};
