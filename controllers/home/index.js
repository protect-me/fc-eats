const { Router } = require("express");
const router = Router();
const models = require("../../models");

router.get("/", async (_, res) => {
  const shops = await models.Shops.findAll();
  res.render("home.html", { shops });
});

module.exports = router;
