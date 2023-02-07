const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: true,
            maxLength: 280
        },
        username: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            get: (date) => { if (date) return date.toISOString().split("T") [0] }
        }
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
);

module.exports = reactionSchema;