const { Router } = require("express");
const router = Router();
const ctrl = require("./shops.ctrl");

// 문자열은 지우고 숫자만 받겠다는 정규식
router.get("/:id(\\d+)", ctrl.get_shops_detail);

module.exports = router;
