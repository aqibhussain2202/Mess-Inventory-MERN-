const mongoose = require("mongoose");

// Replace the URI with your local MongoDB connection string
const uri = "mongodb://localhost:27017/mydatabase";

function main() {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Successfully connected to MongoDB locally");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB:", err);
        });
}

module.exports = { main };
