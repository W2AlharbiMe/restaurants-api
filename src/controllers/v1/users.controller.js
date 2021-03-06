const { User } = require("../../models/User");

async function index(request, response) {
  const users = await User.find();
  response.send(users);
}

async function show(request, response) {
  const { id } = request.params;
  const user = await User.findById(id);

  if (user) return response.send(user);

  return response.status(404).send({ message: "User Not Found" });
}

async function create(request, response) {
  const { firstName, lastName, email, password } = request.body;

  const result = await User.findOne({ email });
  if (result) {
    return response.status(400).send({ message: "User is Exists." });
  }

  let user = new User({ firstName, lastName, email, password });

  await user.encrypt(password);
  user = await user.save();
  user = user.toJSON();

  response.status(201).send({ message: "Created", user });
}

async function update(request, response) {
  const { id } = request.params;
  const { firstName, lastName, email, password } = request.body;

  const user = await User.findByIdAndUpdate(
    id,
    { firstName, lastName, email, password },
    { new: true, omitUndefined: true }
  );

  if (user) {
    if (password) {
      await user.encrypt(password);
      await user.save();
    }

    return response.send({ message: "Updated", user });
  }

  return response.status(404).send({ message: "User Not Found" });
}

async function destroy(request, response) {
  const { id } = request.params;
  const user = await User.findByIdAndDelete(id);

  if (user) return response.send({ message: "Deleted", user });

  return response.status(404).send({ message: "User Not Found" });
}

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
