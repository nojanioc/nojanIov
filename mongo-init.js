// MongoDB initialization script
db = db.getSiblingDB("nojan");

// Create a user for the application
db.createUser({
  user: "nojan_user",
  pwd: "nojan_password",
  roles: [
    {
      role: "readWrite",
      db: "nojan",
    },
  ],
});

// Create collections if they don't exist
db.createCollection("users");
db.createCollection("histories");

print("MongoDB initialized successfully");
