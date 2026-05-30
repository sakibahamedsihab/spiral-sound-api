import { getDBConnection } from "../db.js";

export async function getGenres(req, res) {
  try {
    const db = await getDBConnection();

    const genreRows = await db.all(`SELECT DISTINCT genre FROM products`);
    const genres = genreRows.map((row) => row.genre);
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genres" });
  }
}

export async function getProducts(req, res) {
  try {
    const db = await getDBConnection();

    let query = `SELECT * FROM products`;
    let params = [];

    const { genre, search } = req.query;

    if (genre) {
      query += ` WHERE genre = ?`;
      params.push(genre);
    } else if (search) {
      query += ` WHERE title like ? OR artist LIKE ? OR genre LIKE ?`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const products = await db.all(query, params);
    console.log(products);
    res.json(products);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", details: err.message });
  }
}
