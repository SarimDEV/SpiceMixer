module.exports = app => {
  const recipe = require("../controllers/recipe.controller.js");
  var router = require("express").Router();

  router.post("/create", recipe.create);
  router.get("/read/:id", recipe.findOne);
  router.put("/update/:id", recipe.update);
  router.delete("/delete/:id", recipe.delete);
  router.put("/publish/:id", recipe.publishRecipe)
  router.put("/unpublish/:id", recipe.unpublishRecipe)
  router.get("/publish", recipe.findAllPublished);

  app.use("/api/recipe", router);
};
