const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = (context) => {
    return `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entityFolderName}/${context.entityFileName}.spec.ts`;
};

const tmpls = [
    {
        type: 'replaceContent',
        target: (context) => {
            return `new NavBarPage();`;
        },
        tmpl: (context) => {
            return `new NavBarPage(true);`;
        }
    },
    {
        type: 'replaceContent',
        target: (context) => {
            return `navBarPage.entityMenu`;
        },
        tmpl: (context) => {
            return `navBarPage.adminMenu`;
        }
    },
    {
        type: 'replaceContent',
        target: (context) => {
            return `await navBarPage.goToEntity('${context.entityFileName}');`;
        },
        tmpl: (context) => {
            return `await navBarPage.clickOnAdminMenu();
await navBarPage.clickOnAdmin('${context.entityFileName}');`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
