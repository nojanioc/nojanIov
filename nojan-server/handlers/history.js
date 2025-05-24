const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const MachineHistory = require("../models/machineHistory");
const SECRET_KEY = process.env.SECRET_KEY;

async function machinHistory(req, res) {
  const { deviceName, filter = "full", page = 1, limit = 10 } = req.query;

  if (!deviceName) {
    return res.status(400).json({ message: "Device name is required" });
  }

  try {
    // Get user's devices to find the IP for the requested device
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const device = user.devices.find((d) => d.name === deviceName);
    if (!device) {
      return res.status(403).json({ message: "No access to this device" });
    }

    const currentDate = new Date();
    let dateFilter = {};

    // Apply the filter based on the query
    if (filter === "monthly") {
      dateFilter = {
        receivedAt: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          $lt: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
          ),
        },
      };
    } else if (filter === "yearly") {
      dateFilter = {
        receivedAt: {
          $gte: new Date(currentDate.getFullYear(), 0, 1),
          $lt: new Date(currentDate.getFullYear() + 1, 0, 1),
        },
      };
    }

    const skip = (page - 1) * limit;

    const [history, total] = await Promise.all([
      MachineHistory.find({
        machineName: deviceName,
        deviceIp: device.ip,
        ...dateFilter,
      })
        .sort({ receivedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .exec(),
      MachineHistory.countDocuments({
        machineName: deviceName,
        deviceIp: device.ip,
        ...dateFilter,
      }),
    ]);

    res.json({
      deviceName,
      filter,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      history,
    });
  } catch (error) {
    console.error("Error fetching machine history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateHistory = async (status, deviceName, deviceIp) => {
  try {
    const history = new MachineHistory({
      machineName: deviceName,
      deviceIp,
      status,
    });
    await history.save();
    console.log("Machine history saved:", history);
  } catch (error) {
    console.error("Error saving machine history:", error);
  }
};

module.exports = {
  machinHistory,
  updateHistory,
};
