const db = require('../db');


class Cat {
  static async getAll() {
    let results = await db.query(`SELECT * FROM cats`);
    return results.rows;
  }

  static async getByID(id) {
    let results = await db.query(`SELECT * FROM cats WHERE id=$1`, [id]);
    return results.rows;
  }
}

module.exports = Cat;