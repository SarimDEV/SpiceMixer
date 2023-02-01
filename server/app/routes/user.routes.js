module.exports = app => {
    const user = require("../controllers/user.controller.js");
    var router = require("express").Router();
  
    router.post("/create", user.create);
    router.get("/:id", user.getUserInfo);
  
    // router.put("/publish/:id", recipe.publishRecipe)
  
    // router.put("/unpublish/:id", recipe.unpublishRecipe)
  
    // // // Retrieve all published recipes
    // router.get("/publish", recipe.findAllPublished);
  
    // // Retrieve a single recipe with id
    // router.get("/:id", recipe.findOne);
  
    // // Update a recipe with id
    // router.put("/:id", recipe.update);
  
    // // Delete a recipe with id
    // router.delete("/:id", recipe.delete);
  
    // // Create a new recipe
    // router.delete("/", recipe.deleteAll);
  
    app.use("/api/user", router);
  };