const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        tenant_admin_menu: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'layouts/navbar/navbar.component.html.v6.3.0',
                        renameTo: () => 'layouts/navbar/navbar.component.html'
                    }
                ]
            }
        ]
    }
};
