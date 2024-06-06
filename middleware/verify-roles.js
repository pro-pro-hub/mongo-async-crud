const { getUserRoleName } = require("../modules/user-roles");
const { toCamelCase } = require("../modules/format-case");

const verifyRoles = (...roles) => {
  // Make the roles an array
  const requiredRoles =
    roles.length > 1 ? roles : Array.isArray(roles[0]) ? roles[0] : [roles[0]];
  // Return the initialized middleware
  return (req, res, next) => {
    const user = toCamelCase(req.user);
    const method = roles.every((role) => Number.isNaN(+role)) ? "n" : "c";
    const unAllowedRole = () => {
      res.status(401).json({ error: "You don't have enough permission" });
    };
    if (method === "c") {
      // Check if the required role name is in the user
      requiredRoles.some((role) => user.roles.includes(role))
        ? next()
        : unAllowedRole();
    } else {
      // Check if the required role code is in the user
      const userRoleNames = getUserRoleName(user.roles);
      requiredRoles.some((role) => userRoleNames.includes(role))
        ? next()
        : unAllowedRole();
    }
  };
};

module.exports = verifyRoles;
