/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("items", (table) => {
        table.increments("id");
        table.integer("user_id");
        table.foreign("user_id").references("users.id");
        table.string("item_name", 50);
        table.string("description", 50);
        table.integer("quantity");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .alterTable("items", (table) => {
      table.dropForeign("user_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("items");
    });
};