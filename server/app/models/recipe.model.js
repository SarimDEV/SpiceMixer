module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      title: String,
      ingredients: [{
        name: String,
        amount: Number
      }],
      description: String,
      published: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Recipe = mongoose.model("recipe", schema);
  return Recipe;
};
