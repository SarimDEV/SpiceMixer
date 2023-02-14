const db = require("../models");
const Recipe = db.recipe;
const User = db.user;

exports.create = async (req, res) => {
  if (!req.body.title || !req.body.ingredients || !req.body.uid) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  const uid = req.body.uid
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    published: false,
    image: req.body.image
  });
  let recipeId;

  try {
    const response = await recipe.save();
    recipeId = response._id
  } catch (error) {
    return res.status(500).send({ message: error.message || "Error occured while creating recipe." })
  }

  try {
    const response = await User.findOneAndUpdate({ uid }, { $push: { recipes: recipeId }}); 
    if (response.length === 0) {
        res.status(404).send({ message: `Unable to update user with id=${id} with new recipe` });
    }
    res.send({ message: "Successfully created recipe" })
  } catch (error) {
    res.status(500).send({ message: error.message || `Error updating user with id=${id} with new recipe` });
  }
};

exports.findOne = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: `Content cannot be empty` });
  }
  const id = req.params.id;

  try {
    const response = await Recipe.findById(id)
    if (!response) {
      res.status(404).send({ message: `Error retreving recipe with id=${id}. Recipe not found` });
    }
    else res.send(response)
  } catch(error) {
    res.status(500).send({ message: error.message || `Error retrieving recipe with id=${id}` });
  }
};

exports.update = async (req, res) => {
  if (!req.body.title || !req.body.ingredients || !req.body.description || !req.params.id) {
    return res.status(400).send({ message: "Content cannot be empty!"});
  }
  const id = req.params.id;
  const update = {
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    image: req.body.image
  }

  try {
    const response = await Recipe.findByIdAndUpdate(id, update)
    if (!response) {
      res.status(404).send({
        message: `Cannot update recipe with id=${id}. Recipe not found!`
      });
    } 
    else res.send({ message: "Recipe was updated successfully." });
  } catch(error) {
    res.status(500).send({
      message: error.message || `Error updating recipe with id=${id}`
    });
  }
};

exports.delete = async (req, res) => {
  if (!req.params.id || !req.body.uid) {
    console.log("recipe id: ", req.params.id, " UID: ", req.body.uid)
    return res.status(400).send({ message: `Content cannot be empty` });
  }
  const recipeId = req.params.id;
  const uid = req.body.uid

  try {
    const response = await Recipe.findByIdAndRemove(recipeId)
    if (!response) {
      console.log("something wrong witu this")
      return res.status(404).send({
        message: `Recipe was not found, error deleting recipe with id=${recipeId}`
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: error.message || `Error deleting recipe with id=${recipeId}`
    });
  }

  try {
    const response = await User.findOneAndUpdate({ uid }, { $pullAll: { recipes: [ recipeId ] }});
    if (!response) {
      res.status(404).send({
        message: `Recipe was not found, error deleting recipe from user table with id=${recipeId}`
      });
    } else res.send({ response, message: "Successfully deleted recipe" });
  } catch(error) {
    res.status(500).send({
      message: error.message || `Error updating user table with delete recipe with id=${recipeId}`
    });
  }
};

exports.publishRecipe = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: `Content cannot be empty` });
  }
  const id = req.params.id
  const update = { published: true }

  try {
    const response = await Recipe.findByIdAndUpdate(id, update);
    if (!response ) {
      res.status(404).send({ message: "Error finding and sharing recipe." })
    }
    else res.send({ response, message: "Recipe was successfully shared" })
  } catch (error) {
    res.status(500).send({ 
      message: error.message || "Error sharing recipe." 
    })
  }
}

exports.unpublishRecipe = async (req, res) => {
  if (!req.params.id) {
    res.status(400).send({ message: `Content cannot be empty` });
  }
  const id = req.params.id
  const update = { published: false }

  try {
    const response = await Recipe.findByIdAndUpdate(id, update);
    if (!response ) {
      res.status(404).send({ message: "Error finding and unsharing recipe." })
    }
    else res.send({ response, message: "Recipe was successfully unshared" })
  } catch (error) {
    res.status(500).send({ 
      message: error.message || "Error unsharing recipe." 
    })
  }
}

exports.findAllPublished = async (_, res) => {
  try {
    const response = await Recipe.find({ published: true })
    if (!response ) {
      res.status(404).send({ message: "Error finding all shared recipes." })
    }
    else res.send({ response, message: "Successfully found all recipes" })
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error occurred while retrieving shared recipes."
    });
  }
};
