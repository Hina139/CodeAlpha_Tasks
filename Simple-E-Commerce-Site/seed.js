const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/E-CommerceSite')
    .then(() => console.log(" MODEVA: Connecting for Full Inventory Seed..."))
    .catch(err => console.log(" Connection Error:", err));


const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    oldPrice: Number, 
    image: String,
    filterClass: String
});

const Product = mongoose.model('Product', productSchema);

const allProducts = [
    { name: "Elegant Silk Gown", category: "Formal Woman", price: 12500, filterClass: "formal", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500" },
    { name: "Classic Italian Suit", category: "Formal Men", price: 25000, filterClass: "formal", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500" },
    { name: "Lace Evening Dress", category: "Formal Woman", price: 10800, filterClass: "formal", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500" },
    { name: "Executive Blazer", category: "Formal Men", price: 15000, filterClass: "formal", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=500" },
    { name: "Velvet Formal Dress", category: "Formal Woman", price: 14500, filterClass: "formal", image: "https://images.unsplash.com/photo-1756483510820-4b9302a27556?q=80&w=687" },
    { name: "Grey Tailored Dress", category: "Formal Men", price: 11200, filterClass: "formal", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500" },
    { name: "Minimalist Mono", category: "Modern Style", price: 6500, filterClass: "modern", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500" },
    { name: "Urban Chic Set", category: "Modern Style", price: 8200, filterClass: "modern", image: "https://images.unsplash.com/photo-1745834311248-f19d424c5398?q=80&w=687" },
    { name: "Pleated Midi", category: "Modern Style", price: 7400, filterClass: "modern", image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?w=500" },
    { name: "Daily Denim Jacket", category: "Casual Style", price: 4500, filterClass: "casual", image: "https://images.unsplash.com/photo-1641943632479-3798ef1e14c6?q=80&w=687" },
    { name: "Leather Tote", category: "Bags", price: 8500, filterClass: "acc", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
    { name: "Classic Silver Watch", category: "Watches", price: 18000, filterClass: "acc", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },


    { name: "Mirror Work Chiffon Suite", category: "Festive Wear", price: 12900, oldPrice: 18500, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGtB83XusmN4yLqs7lTL8E0ezxMqbZgcbuaQ&s" },
    { name: "Hand-Embroidered Jilla Kurta", category: "Luxe", price: 8400, oldPrice: 12000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcqH4knyseUM26DPhZQIV1jfCAy_xXxqKMwA&s" },
    { name: "Deep Rust Velvet Ensemble", category: "Winter Formal", price: 18500, oldPrice: 25000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSITNr0xDNaeqjFzKXcsouqfIzFSqrv-eVxZg&s" },
    { name: "Luxury Organza Pishwas", category: "Party Wear", price: 15000, oldPrice: 22000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDjVW1dHFwo40dgeoLfBad_1vNOl8sQvz1gw&s" },
    { name: "Classic Waistcoat", category: "Men's Formal", price: 6600, oldPrice: 9500, filterClass: "formal", image: "https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=600" },
    { name: "Raw Silk Straight Suite", category: "Luxury Silk", price: 10500, oldPrice: 15000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8lEJ8TfekCssA0Y630CRu4s9k69cviga-_g&s" },
    { name: "Pure White Chikankari Suite", category: "Traditional Luxe", price: 9800, oldPrice: 14000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3_w_ORYU_B7fYJ-IvGTlCzxJKd8RpNJKjdQ&s" },
    { name: "Classic Ivory Sherwani", category: "Wedding Wear", price: 32000, oldPrice: 45000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCQEFbdUc832ckyMNSTyzlk41sJ5KUMbM6Ow&s" },
    { name: "Terracotta Net Formal Gown", category: "Earthy Formal", price: 13300, oldPrice: 19000, filterClass: "formal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqwGBcShO9S6D6kdWRLYdbanpGXC7EWtV1cg&s" },

   
    { name: "Handcrafted Tilla Khussa", category: "Footwear", price: 3500, oldPrice: 5500, filterClass: "acc", image: "https://plus.unsplash.com/premium_photo-1682096103505-f3d52c81a34f?w=600" },
    { name: "Antique Kundan Set", category: "Jewelry", price: 8500, oldPrice: 12000, filterClass: "acc", image: "https://images.unsplash.com/photo-1721807644561-9efcabee5c42?w=600" },
    { name: "Luxury Clutch Bag", category: "Bags", price: 4200, oldPrice: 6500, filterClass: "acc", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600" },
    { name: "Traditional Jhumkas", category: "Jewelry", price: 2200, oldPrice: 3800, filterClass: "acc", image: "https://images.unsplash.com/photo-1648291531524-97afa1c2ac30?w=600" },
    { name: "Gold Metallic Timepiece", category: "Luxe Watch", price: 12500, oldPrice: 18000, filterClass: "acc", image: "https://images.unsplash.com/photo-1584091287122-ce4bb8a62207?w=600" },
    { name: "Classic Aviator Shades", category: "Style", price: 4500, oldPrice: 6200, filterClass: "acc", image: "https://images.unsplash.com/photo-1624545104844-0d342896e7a6?w=600" }
];

const seedDB = async () => {
    try {
        await Product.deleteMany({}); 
        await Product.insertMany(allProducts);
        console.log(` SUCCESS: ${allProducts.length} Products added to MODEVA database!`);
        mongoose.connection.close();
    } catch (err) {
        console.log(" Seeding Error:", err);
    }
};

seedDB();