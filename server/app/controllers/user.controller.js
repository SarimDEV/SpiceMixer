const db = require("../models");
const User = db.user;

exports.create = async (req, res) => {
  console.log("CREATE USER ", req)
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
  if (!req.params.id) {
    res.status(400).send({ message: `Content cannot be empty` });
  }
  const id = req.params.id;

  try {
    const response = await User.find({ uid: id }).populate('recipes'); 
    console.log(response)
    if (response.length === 0) {
        res.status(404).send({ message: `Unable to get user with id=${id}` });
    }
    else res.send(response);
  } catch (error) {
    res.status(500).send({ message: error.message || `Error retrieving user with id=${id}` });
  }
};
