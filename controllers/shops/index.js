const { Router } = require("express");
const router = Router();
const ctrl = require("./shops.ctrl");
const loginRequired = require("../../middleware/loginRequired");

// 문자열은 지우고 숫자만 받겠다는 정규식
router.get("/:id(\\d+)", ctrl.get_shops_detail);
router.post("/like/:shop_id(\\d+)", loginRequired, ctrl.post_shops_like);
router.delete("/like/:shop_id(\\d+)", loginRequired, ctrl.delete_shops_like);

module.exports = router;
