const { Schema, model } = require("mongoose");
const { toUnderScore } = require("../modules/format-case");

const userSchemaObj = toUnderScore({
  user_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: Array,
    default: [1161],
  },
  refresh_token: String,
});

const userSchema = new Schema(userSchemaObj);

module.exports = model("User", userSchema);
