import express from "express";
import cors from "cors";
import mysql from "mysql";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const salt = 10;

const app = express();
const port = 3001;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "friendz",
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: `Not authenticated` });
  } else {
    jwt.verify(token, "secret-key", (err, decoded) => {
      if (err) return res.json({ Error: `Decoding token` });
      req.data = decoded.tokenData;
      next();
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: 1, userData: req.data });
});

app.get("/Logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: 1 });
});

app.post("/Login", (req, res) => {
  const query = "SELECT * FROM accounts WHERE mail = ?";

  db.query(query, req.body.mail, (err, result) => {
    if (err) return res.json({ Error: `In server` });
    if (result.length === 0) return res.json({ Status: 0 });
    bcrypt.compare(
      req.body.password.toString(),
      result[0].password,
      (err, response) => {
        if (err) return res.json({ Error: `While comparing ${err}` });
        if (response) {
          const tokenData = {
            id: result[0].id,
            name: result[0].name,
            mail: result[0].mail,
          };
          const token = jwt.sign({ tokenData }, "secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);

          return res.json({
            Status: 1,
            id: result[0].id,
            name: result[0].name,
            mail: result[0].mail,
          });
        } else {
          return res.json({ Status: 0 });
        }
      }
    );
  });
});

app.post("/Register", (req, res) => {
  const query = "INSERT INTO accounts (name, mail, password) VALUES (?, ?, ?)";

  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "While hashing" });
    const values = [req.body.name, req.body.mail, hash];

    db.query(query, values, (err, result) => {
      if (err) return res.json({ Error: `In server` });
      return res.json({ Status: 1 });
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
