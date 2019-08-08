const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entityFolderName}/${context.entityFileName}.spec.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: context => '../../../page-objects/jhi-page-objects',
        tmpl: context => '../../page-objects/jhi-page-objects'
    },
    {
        type: 'replaceContent',
        target: context => 'new NavBarPage();',
        tmpl: context => 'new NavBarPage(true);'
    },
    {
        type: 'replaceContent',
        target: context => 'navBarPage.entityMenu',
        tmpl: context => 'navBarPage.adminMenu'
    },
    {
        type: 'replaceContent',
        target: context => `await navBarPage.goToEntity('${context.entityFileName}');`,
        tmpl: context => `await navBarPage.clickOnAdminMenu();
await navBarPage.clickOnAdmin('${context.entityFileName}');`
    }
];

module.exports = {
    file,
    tmpls
};
