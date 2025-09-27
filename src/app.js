const express = require("express");
const cookieParser = require("cookie-parser")
const ConnectDb = require('./config/db')
const indexRoute = require('./routes/index')
const app = express();
app.use(express.json())
app.use(cookieParser())
app.use("/api", indexRoute)

ConnectDb().then(() => {
  console.log("connected to db successfully..")
  app.listen(7000, (req, res) => {
    console.log("server started....");
  });
}).catch((err) => {
  console.log("error connecting to db")
})
