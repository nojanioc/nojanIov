const User = require("../models/user");

async function createSuperAdmin() {
  const initialUser = await User.findOne({ email: "mlsSuperAdmin@gmail.com" });

  if (initialUser) {
    return;
  }

  await User.create({
    name: "admin",
    familly: "admin",
    password: "@mirHoseinfh1234",
    role: "superadmin",
    email: "mlsSuperAdmin@gmail.com",
  });
}

module.exports = createSuperAdmin;
