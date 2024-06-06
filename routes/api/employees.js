const express = require("express");
const employees = require("../../controllers/employees-controllers");
const router = express.Router();
const verifyRoles = require("../../middleware/verify-roles");

// For the employees
router
  .route("/")
  .get(employees.getAllEmployees)
  .post(verifyRoles("admin", "editor"), employees.createEmployee)
  .put(verifyRoles("admin", "editor"), employees.updateEmployeeFull);

// For an employee
router
  .route("/:id")
  .get(employees.getEmployee)
  .patch(verifyRoles("admin", "editor"), employees.updateEmployeeHalf)
  .delete(verifyRoles("admin"), employees.deleteEmployee);

// Make an error handler
router.use((err, req, res, next) => {
  res.status(400).json({
    error: err.stack,
  });
});

module.exports = router;
