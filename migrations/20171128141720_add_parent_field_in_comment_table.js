exports.up = function (knex) {
    return knex.schema.table('comments', function (t) {
        t.string('parent').notNullable().defaultTo("-1")
    });
}

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('user');
}