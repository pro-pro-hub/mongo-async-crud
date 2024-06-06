const { toCamelCase, toUnderScore } = require("../modules/format-case");
const Employee = require("../model/Employee");

const getAllEmployees = async (req, res) => {
  // Send all employees
  try {
    const allEmployees = await Employee.find().lean();
    res.json(allEmployees);
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const createEmployee = async (req, res) => {
  try {
    // Convert the possible cases to camel case
    const { firstName, lastName } = toCamelCase(req.body);
    // Check to see if the firstName and lastName keys has values
    if (!firstName || !lastName) {
      // Bad request
      res.status(400).json({
        error:
          "First name and last name is required and must be sent through a json with the format first_name/firstName and likewise last_name/lastName",
      });
    }
    // Make new employee
    else {
      const newEmployee = toCamelCase(
        (
          await Employee.create(
            toUnderScore({
              firstName,
              lastName,
            })
          )
        ).toObject()
      );
      // Send a success status
      res.status(201).json({
        success: `New employee with firstName/first_name: ${newEmployee.firstName} and lastName/last_name: ${newEmployee.lastName} created`,
        id: newEmployee._id,
      });
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateEmployeeFull = async (req, res) => {
  try {
    const { id, firstName, lastName } = toCamelCase(req.body);
    // Check for id, firstName and lastName in the req body
    if (!id || !firstName || !lastName) {
      res.status(400).json({
        error:
          "The id, firstName/first_name and lastName/last_name must to be provided",
      });
    } else {
      // Find the employee with the id
      const foundEmployee = await Employee.findById(id);
      // Check to see if the employee was found
      if (!foundEmployee) {
        res.status(404).json({
          error: `Employee with the id: ${id} not found`,
        });
      } else {
        const outdatedEmployee = toCamelCase(foundEmployee.toObject());
        // Update the employee
        foundEmployee[toUnderScore("firstName")] = firstName;
        foundEmployee[toUnderScore("lastName")] = lastName;
        const updatedEmployee = toCamelCase(
          (await foundEmployee.save()).toObject()
        );
        res.status(201).json({
          success: `Employee with the id: ${id} has been updated from firstName/first_name: "${outdatedEmployee.firstName}" to "${updatedEmployee.firstName}" and lastName: "${outdatedEmployee.lastName} to "${updatedEmployee.lastName}"`,
        });
      }
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const getEmployee = async (req, res) => {
  try {
    const caseValue = req.body.case?.toString() ?? "";
    const id = req.params.id;
    // Format the employee cases
    const foundEmployee = caseValue.trim().toLowerCase().startsWith("camel")
      ? toCamelCase((await Employee.findById(id))?.toObject())
      : toUnderScore((await Employee.findById(id))?.toObject());
    // Check to see if the found employee exists
    if (!foundEmployee) {
      res.status(404).json({
        error: `Employee with the id: ${id} not found`,
      });
    }
    // Send the employee
    else {
      res.status(200).json(foundEmployee);
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const updateEmployeeHalf = async (req, res) => {
  try {
    const { firstName, lastName } = toCamelCase(req.body);
    const id = req.params.id;
    const foundEmployee = await Employee.findById(id);
    // Check to see if there's a found employee
    if (!foundEmployee) {
      res.status(404).json({
        error: `Employee with the id: ${id} not found`,
      });
    }
    // Check to see if there's a firstName and lastName to update
    else if (firstName && lastName) {
      // Bad request
      res.status(400).json({
        error:
          "Cannot update an employee with the first_name/firstName and last_name/lastName simultaneously, use a put request to the root instead",
      });
    }
    // Check to see if there's a firstName or lastName to update
    else if (!firstName && !lastName) {
      // Bad request
      res.status(400).json({
        error:
          "Needs a first name or a last name value to update and should be sent through a json with the format first_name/firstName or last_name/lastName respectively",
      });
    }
    // Start the employee update
    else {
      const outdatedEmployee = toCamelCase(foundEmployee.toObject());
      // Update the employee
      firstName
        ? (foundEmployee[toUnderScore("firstName")] = firstName)
        : (foundEmployee[toUnderScore("lastName")] = lastName);
      const updatedEmployee = toCamelCase(
        (await foundEmployee.save()).toObject()
      );
      // Send a success status
      res.status(200).json({
        success: `Updated the employee with the id: ${id} from ${
          firstName
            ? "first_name/firstName: " +
              outdatedEmployee.firstName +
              " to " +
              updatedEmployee.firstName
            : "last_name/lastName: " +
              outdatedEmployee.lastName +
              " to " +
              updatedEmployee.lastName
        }`,
      });
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const foundEmployee = await Employee.findById(id).lean();
    // Check to see if the employee was found
    if (!foundEmployee) {
      res.status(404).json({
        error: `Employee with the id: ${id} not found`,
      });
    }
    // Deleting employee
    else {
      const deletedEmployee = toCamelCase(
        await Employee.findByIdAndDelete(id).lean()
      );
      // Send a succes status
      res.status(200).json({
        success: `Employee with the id: ${id}, first_name/firstName: ${deletedEmployee.firstName} and last_name/lastName: ${deletedEmployee.lastName} has been deleted successfully`,
      });
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployeeFull,
  getEmployee,
  updateEmployeeHalf,
  deleteEmployee,
};
