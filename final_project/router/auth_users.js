const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const userWithSameName = users.filter((user) => user.username === username);
  return userWithSameName.length > 0;
};

const authenticatedUser = (username, password) => {
  const validUsers = users.filter(
    (user) => user.username === username && user.password === password
  );
  return validUsers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({ message: "Invalid username or password." });
  }

  let accessToken = jwt.sign({ username: username }, 'fingerprint_customer', { expiresIn: 60 * 60 });

  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "User successfully logged in." });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }
  if (!review) {
    return res.status(404).json({ message: "Review text is required as a query parameter." });
  }

  book.reviews[username] = review;
  return res.status(200).json({ message: "Review successfully added/updated.", reviews: book.reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found for the given ISBN." });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this user on the given ISBN." });
  }

  delete book.reviews[username];
  return res.status(200).json({ message: "Review successfully deleted.", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;