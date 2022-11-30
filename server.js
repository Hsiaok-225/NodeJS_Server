require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorLogger = require("./middleware/errorLogger");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3500;

mongoose.connect(process.env.DATABASE_URI).catch((err) => console.log(err));

app.use(logger);

// check credentials before CORS
// setting credentials both frontend & backend
app.use(credentials);

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));
// json
app.use(express.json());
// cookies
app.use(cookieParser());

// serve static files
// app.use default route'/'
app.use("/", express.static(path.join(__dirname, "/public")));

// Public routes
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/auth"));
app.use("/register", require("./routes/register"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// VerifyJWT means user needs loggin success to get auth
// if ok then verifyRoles
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorLogger);

// once 'connect' to DB -> run server
mongoose.connection.once("open", () => {
  console.log("Connect to Mongo Success");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
