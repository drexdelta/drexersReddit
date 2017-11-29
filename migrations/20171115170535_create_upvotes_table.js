
exports.up = function(knex) {

  	return knex.schema.createTable('upvotes', function (t) {

    t.integer('comment_id').notNullable()
    t.string('user_id').notNullable()

  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('upvotes')
};
