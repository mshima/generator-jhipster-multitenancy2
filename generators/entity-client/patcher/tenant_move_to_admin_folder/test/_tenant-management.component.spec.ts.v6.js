const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = context =>
    `${jhipsterConstants.CLIENT_TEST_SRC_DIR}spec/app/admin/${context.entityFolderName}/${context.entityFileName}.component.spec.ts`;

const tmpls = [
    {
        condition: context => context.isTenant,
        type: 'replaceContent',
        target: context => '../../../../test.module',
        tmpl: context => '../../../test.module'
    }
];

module.exports = {
    file,
    tmpls
};
