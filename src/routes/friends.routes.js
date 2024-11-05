const { Router } = require("express");
const friendsController = require("../controllers/friends.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.post("/friend-request/:friendUsername", authMiddleware, friendsController.friendRequest);
router.post("/accept-friend-request/:friendUsername", authMiddleware, friendsController.acceptFriendRequest);
router.post("/refuse-friend-request/:friendUsername", authMiddleware, friendsController.refuseFriendRequest);


module.exports = router;