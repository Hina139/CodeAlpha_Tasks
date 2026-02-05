const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json()); 


mongoose.connect('mongodb://localhost:27017/E-CommerceSite')
    .then(() => console.log(" MODEVA Database Connected!"))
    .catch(err => console.error(" DB Connection Error:", err));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: { type: String, required: true }
}));

const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    oldPrice: Number,
    image: String,
    filterClass: String 
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    items: { type: Array, required: true }, 
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);


app.post('/register', async (req, res) => {
    try { 
        const newUser = new User(req.body); 
        await newUser.save(); 
        res.status(200).send({ message: "Account Created!" }); 
    } catch (err) { 
        res.status(400).send({ message: "Email already exists!" }); 
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.status(200).send({ message: "Login Successful", user });
    else res.status(400).send({ message: "Wrong Credentials" });
});
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) { 
        res.status(500).json({ message: "Server Error" }); 
    }
});


app.get('/api/products/:id', async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Product Not Found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: "Invalid ID format" });
    }
});


app.post('/api/orders', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error: Order save nahi hua." });
    }
});


app.get('/api/my-orders', async (req, res) => {
    try {
        const userEmail = req.query.email;
        const orders = await Order.find({ email: userEmail }).sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});


app.put('/update-profile', async (req, res) => {
    const { email, username, oldPassword, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check if current password is correct
        if (user.password !== oldPassword) {
            return res.status(401).json({ message: "Incorrect current password!" });
        }

        // Update info
        user.username = username;
        if (newPassword) user.password = newPassword;

        await user.save();
        res.json({ message: "Profile Updated Successfully!" });
    } catch (err) {
        res.status(500).json({ message: "Server Error during update" });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(` SERVER IS RUNNING ON PORT ${PORT}`));