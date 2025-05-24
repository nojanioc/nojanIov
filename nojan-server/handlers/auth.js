const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Middleware for role-based authorization
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.sendStatus(403);
    }
    next();
  };
}

async function loginHandler(req, res) {
  const { password, email } = req.body;

  console.log({ email, password });

  const user = await User.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.sendStatus(401);
  }
  const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY);

  res.json({ token, username: user.username, email: user.email });
}

async function createCustomer(req, res) {
  const { username, password, email, devices } = req.body;

  if (!devices || !Array.isArray(devices) || devices.length === 0) {
    return res.status(400).json({ message: "At least one device is required" });
  }

  // Validate each device
  for (const device of devices) {
    if (!device.name || !device.ip) {
      return res
        .status(400)
        .json({ message: "Each device must have a name and IP" });
    }
    if (!["dishwasher", "pizza"].includes(device.name)) {
      return res
        .status(400)
        .json({ message: "Device name must be either dishwasher or pizza" });
    }
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = new User({
    username,
    password: hashedPassword,
    email: email,
    role: "customer",
    devices: devices,
  });

  try {
    await user.save();
    res.sendStatus(201);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
}

async function deleteCustomer(req, res) {
  const { email } = req.params;
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return res.sendStatus(404);
  }
  res.sendStatus(204);
}

async function getCustomers(req, res) {
  const customers = await User.find();
  res.json(customers);
}

const getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform the response to only include device names
    const userData = {
      ...user.toObject(),
      devices: user.devices.map((device) => device.name),
    };

    res.json(userData);
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  loginHandler,
  createCustomer,
  deleteCustomer,
  getCustomers,
  getUserData,
};
