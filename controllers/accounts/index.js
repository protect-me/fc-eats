const { Router } = require("express");
const router = Router();
const ctrl = require("./accounts.ctrl");

router.get("/join", ctrl.get_join);
router.post("/join", ctrl.post_join);
router.get("/login", ctrl.get_login);

module.exports = router;
