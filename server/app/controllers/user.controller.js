const db = require("../models");
const User = db.user;

exports.create = async (req, res) => {
  console.log("Creating new user")

  if (!req.body.uid || !req.body.name ) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const user = new User({
    uid: req.body.uid,
    name: req.body.name,
    recipes: [],
  });

  try {
    const response = await user.save();
    res.send({ response, message: "Successfully created user" })
  } catch (error) {
    res.status(500).send({ message: error.message || "Some error occured while creating user" })
  }
};

exports.getUserInfo = async (req, res) => {
  const id = req.params.id;

  try {
    const response = await User.find({ uid: id }).populate('recipes'); 
    console.log(response)
    if (response.length === 0) {
        res.status(404).send({ message: "Unable to get user with id=" + id });
    }
    else res.send(response);
  } catch (error) {
    res.status(500).send({ message: error.message || "Error retrieving user with id=" + id });
  }
};

exports.getUserRecipes = async (req, res) => {
    const id = req.params.id;
  
    try {
      const response = await User.find({ uid: id }); 
      console.log(response)
      if (response.length === 0) {
          res.status(404).send({ message: "Unable to get user with id=" + id });
      }
      res.send(response);
    } catch (error) {
      res.status(500).send({ message: error.message || "Error retrieving user with id=" + id });
    }
  };

// // Update a Recipe by the id in the request
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

// // Delete a Recipe with the specified id in the request
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
