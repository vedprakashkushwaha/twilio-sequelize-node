const bcrypt = require('bcryptjs');
utilsHandler = {}

utilsHandler.encryptPassword = function(password) {
    if (password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        return hash;
    }
}
utilsHandler.verifyPassword = function(password, passwordHash) {
    const passwordIsValid = bcrypt.compareSync(password, passwordHash);
    return passwordIsValid;
}
module.exports = utilsHandler;