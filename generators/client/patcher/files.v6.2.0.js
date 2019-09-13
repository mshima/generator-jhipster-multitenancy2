const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        user_management_module: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.module.ts']
            }
        ]
    }
};
