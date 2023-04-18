const router = require("express").Router()

const userCtrl = require("../controller/userCtrl")

router.get("/:id", userCtrl.getUser)
router.get("/", userCtrl.getAllUsers)
router.put("/:id", userCtrl.updateUser)
router.delete("/:id", userCtrl.deleteUser)



module.exports = router