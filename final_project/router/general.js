const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "Username already exists." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const booksByAuthor = bookKeys
    .filter((key) => books[key].author === author)
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});

  if (Object.keys(booksByAuthor).length > 0) {
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    res.status(404).json({ message: "No books found for the given author." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  const booksByTitle = bookKeys
    .filter((key) => books[key].title === title)
    .reduce((result, key) => {
      result[key] = books[key];
      return result;
    }, {});

  if (Object.keys(booksByTitle).length > 0) {
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({ message: "No books found for the given title." });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found for the given ISBN." });
  }
});

module.exports.general = public_users;

const axios = require('axios');

// Task 10: Get all books – using Promise callbacks
function getAllBooks() {
  axios.get('http://localhost:5000/')
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
    })
    .catch((error) => {
      console.error("Error fetching all books:", error.message);
    });
}

// Task 11: Search by ISBN – using async/await
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error("Error fetching book by ISBN:", error.message);
  }
}

// Task 12: Search by Author – using Promise callbacks or async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
}

// Task 13: Search by Title – using async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    console.log(JSON.stringify(response.data, null, 4));
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
}

// Example calls
getAllBooks();
getBookByISBN(1);
getBooksByAuthor("Jane Austen");
getBooksByTitle("Fairy tales");

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };
module.exports.general = public_users;
module.exports.getBooksByTitle = getBooksByTitle;
