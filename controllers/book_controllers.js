const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const Book = require("../models/Book");
const Review = require("../models/Review");
const User = require("../models/User");



//all books index route
router.get("/", async function (req, res) {
    try {

        const books = await Book.find({});

        const context = {
            books,
        };

        res.render("books/allBooks", context);

    } catch (error) {

        return console.log(error);

    }
});


//new book show route
router.get("/new-book", (req, res) => {
    res.render("newBook");
});


//create book route...
router.post("/", async (req, res) => {
    try {
        await Book.create(req.body);
        return res.redirect("/all-books");
    } catch (error) {
        return console.log(error);
    }
});



router.get("/:id", async function (req, res, next) {
    try {
        
        const book = await Book.findById(req.params.id);
        const reviews = await Review.find({book: req.params.id}).populate("book");

        const user_log = [];
        const test = [];

        for (let i = 0; i <= reviews.length - 1; i++) {
            user_log[i] = reviews[i].user;
            test[i] = await Review.find({user: user_log[i]}).populate("user"); 
        }

        const context = {
            book,
            reviews,
            test,
        };

        return res.render("books/showBook", context);

    } catch (error) {
        return console.log(error);
    }
});

//Create new review
router.post("/:id", async function (req, res) {
    try {

        await Review.create(req.body);

        return res.redirect('back');
    } catch (error) {
        return console.log(error);
    }
});

router.get("/:id/edit", async (req, res) => {
    try {

        const book = await Book.findById(req.params.id);
        return res.render("editBook.ejs", {book});

    } catch (error) {
        return console.log(error);
    }
});

router.put("/:id", (req, res) => {
    Book.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        {
            new: true,
        },
        (error, updatedBook) => {
            if (error) return console.log(error);
            return res.redirect(`/all-books/${updatedBook.id}`);
        },
    );
});

router.delete("/:id", (req, res) => {
    Book.findByIdAndDelete(req.params.id, (error, deletedBook) => {
        if (error) return console.log(error);

        console.log(deletedBook);
        return res.redirect("/all-books");
    });

});

module.exports = router;

