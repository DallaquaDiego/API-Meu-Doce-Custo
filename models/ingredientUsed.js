const db = require('../config/db');

class IngredientUsed {
  constructor(ingredient_id, recipe_id, user_id, quantity, cost) {
    this.ingredient_id = ingredient_id;
    this.recipe_id = recipe_id;
    this.user_id = user_id;
    this.quantity = quantity;
    this.cost = cost;
  }

  // Método GET para listar todos os ingredientes usados, incluindo marca e categoria
  static getAll(callback) {
    const sql = `
      SELECT 
        ingredient_used.*,
        ingredient.name AS ingredient_name,
        ingredient.brand_id AS brand_id,
        brand.name AS brand_name,
        recipe.name AS recipe_name,
        recipe_category.id AS category_id,
        recipe_category.name AS category_name,
        user.email AS user_email
      FROM ingredient_used
      JOIN ingredient ON ingredient_used.ingredient_id = ingredient.id
      JOIN brand ON ingredient.brand_id = brand.id
      JOIN recipe ON ingredient_used.recipe_id = recipe.id
      JOIN recipe_category ON recipe.recipe_category_id = recipe_category.id
      JOIN user ON ingredient_used.user_id = user.id
    `;
    db.query(sql, callback);
  }

  // Método GET para listar ingredientes usados por user_id, incluindo marca e categoria
  static getByUserId(user_id, callback) {
    const sql = `
      SELECT 
        ingredient_used.*,
        ingredient.name AS ingredient_name,
        ingredient.brand_id AS brand_id,
        brand.name AS brand_name,
        recipe.name AS recipe_name,
        recipe_category.id AS category_id,
        recipe_category.name AS category_name,
        user.email AS user_email
      FROM ingredient_used
      JOIN ingredient ON ingredient_used.ingredient_id = ingredient.id
      JOIN brand ON ingredient.brand_id = brand.id
      JOIN recipe ON ingredient_used.recipe_id = recipe.id
      JOIN recipe_category ON recipe.recipe_category_id = recipe_category.id
      JOIN user ON ingredient_used.user_id = user.id
      WHERE ingredient_used.user_id = ?
    `;
    db.query(sql, [user_id], callback);
  }

  // Método CREATE
  post(callback) {
    const sql = `
      INSERT INTO ingredient_used (ingredient_id, recipe_id, user_id, quantity, cost)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [this.ingredient_id, this.recipe_id, this.user_id, this.quantity, this.cost], callback);
  }

  // Método UPDATE
  static update(id, ingredient_id, recipe_id, user_id, quantity, cost, callback) {
    const sql = `
      UPDATE ingredient_used
      SET ingredient_id = ?, recipe_id = ?, user_id = ?, quantity = ?, cost = ?
      WHERE id = ?
    `;
    db.query(sql, [ingredient_id, recipe_id, user_id, quantity, cost, id], callback);
  }

  // Método DELETE
  static delete(id, callback) {
    const sql = 'DELETE FROM ingredient_used WHERE id = ?';
    db.query(sql, [id], callback);
  }
}

module.exports = IngredientUsed;