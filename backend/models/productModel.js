const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        maxlength: [500, 'Description must not exceed 500 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Food & Beverages', 'Other']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    cost: {
        type: Number,
        required: [true, 'Product cost is required'],
        min: [0, 'Cost cannot be negative']
    },
    quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [0, 'Quantity cannot be negative'],
        default: 0
    },
    minQuantity: {
        type: Number,
        required: [true, 'Minimum quantity is required'],
        min: [0, 'Minimum quantity cannot be negative'],
        default: 5
    },
    supplier: {
        type: String,
        required: [true, 'Supplier information is required']
    },
    location: {
        type: String,
        required: [true, 'Storage location is required']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Product+Image'
    },
    status: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Discontinued'],
        default: 'In Stock'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

productSchema.pre('save', function(next) {
    if (this.quantity <= 0) {
        this.status = 'Out of Stock';
    } else if (this.quantity <= this.minQuantity) {
        this.status = 'Low Stock';
    } else {
        this.status = 'In Stock';
    }
    next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 