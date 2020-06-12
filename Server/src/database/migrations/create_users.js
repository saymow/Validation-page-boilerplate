exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable();
    table.string("user").notNullable();
    table.string("password", 60).notNullable();
    table.boolean("confirmed").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
