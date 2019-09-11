const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entityFolderName}/${context.entityFileName}.spec.ts`;

const tmpls = [
    {
        condition: context => context.isTenant && context.testFrameworks.indexOf('protractor') !== -1,
        type: 'replaceContent',
        target: '../../../page-objects/jhi-page-objects',
        tmpl: '../../page-objects/jhi-page-objects'
    }
];

module.exports = {
    file,
    tmpls
};
