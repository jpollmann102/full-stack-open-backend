const User = require('../models/user');

const nonExistingId = async () => {
  const user = new User({
    username: "toremove",
    password: "secret"
  });
  await user.save();
  await user.remove();

  return user._id.toString();
}

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
}

module.exports = {
  nonExistingId, usersInDb
}
