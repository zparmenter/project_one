const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "A title must be provided."],
    },
    image: {
        type: String,
        required: [true, "An image must be provided"],
    },
    author: {
        type: String,
        required: [true, "Author must be provided"],
    },
    price: {
        type: Number,
        require: [true, "A price must be assigned"],
    },  
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

   // Non-required key-value pairs
    // genre: {

    // },
    // bestseller: {
    //     type: boolean,
    // }
    // Stretch
    // tags: [{
    //     type: String,
    // }],