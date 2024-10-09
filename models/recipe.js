const db = require('../config/db');

class Recipe {
  constructor(recipe_category_id, user_id, name, cost) {
    this.recipe_category_id = recipe_category_id;
    this.user_id = user_id;
    this.name = name;
    this.cost = cost;
  }

  static getAll(search, callback) {
    let sql;
    let queryValues = [];

    if (search) {
      sql = `
        SELECT 
          recipe.*,
          recipe_category.name AS category_name,
          user.email AS user_email
        FROM recipe
        JOIN recipe_category ON recipe.recipe_category_id = recipe_category.id
        JOIN user ON recipe.user_id = user.id
        WHERE recipe.name LIKE ?
      `;
      queryValues = [`%${search}%`];
    } else {
      sql = `
        SELECT 
          recipe.*,
          recipe_category.name AS category_name,
          user.email AS user_email
        FROM recipe
        JOIN recipe_category ON recipe.recipe_category_id = recipe_category.id
        JOIN user ON recipe.user_id = user.id
      `;
    }

    db.query(sql, queryValues, (err, recipes) => {
      if (err) return callback(err);

      const recipeIds = recipes.map(r => r.id);
      if (recipeIds.length === 0) {
        return callback(null, recipes);
      }

      // Buscar os ingredientes usados, incluindo os detalhes do ingrediente e da marca
      const ingredientUsedSql = `
        SELECT 
          ingredient_used.*,
          ingredient.name AS ingredient_name,
          ingredient.size AS ingredient_size,
          ingredient.is_ml AS ingredient_is_ml,
          ingredient.price AS ingredient_price,
          brand.id AS brand_id,
          brand.name AS brand_name
        FROM ingredient_used
        JOIN ingredient ON ingredient_used.ingredient_id = ingredient.id
        JOIN brand ON ingredient.brand_id = brand.id
        WHERE ingredient_used.recipe_id IN (?)
      `;

      db.query(ingredientUsedSql, [recipeIds], (err, ingredientsUsed) => {
        if (err) return callback(err);

        callback(null, { recipes, ingredientsUsed });
      });
    });
  }

  // Método GET com Filtro por `user_id`, também ajustado para trazer os ingredientes usados
  static getByUserId(user_id, callback) {
    const sql = `
      SELECT 
        recipe.*,
        recipe_category.name AS category_name,
        user.email AS user_email
      FROM recipe
      JOIN recipe_category ON recipe.recipe_category_id = recipe_category.id
      JOIN user ON recipe.user_id = user.id
      WHERE recipe.user_id = ?
    `;

    db.query(sql, [user_id], (err, recipes) => {
      if (err) return callback(err);

      const recipeIds = recipes.map(r => r.id);
      if (recipeIds.length === 0) {
        return callback(null, recipes);
      }

      // Buscar os ingredientes usados, incluindo os detalhes do ingrediente e da marca
      const ingredientUsedSql = `
        SELECT 
          ingredient_used.*,
          ingredient.name AS ingredient_name,
          ingredient.size AS ingredient_size,
          ingredient.is_ml AS ingredient_is_ml,
          ingredient.price AS ingredient_price,
          brand.id AS brand_id,
          brand.name AS brand_name
        FROM ingredient_used
        JOIN ingredient ON ingredient_used.ingredient_id = ingredient.id
        JOIN brand ON ingredient.brand_id = brand.id
        WHERE ingredient_used.recipe_id IN (?)
      `;

      db.query(ingredientUsedSql, [recipeIds], (err, ingredientsUsed) => {
        if (err) return callback(err);

        callback(null, { recipes, ingredientsUsed });
      });
    });
  }

  // Método POST
  post(callback) {
    const sql = `
      INSERT INTO recipe (recipe_category_id, user_id, name, cost)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [this.recipe_category_id, this.user_id, this.name, this.cost], callback);
  }

  // Método PUT
  static update(id, recipe_category_id, user_id, name, cost, callback) {
    const sql = `
      UPDATE recipe
      SET recipe_category_id = ?, user_id = ?, name = ?, cost = ?
      WHERE id = ?
    `;
    db.query(sql, [recipe_category_id, user_id, name, cost, id], callback);
  }

  // Método DELETE
static delete(id, callback) {
  const deleteIngredientsUsed = 'DELETE FROM ingredient_used WHERE recipe_id = ?';

  db.query(deleteIngredientsUsed, [id], (err) => {
    if (err) {
      return callback(err);
    }

    const deleteRecipeSql = 'DELETE FROM recipe WHERE id = ?';
    db.query(deleteRecipeSql, [id], callback);
  });
}
}

module.exports = Recipe;
