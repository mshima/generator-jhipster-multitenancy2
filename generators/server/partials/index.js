const mtUtils = require('../../multitenancy-utils');

const serverTemplates = [
    'UserDTO.java',
    'User.java',
] 

module.exports = {
    server: {
        templates: function (context) {
            return mtUtils.requireTemplates('./server/partials/server/', serverTemplates, context);
        },
    }
};
