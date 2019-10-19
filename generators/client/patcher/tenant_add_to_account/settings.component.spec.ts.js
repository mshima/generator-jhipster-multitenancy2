const jhipsterEnv = require('../../../jhipster-environment');

const jhipsterConstants = jhipsterEnv.constants;

const file = context => `${jhipsterConstants.CLIENT_TEST_SRC_DIR}spec/app/account/settings/settings.component.spec.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        disabled: true,
        target: /(\n(\s*)imageUrl: '')(,?)/,
        tmpl: context => `$1,
$2company: 'MockCompany'$3`
    }
];

module.exports = {
    version: '^6.4.0',
    file,
    tmpls
};
