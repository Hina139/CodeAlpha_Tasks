const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    username: String,
    mediaUrl: String,
    mediaType: String,
    caption: String,
    // Likes ko array banaya taake user duplicate like na kar saky
    likes: { type: [String], default: [] }, 
    favorites: { type: [String], default: [] }, // Usernames store karne k liye
    comments: [{ 
        username: String, 
        text: String, 
        date: { type: Date, default: Date.now } 
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);