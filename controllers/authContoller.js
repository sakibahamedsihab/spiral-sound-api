import validator from "validator";
import bcrypt, { hash } from "bcryptjs";
import { getDBConnection } from "../db/db.js";


export async function registerUser(req, res) {
  let { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  name = name.trim();
  email = email.trim();
  username = username.trim();

  if (!/^[a-zA-Z0-9_-]{1,20}$/.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 1-20 characters, using letters, numbers, _ or -.",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  try {
    const db = await getDBConnection();

    const existing = await db.get(
      `SELECT id FROM users WHERE email = ? OR username = ?`,
      [email, username],
    );

    if (existing) {
      return res
        .status(400)
        .json({ error: "email or username already in use" });
    }

    const hashedPassword = bcrypt.hash(password, 10);

    // adding users to database
    const result = await db.run(
      `INSERT INTO users (name, email, username, password) VALUES(?,?,?,?)`,
      [name, email, username, hashedPassword],
    );

    console.log(result);
    req.session.userId = result.lastID;

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Registration error: ", err.message);
    res.status(500).json({ error: "Registration failed. Please try again" });
  }
}
