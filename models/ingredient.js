const db = require('../config/db');

class Ingredient {
  constructor(brand_id, user_id, name, size, is_ml, price) {
    this.brand_id = brand_id;
    this.user_id = user_id;
    this.name = name;
    this.size = size;
    this.is_ml = is_ml;
    this.price = price;
  }

  // Método GET 
  static getAll(search, callback) {
    let sql;
    let queryValues = [];

    if (search) {
      // Se houver um termo de busca, aplicar o filtro
      sql = `
        SELECT 
          ingredient.*, 
          brand.id AS brand_id, 
          brand.name AS brand_name, 
          user.email AS user_email 
        FROM ingredient 
        JOIN brand ON ingredient.brand_id = brand.id
        JOIN user ON ingredient.user_id = user.id
        WHERE ingredient.name LIKE ?
      `;
      queryValues = [`%${search}%`];
    } else {
      // Sem termo de busca, listar todos os ingredientes
      sql = `
        SELECT 
          ingredient.*, 
          brand.id AS brand_id, 
          brand.name AS brand_name, 
          user.email AS user_email 
        FROM ingredient 
        JOIN brand ON ingredient.brand_id = brand.id
        JOIN user ON ingredient.user_id = user.id
      `;
    }

    db.query(sql, queryValues, callback);
  }
  
  // Método GET com filtro
  static getByUserId(user_id, callback) {
    const sql = `
      SELECT 
        ingredient.*, 
        brand.id AS brand_id, 
        brand.name AS brand_name, 
        user.email AS user_email 
      FROM ingredient 
      JOIN brand ON ingredient.brand_id = brand.id
      JOIN user ON ingredient.user_id = user.id
      WHERE ingredient.user_id = ?`;
    db.query(sql, [user_id], callback);
  }

  // Método POST
  create(callback) {
    const sql = 'INSERT INTO ingredient (brand_id, user_id, name, size, is_ml, price) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [this.brand_id, this.user_id, this.name, this.size, this.is_ml, this.price], callback);
  }

  // Método PUT (Update) para atualizar todos os campos de um ingrediente
  static update(id, brand_id, user_id, name, size, is_ml, price, callback) {
    const sql = `
      UPDATE ingredient 
      SET brand_id = ?, user_id = ?, name = ?, size = ?, is_ml = ?, price = ? 
      WHERE id = ?
    `;
    
    db.query(sql, [brand_id, user_id, name, size, is_ml, price, id], callback);
  }

  // Método DELETE
  static delete(id, callback) {
    const sql = 'DELETE FROM ingredient WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = Ingredient;