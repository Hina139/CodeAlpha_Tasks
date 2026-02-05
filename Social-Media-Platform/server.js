// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const path = require('path');
// // const bcrypt = require('bcryptjs');
// // const multer = require('multer'); // Multer add kar diya
// // const User = require('./models/User');
// // const Post = require('./models/Post'); 

// // const app = express();

// // // Middlewares
// // app.use(express.json());
// // app.use(cors());
// // app.use(express.static(path.join(__dirname, '../frontend')));
// // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // // --- MULTER CONFIG (Files save karne ke liye) ---
// // const storage = multer.diskStorage({
// //     destination: (req, file, cb) => {
// //         cb(null, path.join(__dirname, 'uploads')); // Folder path jahan files save hongi
// //     },
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + '-' + file.originalname);
// //     }
// // });
// // const upload = multer({ storage });

// // // MongoDB Connection
// // const MONGO_URI = "mongodb://127.0.0.1:27017/socialApp";
// // mongoose.connect(MONGO_URI)
// // .then(() => console.log("✅ MongoDB Connected"))
// // .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // // --- AUTH ROUTES ---
// // app.post('/api/auth/signup', async (req, res) => {
// //     try {
// //         const { username, email, password } = req.body;
// //         let userExists = await User.findOne({ email });
// //         if (userExists) return res.status(400).json({ msg: "Email already registered" });
// //         const salt = await bcrypt.genSalt(10);
// //         const hashedPassword = await bcrypt.hash(password, salt);
// //         const newUser = new User({ username, email, password: hashedPassword });
// //         const savedUser = await newUser.save();
// //         res.status(201).json({ msg: "Success", user: { username: savedUser.username, email: savedUser.email } });
// //     } catch (err) { res.status(500).json({ msg: err.message }); }
// // });

// // app.post('/api/auth/login', async (req, res) => {
// //     try {
// //         const { email, password } = req.body;
// //         const user = await User.findOne({ email });
// //         if (!user) return res.status(400).json({ msg: "User nahi mila!" });
// //         const isMatch = await bcrypt.compare(password, user.password);
// //         if (!isMatch) return res.status(400).json({ msg: "Password galat hai!" });
// //         res.json({ msg: "Success", user: { username: user.username, email: user.email } });
// //     } catch (err) { res.status(500).json({ msg: "Server error" }); }
// // });

// // // --- POST ROUTES ---

// // // Create Post Route
// // app.post('/api/posts/create', upload.single('media'), async (req, res) => {
// //     try {
// //         const { username, caption } = req.body;
// //         if (!req.file) return res.status(400).json({ msg: "File upload nahi hui!" });

// //         const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        
// //         const newPost = new Post({
// //             username,
// //             caption,
// //             mediaUrl: `/uploads/${req.file.filename}`,
// //             mediaType,
// //             likes: [], 
// //             favorites: []
// //         });

// //         await newPost.save();
// //         res.status(201).json({ msg: "Success", post: newPost });
// //     } catch (err) {
// //         res.status(500).json({ msg: "Server error: " + err.message });
// //     }
// // });

// // // Get All Posts
// // app.get('/api/posts', async (req, res) => {
// //     const posts = await Post.find().sort({ createdAt: -1 });
// //     res.json(posts);
// // });

// // // Like/Unlike Route
// // app.post('/api/posts/like/:id', async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         const { username } = req.body;
// //         if (post.likes.includes(username)) {
// //             post.likes = post.likes.filter(u => u !== username);
// //         } else {
// //             post.likes.push(username);
// //         }
// //         await post.save();
// //         res.json(post);
// //     } catch (err) { res.status(500).json({ msg: "Like error" }); }
// // });

// // // --- ADDED NEW ROUTES (Comment & Delete) ---

// // // Comment Route
// // app.post('/api/posts/comment/:id', async (req, res) => {
// //     try {
// //         const post = await Post.findById(req.params.id);
// //         if (!post) return res.status(404).json({ msg: "Post nahi mili!" });
        
// //         post.comments.push({ 
// //             username: req.body.username, 
// //             text: req.body.text 
// //         });
        
// //         await post.save();
// //         res.json(post);
// //     } catch (err) { 
// //         res.status(500).json({ msg: "Comment error" }); 
// //     }
// // });

// // // Delete Post Route
// // app.delete('/api/posts/:id', async (req, res) => {
// //     try {
// //         await Post.findByIdAndDelete(req.params.id);
// //         res.json({ msg: "Post deleted" });
// //     } catch (err) { 
// //         res.status(500).json({ msg: "Delete error" }); 
// //     }
// // });

// // // --- END OF NEW ROUTES ---

// // // Simple Follow Route
// // app.post('/api/auth/follow', async (req, res) => {
// //     res.json({ msg: "Success", followed: true });
// // });

// // const PORT = 5000;
// // app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));



// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const bcrypt = require('bcryptjs');
// const multer = require('multer');
// const User = require('./models/User');
// const Post = require('./models/Post'); 

// const app = express();

// app.use(express.json());
// app.use(cors());
// app.use(express.static(path.join(__dirname, '../frontend')));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, path.join(__dirname, 'uploads')); },
//     filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
// });
// const upload = multer({ storage });

// const MONGO_URI = "mongodb://127.0.0.1:27017/socialApp";
// mongoose.connect(MONGO_URI)
// .then(() => console.log("✅ MongoDB Connected"))
// .catch(err => console.error("❌ MongoDB Connection Error:", err));

// // --- AUTH ROUTES ---
// app.post('/api/auth/signup', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         let userExists = await User.findOne({ email });
//         if (userExists) return res.status(400).json({ msg: "Email already registered" });
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
//         const newUser = new User({ username, email, password: hashedPassword });
//         const savedUser = await newUser.save();
//         res.status(201).json({ msg: "Success", user: { username: savedUser.username, email: savedUser.email } });
//     } catch (err) { res.status(500).json({ msg: err.message }); }
// });

// app.post('/api/auth/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ msg: "User nahi mila!" });
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ msg: "Password galat hai!" });
//         res.json({ msg: "Success", user: { username: user.username, email: user.email } });
//     } catch (err) { res.status(500).json({ msg: "Server error" }); }
// });

// // --- UPDATED FOLLOW ROUTE (Now saves to MongoDB) ---
// app.post('/api/auth/follow', async (req, res) => {
//     try {
//         const { currentUser, targetUser } = req.body;
//         const user = await User.findOne({ username: currentUser });
//         const target = await User.findOne({ username: targetUser });

//         if (!user || !target) return res.status(404).json({ msg: "User not found" });

//         if (user.following.includes(targetUser)) {
//             // Unfollow
//             user.following = user.following.filter(u => u !== targetUser);
//             target.followers = target.followers.filter(u => u !== currentUser);
//         } else {
//             // Follow
//             user.following.push(targetUser);
//             target.followers.push(currentUser);
//         }
//         await user.save();
//         await target.save();
//         res.json({ msg: "Success", following: user.following });
//     } catch (err) { res.status(500).json({ msg: "Follow error" }); }
// });

// // --- POST ROUTES ---
// app.post('/api/posts/create', upload.single('media'), async (req, res) => {
//     try {
//         const { username, caption } = req.body;
//         if (!req.file) return res.status(400).json({ msg: "File upload nahi hui!" });
//         const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
//         const newPost = new Post({
//             username, caption, mediaUrl: `/uploads/${req.file.filename}`, mediaType,
//             likes: [], favorites: []
//         });
//         await newPost.save();
//         res.status(201).json({ msg: "Success", post: newPost });
//     } catch (err) { res.status(500).json({ msg: "Server error: " + err.message }); }
// });

// app.get('/api/posts', async (req, res) => {
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.json(posts);
// });

// app.post('/api/posts/like/:id', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         const { username } = req.body;
//         if (post.likes.includes(username)) {
//             post.likes = post.likes.filter(u => u !== username);
//         } else {
//             post.likes.push(username);
//         }
//         await post.save();
//         res.json(post);
//     } catch (err) { res.status(500).json({ msg: "Like error" }); }
// });

// app.post('/api/posts/comment/:id', async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ msg: "Post nahi mili!" });
//         post.comments.push({ username: req.body.username, text: req.body.text });
//         await post.save();
//         res.json(post);
//     } catch (err) { res.status(500).json({ msg: "Comment error" }); }
// });

// app.delete('/api/posts/:id', async (req, res) => {
//     try {
//         await Post.findByIdAndDelete(req.params.id);
//         res.json({ msg: "Post deleted" });
//     } catch (err) { res.status(500).json({ msg: "Delete error" }); }
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));







const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const User = require('./models/User');
const Post = require('./models/Post'); 

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, path.join(__dirname, 'uploads')); },
    filename: (req, file, cb) => { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

const MONGO_URI = "mongodb://127.0.0.1:27017/socialApp";
mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ msg: "Email already registered" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json({ msg: "Success", user: { username: savedUser.username, email: savedUser.email } });
    } catch (err) { res.status(500).json({ msg: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User nahi mila!" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Password galat hai!" });
        res.json({ msg: "Success", user: { username: user.username, email: user.email } });
    } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

// --- NAYA ROUTE: User ka data hasil karne ke liye (Followers count ke liye) ---
app.get('/api/users/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ msg: "User nahi mila" });
        res.json(user);
    } catch (err) { res.status(500).json({ msg: "Server error" }); }
});

// --- FOLLOW ROUTE ---
app.post('/api/auth/follow', async (req, res) => {
    try {
        const { currentUser, targetUser } = req.body;
        const user = await User.findOne({ username: currentUser });
        const target = await User.findOne({ username: targetUser });

        if (!user || !target) return res.status(404).json({ msg: "User not found" });

        if (user.following.includes(targetUser)) {
            user.following = user.following.filter(u => u !== targetUser);
            target.followers = target.followers.filter(u => u !== currentUser);
        } else {
            user.following.push(targetUser);
            target.followers.push(currentUser);
        }
        await user.save();
        await target.save();
        res.json({ msg: "Success", following: user.following });
    } catch (err) { res.status(500).json({ msg: "Follow error" }); }
});

// --- POST ROUTES ---
app.post('/api/posts/create', upload.single('media'), async (req, res) => {
    try {
        const { username, caption } = req.body;
        if (!req.file) return res.status(400).json({ msg: "File upload nahi hui!" });
        const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
        const newPost = new Post({
            username, caption, mediaUrl: `/uploads/${req.file.filename}`, mediaType,
            likes: [], favorites: []
        });
        await newPost.save();
        res.status(201).json({ msg: "Success", post: newPost });
    } catch (err) { res.status(500).json({ msg: "Server error: " + err.message }); }
});

app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
});

app.post('/api/posts/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const { username } = req.body;
        if (post.likes.includes(username)) {
            post.likes = post.likes.filter(u => u !== username);
        } else {
            post.likes.push(username);
        }
        await post.save();
        res.json(post);
    } catch (err) { res.status(500).json({ msg: "Like error" }); }
});

app.post('/api/posts/comment/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: "Post nahi mili!" });
        post.comments.push({ username: req.body.username, text: req.body.text });
        await post.save();
        res.json(post);
    } catch (err) { res.status(500).json({ msg: "Comment error" }); }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ msg: "Post deleted" });
    } catch (err) { res.status(500).json({ msg: "Delete error" }); }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));