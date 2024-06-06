const User = require("../model/User");
const {
  setRoles,
  getUserRoleCode,
  getUserRoleName,
} = require("../modules/user-roles");

const updateUser = async (req, res) => {
  try {
    const { id, roles } = req.body;
    // Check for id and new roles
    if (!id || !roles)
      return res.status(400).json({
        error: "Id or roles value absent",
      });
    // Find the User
    const foundUser = await User.findById(id);
    if (!foundUser) {
      res.status(404).json({
        error: `User with the id: ${id} not found`,
      });
    } else {
      const foundUserObj = foundUser.toObject();
      // Set the new roles
      const newRoles = getUserRoleCode(setRoles(roles));
      foundUser.roles = newRoles;
      const updatedUser = (await foundUser.save()).toObject();

      const previousRoles = getUserRoleName(foundUserObj.roles);
      const updatedRoles = getUserRoleName(updatedUser.roles);
      // Send a sucess status
      res.status(200).json({
        success: `User with the id: ${id} has role(s) updated from: ${previousRoles.join(
          ", "
        )} to: ${updatedRoles.join(", ")}`,
      });
    }
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.body.id;
    const foundUser = await User.findByIdAndDelete(id).lean();
    // Find the user
    if (!foundUser)
      return res.status(404).json({
        error: `User with the id: ${id} not found`,
      });
    // Send a success status
    res.status(200).json({
      success: `User with the id: ${id} has been deleted successfully`,
    });
  } catch (err) {
    process.logEvent(`${err.name}\t${err.message}`, "err_log.txt");
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  updateUser,
  deleteUser,
};
