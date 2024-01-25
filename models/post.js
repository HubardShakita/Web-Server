const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    
    first_team: {
        type: String,
        required: true,
    },

    second_team: {
        type: String,
        required: true,
    },

    match: {
        type: String,
        required: true,
    },
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;