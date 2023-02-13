const express = require("express");
const path = require("path"); 

const app = express();

//settings

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middlewares

// routes
app.use(require("./routes/routes.js"));

// static files
app.use(express.static(path.join(__dirname, "public")));

//404
app.use((req, res) => {
  res.status(404).end("404 Not Found");
});

app.listen(app.get("port"), () => {
  console.log("server on port 3000");
});
