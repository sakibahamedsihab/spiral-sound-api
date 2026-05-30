import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";

import { vinyl } from "./data.js";

// creating database connection
async function seedTable() {
  // connect to database
  const db = await open({
    filename: path.join("database.db"),
    driver: sqlite3.Database,
  });

  try {
    await db.exec("BEGIN TRANSACTION");

    for (const { title, artist, price, image, year, genre, stock } of vinyl) {
      await db.run(
        `
        INSERT INTO products(title, artist, price, image, year, genre, stock) VALUES (?,?,?,?,?,?,?)
        `,
        [title, artist, price, image, year, genre, stock],
      );
    }

    await db.exec("COMMIT");
    console.log("All record inserted successfully");
  } catch (err) {
    await db.exec("ROLLBACK");
    console.log("Error inserting the data!", err.message);
  } finally {
    await db.close();
    console.log("Connection closed");
  }
}

seedTable();
