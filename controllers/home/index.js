const { Router } = require("express");
const router = Router();
const models = require("../../models");

router.get("/", async (req, res) => {
  try {
    const shops = await models.Shops.findAll({
      ...(req.query.lat && req.query.lng
        ? {
            attributes: {
              include: [
                [
                  models.sequelize.literal(`
                    ST_DISTANCE_SPHERE( POINT(
                    ${req.query.lng},
                    ${req.query.lat}
                    ), geo)`),
                  "distance",
                ],
              ],
            },
            order: [[models.sequelize.literal("distance"), "asc"]],
          }
        : ""),
    });
    res.render("home.html", { shops });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
