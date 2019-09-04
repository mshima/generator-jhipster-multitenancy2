const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}e2e/admin/${context.entityFolderName}/${context.entityFileName}.spec.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: context => '../../../page-objects/jhi-page-objects',
        tmpl: context => '../../page-objects/jhi-page-objects'
    }
];

module.exports = {
    file,
    tmpls
};
