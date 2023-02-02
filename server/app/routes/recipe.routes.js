module.exports = app => {
  const recipe = require("../controllers/recipe.controller.js");
  var router = require("express").Router();

  router.post("/create", recipe.create);
  // router.get("/", recipe.findAll);
  router.put("/publish/:id", recipe.publishRecipe)
  router.put("/unpublish/:id", recipe.unpublishRecipe)
  router.get("/publish", recipe.findAllPublished);

  // // Retrieve a single recipe with id
  // router.get("/:id", recipe.findOne);

  // // Update a recipe with id
  // router.put("/:id", recipe.update);

  // // Delete a recipe with id
  // router.delete("/:id", recipe.delete);

  // // Create a new recipe
  // router.delete("/", recipe.deleteAll);

  app.use("/api/recipe", router);
};
