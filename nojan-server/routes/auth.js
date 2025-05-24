const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  authorizeRole,
  loginHandler,
  createCustomer,
  deleteCustomer,
  getCustomers,
  getUserData,
} = require("../handlers/auth");

router.post("/login", loginHandler);

router.post(
  "/customers",
  authenticateToken,
  authorizeRole("admin"),
  createCustomer
);

// Remove customer route (admin only)
router.delete(
  "/customers/:email",
  authenticateToken,
  authorizeRole("admin"),
  deleteCustomer
);

router.get(
  "/customers",
  authenticateToken,
  authorizeRole("admin"),
  getCustomers
);

router.get("/me", authenticateToken, getUserData);

module.exports = router;
