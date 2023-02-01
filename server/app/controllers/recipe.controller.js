const db = require("../models");
const Recipe = db.recipe;

// Create and Save a new Recipe
exports.create = async (req, res) => {
  console.log("attempt to create")

  // Validate request
  if (!req.body.title || !req.body.ingredients) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Recipe
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    description: req.body.description,
    published: false
  });

  // Save Recipe in the database
  try {
    const response = await recipe.save();
    res.send({ response, message: "Successfully created recipe" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occured while creating a Recipe." })
  }
};

// Retrieve all Recipes from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Recipe.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving recipes."
      });
    });
};

// Find a single Recipe with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Recipe.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Recipe with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Recipe with id=" + id });
    });
};

// Update a Recipe by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Recipe.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Recipe with id=${id}. Maybe Recipe was not found!`
        });
      } else res.send({ message: "Recipe was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Recipe with id=" + id
      });
    });
};

// Delete a Recipe with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Recipe.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Recipe with id=${id}. Maybe Recipe was not found!`
        });
      } else {
        res.send({
          message: "Recipe was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Recipe with id=" + id
      });
    });
};

// Delete all Recipes from the database.
exports.deleteAll = (req, res) => {
  Recipe.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Recipes were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all recipes."
      });
    });
};

exports.publishRecipe = async (req, res) => {
  const _id = req.params.id
  const update = { published: true }

  try {
    const response = await Recipe.findByIdAndUpdate(_id, update);
    res.send({ response, message: "Recipe was successfully shared" })
  } catch (error) {
    res.status(500).send({ message: "Error sharing recipe." })
  }
}

// Find all published Recipes
exports.findAllPublished = async (req, res) => {
  try {
    const response = await Recipe.find({ published: true })
    res.send({ response, message: "Successfully found all recipes" })
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving recipes."
    });
  }
};
