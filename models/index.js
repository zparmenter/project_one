require("../config/db.connection");

module.exports = {
    Book: require('./Book'),
    Review: require('./Review'),
    User: require('./User')
}