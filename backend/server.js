const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// MYSQL CONNECTION
// ==========================================

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shamina@20",
  database: "app"
});


// ==========================================
// CONNECT TO MYSQL
// ==========================================

db.connect((err) => {

  if (err) {
    console.log("MySQL connection failed:", err);
    return;
  }

  console.log("MySQL connected!");

});


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

  res.send("Backend is working!");

});


// ==========================================
// REGISTER API
// ==========================================

app.post("/api/register", (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;


  console.log("Register request:", {
    name,
    email
  });


  // Check required fields

  if (!name || !email || !password) {

    return res.status(400).json({
      message: "All fields are required"
    });

  }


  // Check whether email already exists

  const checkSql =
    "SELECT id FROM users WHERE email = ?";


  db.query(
    checkSql,
    [email],
    (err, result) => {

      if (err) {

        console.log(
          "Register check error:",
          err
        );

        return res.status(500).json({
          message: "Database error",
          error: err.message
        });

      }


      if (result.length > 0) {

        return res.status(400).json({
          message: "Email already registered"
        });

      }


      // Insert user

      const sql = `
        INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)
      `;


      db.query(
        sql,
        [name, email, password],
        (err, result) => {

          if (err) {

            console.log(
              "Registration error:",
              err
            );

            return res.status(500).json({
              message: "Registration failed",
              error: err.message
            });

          }


          console.log(
            "User registered. ID:",
            result.insertId
          );


          return res.status(201).json({
            message: "Registration successful",
            id: result.insertId
          });

        }
      );

    }
  );

});


// ==========================================
// LOGIN API
// ==========================================

app.post("/api/login", (req, res) => {

  const {
    email,
    password
  } = req.body;


  console.log(
    "Login request:",
    email
  );


  if (!email || !password) {

    return res.status(400).json({
      message: "Email and password are required"
    });

  }


  const sql = `
    SELECT
      id,
      name,
      email,
      password
    FROM users
    WHERE email = ?
  `;


  db.query(
    sql,
    [email],
    (err, result) => {

      if (err) {

        console.log(
          "Login database error:",
          err
        );

        return res.status(500).json({
          message: "Database error",
          error: err.message
        });

      }


      if (result.length === 0) {

        return res.status(401).json({
          message: "Invalid email or password"
        });

      }


      const user = result[0];


      // Check password

      if (user.password !== password) {

        return res.status(401).json({
          message: "Invalid email or password"
        });

      }


      console.log(
        "Login successful:",
        {
          id: user.id,
          name: user.name,
          email: user.email
        }
      );


      // IMPORTANT:
      // Send user ID to React

      return res.status(200).json({

        message: "Login successful",

        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }

      });

    }
  );

});


// ==========================================
// CREATE DIARY ENTRY API
// ==========================================

app.post("/api/diary", (req, res) => {

  console.log(
    "Received diary data:",
    req.body
  );


  const {
    user_id,
    title,
    mood,
    content,
    entry_date
  } = req.body;


  // Check required fields

  if (
    user_id === undefined ||
    user_id === null ||
    !title ||
    !content ||
    !entry_date
  ) {

    console.log(
      "Missing diary fields:",
      {
        user_id,
        title,
        mood,
        content,
        entry_date
      }
    );


    return res.status(400).json({
      message: "Required fields are missing"
    });

  }


  const sql = `
    INSERT INTO diary_entries
    (
      user_id,
      title,
      mood,
      content,
      entry_date
    )
    VALUES (?, ?, ?, ?, ?)
  `;


  db.query(
    sql,
    [
      user_id,
      title,
      mood || null,
      content,
      entry_date
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Diary database error:",
          err
        );


        return res.status(500).json({

          message: "Diary entry failed",

          error: err.message

        });

      }


      console.log(
        "Diary saved successfully!"
      );


      console.log(
        "Diary ID:",
        result.insertId
      );


      return res.status(201).json({

        message:
          "Diary entry saved successfully",

        id: result.insertId

      });

    }
  );

});


// ==========================================
// GET DIARY ENTRIES API
// ==========================================

app.get("/api/diary/:user_id", (req, res) => {

  const userId = req.params.user_id;


  console.log(
    "Getting diary for user:",
    userId
  );


  if (!userId || userId === "undefined") {

    return res.status(400).json({
      message: "User ID is required"
    });

  }


  const sql = `
    SELECT
      id,
      title,
      mood,
      content,
      entry_date,
      created_at
    FROM diary_entries
    WHERE user_id = ?
    ORDER BY
      entry_date DESC,
      created_at DESC
  `;


  db.query(
    sql,
    [userId],
    (err, result) => {

      if (err) {

        console.log(
          "Get diary error:",
          err
        );


        return res.status(500).json({

          message:
            "Unable to get diary entries",

          error: err.message

        });

      }


      return res.status(200).json(result);

    }
  );

});


// ==========================================
// DELETE DIARY API
// ==========================================

app.delete("/api/diary/:id", (req, res) => {

  const id = req.params.id;


  console.log(
    "Delete diary:",
    id
  );


  if (!id || id === "undefined") {

    return res.status(400).json({
      message: "Diary ID is required"
    });

  }


  const sql =
    "DELETE FROM diary_entries WHERE id = ?";


  db.query(
    sql,
    [id],
    (err, result) => {

      if (err) {

        console.log(
          "Delete diary error:",
          err
        );


        return res.status(500).json({

          message:
            "Unable to delete diary",

          error: err.message

        });

      }


      if (result.affectedRows === 0) {

        return res.status(404).json({

          message:
            "Diary entry not found"

        });

      }


      console.log(
        "Diary deleted:",
        id
      );


      return res.status(200).json({

        message:
          "Diary deleted successfully"

      });

    }
  );

});


// ==========================================
// UPDATE DIARY API
// ==========================================

app.put("/api/diary/:id", (req, res) => {

  const id = req.params.id;


  const {
    title,
    mood,
    content,
    entry_date
  } = req.body;


  console.log(
    "Update diary:",
    id
  );


  if (
    !title ||
    !content ||
    !entry_date
  ) {

    return res.status(400).json({

      message:
        "Required fields are missing"

    });

  }


  const sql = `
    UPDATE diary_entries
    SET
      title = ?,
      mood = ?,
      content = ?,
      entry_date = ?
    WHERE id = ?
  `;


  db.query(
    sql,
    [
      title,
      mood || null,
      content,
      entry_date,
      id
    ],
    (err, result) => {

      if (err) {

        console.log(
          "Update diary error:",
          err
        );


        return res.status(500).json({

          message:
            "Unable to update diary",

          error: err.message

        });

      }


      if (result.affectedRows === 0) {

        return res.status(404).json({

          message:
            "Diary entry not found"

        });

      }


      console.log(
        "Diary updated:",
        id
      );


      return res.status(200).json({

        message:
          "Diary updated successfully"

      });

    }
  );

});


// ==========================================
// START SERVER
// ==========================================

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});