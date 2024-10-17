const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hi i am working");
});
app.listen(5000, () => {
  console.log("Now running on port 5000");
});
