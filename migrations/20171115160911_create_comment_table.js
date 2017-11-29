
exports.up = function(knex) {

  	return knex.schema.createTable('comments', function (t) {
    t.increments('comment_id').primary()
    t.string('comment_content').notNullable()
    t.string('user_id').notNullable()
    t.timestamps(false, true)
    t.integer('downvotes')
    t.integer('upvotes')

  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments')
};
