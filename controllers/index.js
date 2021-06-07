const { Router } = require("express");
const router = Router();

router.use("/admin", require("./admin"));
router.use("/accounts", require("./accounts"));
router.use("/auth", require("./auth"));

module.exports = router;
