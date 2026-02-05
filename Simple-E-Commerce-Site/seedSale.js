const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/E-CommerceSite')
    .then(() => console.log("MODEVA: Seeding SALE Products..."))
    .catch(err => console.log(" Connection Error:", err));

const Product = mongoose.model('Product', new mongoose.Schema({
    name: String, category: String, price: Number, oldPrice: Number, image: String, filterClass: String
}));

const saleProducts = [
    { name: "Mirror Work Chiffon Suite", category: "Festive Wear", price: 12900, oldPrice: 18500, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGtB83XusmN4yLqs7lTL8E0ezxMqbZgcbuaQ&s" },
    { name: "Hand-Embroidered Jilla Kurta", category: "Luxe", price: 8400, oldPrice: 12000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcqH4knyseUM26DPhZQIV1jfCAy_xXxqKMwA&s" },
    { name: "Deep Rust Velvet Ensemble", category: "Winter Formal", price: 18500, oldPrice: 25000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSITNr0xDNaeqjFzKXcsouqfIzFSqrv-eVxZg&s" },
    { name: "Luxury Organza Pishwas", category: "Party Wear", price: 15000, oldPrice: 22000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjVW1dHFwo40dgeoLfBad_1vNOl8sQvz1gw&s" },
    { name: "Handcrafted Tilla Khussa", category: "Footwear", price: 3500, oldPrice: 5500, filterClass: "acc", image: "https://plus.unsplash.com/premium_photo-1682096103505-f3d52c81a34f?w=600" },
    { name: "Antique Kundan Set", category: "Jewelry", price: 8500, oldPrice: 12000, filterClass: "acc", image: "https://images.unsplash.com/photo-1721807644561-9efcabee5c42?w=600" }
];

const seedSale = async () => {
    try {
        // Yaad rakho: .deleteMany({}) purana saara data (home wala bhi) uda dega. 
        // Agar aap chahte ho ke home wala data rahe, to deleteMany mat chalana.
        await Product.insertMany(saleProducts);
        console.log(" SALE products added successfully!");
        mongoose.connection.close();
    } catch (err) { console.log(err); }
};

seedSale();