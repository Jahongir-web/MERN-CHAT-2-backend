const router = require("express").Router()

const chatCtrl = require("../controller/chatCtrl")

router.get("/", chatCtrl.userChats)
router.get("/:firstId/:secondId", chatCtrl.findChat)
router.delete("/:chatId", chatCtrl.deleteChat)

module.exports = router