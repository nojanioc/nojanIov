const mongoose = require("mongoose");

// Define the schema
const MachineHistorySchema = new mongoose.Schema({
  machineName: {
    type: String,
    required: true, // Machine name is required
  },
  deviceIp: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  receivedAt: {
    type: Date,
    default: Date.now, // Automatically set to the current timestamp
  },
});

// Create the model
const MachineHistory = mongoose.model("MachineHistory", MachineHistorySchema);

module.exports = MachineHistory;
