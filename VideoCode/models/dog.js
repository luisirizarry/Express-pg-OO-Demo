const db = require("../db");
const ExpressError = require("../expressError");


class Dog {
  constructor(id, name, age){
    this.id = id;
    this.name = name;
    this.age = age;
  }

  static async getAll(){
    const results = await db.query(`SELECT id, name, age FROM dogs`);
    const dogs = results.rows.map( d => new Dog(d.id, d.name, d.age));
    return dogs;
  }

  static async getByID(id) {
    const results = await db.query(`
      SELECT id, name, age
      FROM dogs
      WHERE id = $1`, [id]);

    if(results.rows.length === 0) {
      throw new ExpressError(`Could not find dog with id ${id}`, 404);
    }

    const dog = results.rows[0];
    return new Dog(dog.id, dog.name, dog.age);
  }

  static async create(newName, newAge) {
    const results = await db.query(`
      INSERT INTO dogs (name, age)
      VALUES ($1, $2)
      RETURNING id, name, age`, [newName, newAge]);
    
    if(results.rows.length === 0){
      throw new ExpressError(`Couldn't create dog`, 400);
    }

    const { id, name, age } = results.rows[0];
    return new Dog(id, name, age);
  }

  async remove(){
    const results = await db.query(`
      DELETE FROM dogs
      WHERE id=$1
      RETURNING id, name, age`, [this.id]);

    if(results.rows.length === 0) {
      throw new ExpressError(`Couldn't delete dog with id ${this.id}`, 400);
    }
  }

  async save() {
    await db.query(`
      UPDATE dogs
      SET name=$1, age=$2
      WHERE id=$3
      RETURNING id, name, age`, 
      [this.name, this.age]);
  }

  speak() {
    console.log(`${this.name} says woof!!!`);
  }
}

module.exports = Dog;
