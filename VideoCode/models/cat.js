const db = require("../db");
const ExpressError = require("../expressError");

class Cat {
  static async getAll() {
    let results = await db.query(`SELECT * FROM cats`);
    return results.rows;
  }

  static async getByID(id) {
    let results = await db.query(`SELECT id, name, age FROM cats WHERE id=$1`, [
      id,
    ]);
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't find cat with id: ${id}`, 404);
    }
    return results.rows[0];
  }

  static async create(name, age) {
    if(!name || !age){
      throw new ExpressError(`Missing Required data`, 400)
    }
    let results = await db.query(
      `
      INSERT INTO cats (name, age)
      VALUES ($1, $2)
      RETURNING name, age`,
      [name, age]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Could not create cat`, 400);
    }
    return results.rows[0];
  }

  static async delete(id) {
    let results = await db.query(
      `
      DELETE FROM cats
      WHERE id=$1
      RETURNING name, age`,
      [id]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`Cat with id ${id} could not be deleted`, 400);
    }
    return results.rows[0];
  }

  static async update(id, newName, newAge) {
    const results = await db.query(`
      UPDATE cats 
      SET name=$1, age=$2
      WHERE id=$3
      RETURNING id, name, age`, [newName, newAge, id]);
    if(results.rows.length === 0) {
      throw new ExpressError(`Could not update cat with id of ${id}`, 400);
    }
    return results.rows[0];
  }

  static async makeOlder(id) {
    const results = await db.query(`
      UPDATE cats
      SET age = age + 1
      WHERE id = $1
      RETURNING id, name, age`, [id]);
    if(results.rows.length === 0) {
      throw new ExpressError(`Could not find cat with id ${id}`, 404);
    }
    return results.rows[0];
  }
}

module.exports = Cat;
