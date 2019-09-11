const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const file = context =>
    `${jhipsterConstants.CLIENT_TEST_SRC_DIR}spec/app/admin/${context.entityFolderName}/${context.entityFileName}.component.spec.ts`;

const tmpls = [
    {
        condition: context => context.isTenant,
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        target: context => '../../../../test.module',
        tmpl: context => '../../../test.module'
    }
];

module.exports = {
    file,
    tmpls
};
