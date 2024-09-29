const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login | Task 7: 7-login.png
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add/Update a book review | Task 8: 8-reviewadded.png
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;
  const review = req.body.review;

  if (!review) {
    return res.status(400).json({ message: 'Review is required' });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: 'Review added/modified successfully' });
});

// Task 9: 9-deletereview.png
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { username } = req.session.authorization;
  const { isbn } = req.params;

  const review = books[isbn].reviews[username];

  if (review) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: 'Review delete successfully' });
  }
  else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

/*
Validación:

*login
curl --location 'http://localhost:5000/customer/login' \
--header 'Content-Type: application/json' \
--data '{
    "username": "hccollatupa",
    "password": "123456"
}'

*publicar review
curl --location --request PUT 'http://localhost:5000/customer/auth/review/1' \
--header 'Content-Type: application/json' \
--data '{
    "review": "bla bla bla"
}'

*Eliminar review
curl --location --request DELETE 'http://localhost:5000/customer/auth/review/1'

*/