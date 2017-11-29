exports.up = function (knex) {
  return knex.schema.table('user', function (t) {
    t.string('balance').notNullable().defaultTo('100')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user')
}