const { Schema, model } = require("mongoose");
const { toUnderScore } = require("../modules/format-case");

const employeeSchemaObj = toUnderScore({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const employeeSchema = new Schema(employeeSchemaObj);

module.exports = model("Employee", employeeSchema);
