const express = require("express");
const Router = express.Router();
const {
  updateUser,
  deleteUser,
} = require("../../controllers/users-controllers");
const verifyRoles = require("../../middleware/verify-roles");

Router.route("/")
  .patch(verifyRoles("admin"), updateUser)
  .delete(verifyRoles("admin"), deleteUser);

module.exports = Router;
