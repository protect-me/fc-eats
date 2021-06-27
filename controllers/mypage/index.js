const express = require("express");
const router = express.Router();
const loginRequired = require("../../middleware/loginRequired");
const ctrl = require("./mypage.ctrl");

router.get("/likes", loginRequired, ctrl.get_likes);

module.exports = router;
