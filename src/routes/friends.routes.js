const { Router } = require("express");
const friendsController = require("../controllers/friends.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.get("/list-requests", authMiddleware, friendsController.listFriendRequests);
router.get("/list-friends/:username", authMiddleware, friendsController.listFriends);
router.get("/count/:username", authMiddleware, friendsController.countFriends);
router.post("/friend-request/:friendUsername", authMiddleware, friendsController.friendRequest);
router.post("/accept-friend-request/:friendUsername", authMiddleware, friendsController.acceptFriendRequest);
router.post("/refuse-friend-request/:friendUsername", authMiddleware, friendsController.refuseFriendRequest);
router.delete("/cancel-friend-request/:friendUsername", authMiddleware, friendsController.cancelFriendRequest);
router.delete("/remove-friend/:friendUsername", authMiddleware, friendsController.removeFriend);


module.exports = router;