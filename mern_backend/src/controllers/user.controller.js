import User from '../models/user.model';
import _ from 'lodash';
import errorHandler from '../helpers/dbErrorHandler';

const create = (req, res, next) => {
  console.log(req.body);
  const user = new User(req.body);
  user.save((err, result) => {
    if (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
    res.status(200).json({ message: 'Successfully created a new user.' });
  });
};
const list = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
    res.status(200).json(users);
  }).select('name email update created');
};
const userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found!' });
    }
    req.profile = user;
    next();
  });
};
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.status(200).json(req.profile);
};
const update = (req, res, next) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save((err) => {
    if (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    res.status(200).json(user);
  });
};
const remove = (req, res, next) => {
  let user = req.profile;
  user.remove((err, deleteUser) => {
    if (err) {
      return res.status(400).json({ error: errorHandler.getErrorMessage(err) });
    }
    deleteUser.hashed_password = undefined;
    deleteUser.salt = undefined;
    res.status(200).json(deleteUser);
  });
};

export default { create, list, userById, read, update, remove };
