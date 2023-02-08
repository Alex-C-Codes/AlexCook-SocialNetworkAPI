// const { ObjectId } = require('mongoose').Types;
const { reset } = require('nodemon');
const { User, Thought } = require('../models');

module.exports = {
    // get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // get specific thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID'})
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // creates new thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // updates thought by its _id
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No user with this id!' })
                : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // deletes thought by its _id
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
        !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : Thought.findOneAndUpdate(
                { students: req.params.thoughtId },
                { $pull: { users: req.params.thoughtId }},
                { new: true }
            )
        )
        .then((thought) => res.json({ message: 'Thought deleted' }))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    },
    // adds a new reaction to a user's thought
    addReaction(req, res) {
        console.log('You are adding a friend');
        console.log(req.body);
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json( { message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // deletes a reaction from a user's thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'No reaction with that ID' })
                : Thought.deleteOne({ _id: { $in: thought.reactions } })
            )
            .then(() => res.json({ message: 'Reaction deleted' }))
            .catch((err) => res.status(500).json(err));
    }
}