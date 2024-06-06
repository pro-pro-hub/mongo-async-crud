const { USER_ROLES } = require("../config/config.json");

const getUserRoleCode = (...names) => {
  const roleNames =
    names.length > 1 ? names : Array.isArray(names[0]) ? names[0] : [names[0]];
  const roles = roleNames
    .map((role) => role.toString().toLowerCase().trim())
    .map(
      (role) =>
        Object.fromEntries(
          Object.entries(USER_ROLES).map(([key, value]) => [
            key.toLowerCase().trim(),
            value,
          ])
        )[role]
    )
    .filter((role) => role);
  return roles;
};

const getUserRoleName = (...codes) => {
  const roleCodes =
    codes.length > 1 ? codes : Array.isArray(codes[0]) ? codes[0] : [codes[0]];
  const roles = roleCodes
    .map((role) => Number(role))
    .map((role) => {
      let name = "";
      Object.entries(USER_ROLES).forEach(([key, val]) => {
        if (role === val) name = key;
      });
      return name.toLowerCase();
    })
    .filter((role) => role);
  return roles;
};

const setRoles = (...params) => {
  const roles = params.length > 1 ? params : params[0];
  const allRoleName = Object.keys(USER_ROLES).map((name) => name.toLowerCase());
  if (typeof roles === "string") {
    const rolesArr = roles
      .trim()
      .toLowerCase()
      .split(/\s*,\s*|\s+/g)
      .filter((role) => role !== "user" && role);
    const theRoles = [];
    allRoleName.forEach((name) => {
      if (rolesArr.includes(name)) theRoles.push(name);
    });
    theRoles.push("user");
    return theRoles;
  } else if (Array.isArray(roles)) {
    const fRoles = roles
      .map((role) => role && role.toString().toLowerCase())
      .filter((role) => role !== "user" && role);
    const theRoles = [];
    allRoleName.forEach((name) => {
      if (fRoles.includes(name)) theRoles.push(name);
    });
    theRoles.push("user");
    return theRoles;
  } else return ["user"];
};

module.exports = { getUserRoleCode, getUserRoleName, setRoles };
