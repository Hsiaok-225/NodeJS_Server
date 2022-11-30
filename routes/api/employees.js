const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employee");
const verifyRoles = require("../../middleware/verifyRoles");
const roleslist = require("../../config/roleslist");

// verifyRoles before use employee-api
router
  .route("/")
  .get(employeesController.getAll)
  .post(
    verifyRoles(roleslist.Admin, roleslist.Editor),
    employeesController.create
  )
  .put(
    verifyRoles(roleslist.Admin, roleslist.Editor),
    employeesController.update
  )
  .delete(verifyRoles(roleslist.Admin), employeesController.delete);

router.route("/:id").get(employeesController.getId);

module.exports = router;
