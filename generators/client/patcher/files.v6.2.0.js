const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        user_management_module: [
            {
                version: '6.2.0',
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.module.ts']
            }
        ],
        tenant_admin_menu: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'layouts/navbar/navbar.component.html.v6.2.0',
                        renameTo: () => 'layouts/navbar/navbar.component.html'
                    }
                ]
            }
        ]
    }
};
