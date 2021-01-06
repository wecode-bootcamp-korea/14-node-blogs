const express = require("express");
const routes = require("./routes");
const logger = require("morgan")("dev");
const app = express();

app.use(express.json());
app.use(logger);
app.use(routes);

module.exports = app;
