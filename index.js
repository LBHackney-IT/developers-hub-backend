const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var app = express()

app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

let stringify = require('json-stringify-safe');

// data imports
const ENCRYPTION_KEY = require("./fixtures/encryption_key.data.js");
const USER_DATA = require("./fixtures/user.data.js");

LISTEN_PORT = 5000;

function queryDBForLogin(email, password) {
  // Query DB here after it is added
  for (let value of Object.values(USER_DATA)) {
    const { password: userPass, email: userEmail, ...otherProps } = value;
    if (password === userPass && userEmail === email) return {...otherProps, email: userEmail};
  }

  return {};
}

function xor(data) {
  const len = data.length;
  const keyLen = ENCRYPTION_KEY.length;

  let result = "";

  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % keyLen));
  }

  return result;
}

app.get('/', (req, res) => {
  res.send('hello world')
  console.log("Get route accessed by request:");
  console.log(req.body);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const encryptedPassword = xor(password);
  console.log("User login from: ", email, password)

  const loginSuccess = queryDBForLogin(email, encryptedPassword);

  res.send(JSON.stringify(loginSuccess));
});

app.listen(LISTEN_PORT, () =>
  console.log(`Example app listening on socket 127.0.0.1:${LISTEN_PORT}!`),
);
