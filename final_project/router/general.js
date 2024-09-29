const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Task 6: 6-register.png
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
//Task 1: 1-getallbooks.png
// public_users.get('/', function (req, res) {
//   return res.status(200).json(books);
// });

//Task 10 (Done in Task 1, now add Async): task10.png
public_users.get('/', async function (req, res) {
  try{
    let promiseBook = new Promise((resolve, reject) => {    
      if (Object.values(books).length > 0) {
        resolve(books)
      } else {
        reject({ message: "Books not found" });
      }
    });

    await promiseBook.then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
  }
  catch(e){
    return res.status(500).json({ message: "Error getting data" });
  }
});

// Get book details based on ISBN
//Task 2: 2-gedetailsISBN.png
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//Task 11 (Done in Task 2, now add Async): task11.png
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
    let promiseBook = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ message: "Books not found" });
      }
    });

    await promiseBook.then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
  }
  catch(e){
    return res.status(500).json({ message: "Error getting data" });
  }
});

// Get book details based on author
//Task 3: 3-getbooksbyauthor.png
// public_users.get('/author/:author', function (req, res) {
//   let filtered_books = [];
//   const author = req.params.author;
//   Object.values(books).forEach(function (book) {
//     if (book.author == author) {
//       filtered_books.push(book)
//     }
//   });

//   if (filtered_books.length > 0) {
//     return res.status(200).json(filtered_books);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//Task 12 (Done in Task 3, now add Async): task12.png 
public_users.get('/author/:author', async function (req, res) {
  try{
    let promiseBook = new Promise((resolve, reject) => {
      let filtered_books = [];
      const author = req.params.author;
      Object.values(books).forEach(function (book) {
        if (book.author == author) {
          filtered_books.push(book)
        }
      });
    
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject({ message: "Books not found" });
      }
    });

    await promiseBook.then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
  }
  catch(e){
    return res.status(500).json({ message: "Error getting data" });
  }
});

// Get all books based on title
//Task 4: 4-getbooksbytitle.png
// public_users.get('/title/:title', function (req, res) {
//   let filtered_books = [];
//   const title = req.params.title;
//   Object.values(books).forEach(function (book) {
//     if (book.title == title) {
//       filtered_books.push(book)
//     }
//   });

//   if (filtered_books.length > 0) {
//     return res.status(200).json(filtered_books);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

//Task 13 (Done in Task 4, now add Async): task13.png
public_users.get('/title/:title', async function (req, res) {
  try{
    let promiseBook = new Promise((resolve, reject) => {
	  let filtered_books = [];
	  const title = req.params.title;
	  Object.values(books).forEach(function (book) {
		if (book.title == title) {
		  filtered_books.push(book)
		}
	  });
    
      if (filtered_books.length > 0) {
        resolve(filtered_books);
      } else {
        reject({ message: "Books not found" });
      }
    });

    await promiseBook.then((result) => {
      return res.status(200).json(result);
    })
    .catch((error) => {
      return res.status(404).json(error);
    });
  }
  catch(e){
    return res.status(500).json({ message: "Error getting data" });
  }
});

//  Get book review | Task 5: 5-getbookreview.png
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.general = public_users;

/*
Validación

*1-listar todo
curl --location 'http://localhost:5000/

*2-buscar por isbn
curl --location 'http://localhost:5000/isbn/147'

*3-buscar por autor
curl --location 'http://localhost:5000/author/Unknown'

*4-buscar por título
curl --location 'http://localhost:5000/title/The Book Of Job'

*5-listar review
curl --location 'http://localhost:5000/review/138'

*6-registrar
curl --location 'http://localhost:5000/register' \
--header 'Content-Type: application/json' \
--data '{
    "username": "hccollatupa",
    "password": "123456"
}'
*/