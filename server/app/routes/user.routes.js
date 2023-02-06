module.exports = app => {
    const user = require("../controllers/user.controller.js");
    var router = require("express").Router();
  
    router.post("/create", user.create);
    router.get("/read/:id", user.getUserInfo);
  
    app.use("/api/user", router);
  };