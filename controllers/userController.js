// const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // get specific user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => 
            !user
                ? res.status(404).json({ message: 'No user with that ID'})
                : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // creates new user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // updates user by its _id
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No user with this id!' })
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // deletes user by its _id
    deleteUser(req, res) {
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
            !user
                ? res.status(404).json({ message: 'No such thing exists' })
                : Thought.findOneAndUpdate(
                    { students: req.params.userId },
                    { $pull: { users: req.params.userId }},
                    { new: true }
                )
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'User deleted, but no thoughts found'
                })
                : res.json({ message: 'User successfully deleted' })
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // adds a new friend to a user's friends list
    addFriend(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json( { message: 'No user found with that ID :(' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // deletes a friend from a user's friend list
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: { $in: req.params.friendId } } },
            { runValidators: true, new: true }
        )
            // .then((user) =>
            //     !user
            //         ? res
            //             .status(404)
            //             .json({ message: 'No user found with that ID :(' })
            //         // : res.json(user)
            //         : User.deleteOne({ _id: { $in: user.friends } })
            // )
            .then(() => res.json({ message: 'Friend deleted' }))
            .catch((err) => res.status(500).json(err));
    }
}