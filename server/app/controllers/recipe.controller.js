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
    published: false
  });
  let recipeId;

  try {
    const response = await recipe.save();
    recipeId = response._id
  } catch (error) {
    res.status(500).send({ message: error.message || "Error occured while creating recipe." })
  }

  try {
    const response = await User.findOneAndUpdate({ uid }, { $push: { recipes: recipeId }}); 
    if (response.length === 0) {
        res.status(404).send({ message: "Unable to update user with id=" + id + " with new recipe" });
    }
    res.send({ message: "Successfully created recipe" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Error updating user with id=" + id + " with new recipe" });
  }
};

// Retrieve all Recipes from the database.
// exports.findAll = (req, res) => {
//   const title = req.query.title;
//   var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

//   Recipe.find(condition)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving recipes."
//       });
//     });
// };

// Find a single Recipe with an id
// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Recipe.findById(id)
//     .then(data => {
//       if (!data)
//         res.status(404).send({ message: "Not found Recipe with id " + id });
//       else res.send(data);
//     })
//     .catch(err => {
//       res
//         .status(500)
//         .send({ message: "Error retrieving Recipe with id=" + id });
//     });
// };

// Update a Recipe by the id in the request
// exports.update = (req, res) => {
//   if (!req.body) {
//     return res.status(400).send({
//       message: "Data to update can not be empty!"
//     });
//   }

//   const id = req.params.id;

//   Recipe.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot update Recipe with id=${id}. Maybe Recipe was not found!`
//         });
//       } else res.send({ message: "Recipe was updated successfully." });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Recipe with id=" + id
//       });
//     });
// };

// Delete a Recipe with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Recipe.findByIdAndRemove(id, { useFindAndModify: false })
//     .then(data => {
//       if (!data) {
//         res.status(404).send({
//           message: `Cannot delete Recipe with id=${id}. Maybe Recipe was not found!`
//         });
//       } else {
//         res.send({
//           message: "Recipe was deleted successfully!"
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Recipe with id=" + id
//       });
//     });
// };

// Delete all Recipes from the database.
// exports.deleteAll = (req, res) => {
//   Recipe.deleteMany({})
//     .then(data => {
//       res.send({
//         message: `${data.deletedCount} Recipes were deleted successfully!`
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all recipes."
//       });
//     });
// };

exports.publishRecipe = async (req, res) => {
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

exports.findAllPublished = async (req, res) => {
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
