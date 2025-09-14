const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/user");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const historyRoutes = require("./routes/history");
const initializeSocket = require("./socket");
const ADMIN_EMAIL = "admin@nojan.com";
const ADMIN_PASSWORD = "@dminN0jan1234";
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Replace '*' with specific domains for better security
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
initializeSocket(server);

mongoose
  .connect("mongodb://localhost:27017/nojan")
  .then(() => {
    console.log("Connected to MongoDB");
    ensureAdminUser(); // Call the handler to ensure admin user is created
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function ensureAdminUser() {
  try {
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
      role: "admin",
    });
    if (!existingAdmin) {
      const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 8);
      const admin = new User({
        email: ADMIN_EMAIL,
        password: hashedPassword,
        username: "admin",
        role: "admin",
        devices: [
          {
            name: "dishwasher",
            ip: "185.155.14.50",
          },
          {
            name: "pizzaoven",
            ip: "185.155.14.50",
          },
        ],
      });
      await admin.save();
      console.log("Admin user created:", ADMIN_EMAIL);
    } else {
      console.log("Admin user already exists:", ADMIN_EMAIL);
    }
  } catch (error) {
    console.error("Error ensuring admin user:", error);
  }
}

app.use("/auth", authRoutes);
app.use("/history", historyRoutes);

server.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
