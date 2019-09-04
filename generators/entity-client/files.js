const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const angularTemplates = [
    'tenant_hide_if_exists_on_account/entity.component.html',
    'tenant_hide_if_exists_on_account/navbar.component.html',
    'tenant_move_to_admin_menu/navbar.component.html'
];

const tenantAngularTemplates = ['change_tenant_management_role/_tenant-management.route.ts'];

const tenantAwareAngularTemplates = [
    'tenant_hide_if_exists_on_account/entity-detail.component.html',
    'tenant_hide_if_exists_on_account/entity-update.component.html',
    'tenant_hide_if_exists_on_account/entity-update.component.ts'
];

const angularTestTemplates = [
    'tenant_move_to_admin_folder/test/_tenant-management-delete-dialog.component.spec.ts',
    'tenant_move_to_admin_folder/test/_tenant-management-detail.component.spec.ts',
    'tenant_move_to_admin_folder/test/_tenant-management-update.component.spec.ts',
    'tenant_move_to_admin_folder/test/_tenant-management.component.spec.ts'
];

const angularProtractorTemplates = [
    'tenant_move_to_admin_folder/protractor/_tenant-management.spec.ts',
    'tenant_move_to_admin_menu/protractor/_tenant-management.spec.ts'
];

module.exports = {
    writeFiles,
    angular: {
        angularTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/', angularTemplates, context);
        },
        tenantAngularTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/', tenantAngularTemplates, context);
        },
        tenantAwareAngularTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/', tenantAwareAngularTemplates, context);
        },
        angularTestTemplates(context) {
            return mtUtils.requireTemplates('./entity-client/partials/', angularTestTemplates, context);
        },
        protractor(context) {
            return mtUtils.requireTemplates('./entity-client/partials/', angularProtractorTemplates, context);
        }
    }
};

function writeFiles() {
    // configs for the template files
    const files = {
        tests: [
            {
                condition: generator => generator.protractorTests,
                path: jhipsterConstants.CLIENT_TEST_SRC_DIR,
                templates: [
                    {
                        file: 'e2e/admin/_tenant-management.spec.ts',
                        renameTo: generator => `e2e/admin/${this.tenantFolderName}/${this.tenantFileName}-tenant.spec.ts`
                    }
                ]
            }
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);
}
