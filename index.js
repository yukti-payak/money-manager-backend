require("dotenv").config();

const express = require ("express");
const mongoose = require("mongoose");
const cors = require("cors");
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
app.use('/api/transactions', transactionRoutes);

// mongodb connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error.message);
    process.exit(1);
  });

// testing route 
app.get("/" ,(req, res) =>{
    res.send("Testing route");
})

app.listen(3000 , () =>{
    console.log("Server is running on port 3000");
})