const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
        },

        content: {
        type: String,
        required: [true, "You must provide a comment with your review."],
        },

        // Connection of review to user model
        // review belongs to user
        user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        },

        // Connection of review to book model
        // review belongs to book
        book: {
            type: mongoose.Types.ObjectId,
            ref: "Book",
        },     
    },
    {
        timestamps: true, 
    }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;