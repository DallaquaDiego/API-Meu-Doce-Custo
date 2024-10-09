const db = require('../config/db');

class Brand {
  constructor(name, user_id) {
    this.name = name;
    this.user_id = user_id;
  }

  // Método GET 
  static getAll(search, callback) {
    const searchTerm = search ? `%${search}%` : '%%';
    const sql = `SELECT * FROM brand WHERE name LIKE ?`;

    db.query(sql, [searchTerm], callback);
  }

  // Método GET com filtro
  static getByUserId(user_id, callback) {
    const sql = 'SELECT * FROM brand WHERE user_id = ?';
    db.query(sql, [user_id], callback);
  }

  // Método CREATE
  create(callback) {
    const sql = 'INSERT INTO brand (name, user_id) VALUES (?, ?)';
    db.query(sql, [this.name, this.user_id], callback);
  }

  // Método PUT
  static update(id, newName, callback) {
    const sql = 'UPDATE brand SET name = ? WHERE id = ?';
    db.query(sql, [newName, id], callback);
  }

  // Método DELETE
  static delete(id, callback) {
    const sql = 'DELETE FROM brand WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Brand;