const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/user/user.model.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => 'export interface IUser',
        tmpl: context => `import { ${context.tenantNameUpperFirst} } from '../../shared/admin/${context.tenantNameLowerFirst}.model';
`
    },
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(password.* string;)',
        tmpl: context => `$1$2
$1${context.tenantNameLowerFirst}?: ${context.tenantNameUpperFirst};`
    },
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(public password.* string)',
        tmpl: context => `$1$2,
$1public ${context.tenantNameLowerFirst}?: ${context.tenantNameUpperFirst}`
    },
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(this.password = .*;)',
        tmpl: context => `$1$2
$1this.${context.tenantNameLowerFirst} = ${context.tenantNameLowerFirst} ? ${context.tenantNameLowerFirst} : null;`
    }
];

module.exports = {
    file,
    tmpls
};
