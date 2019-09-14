const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        // https://github.com/jhipster/generator-jhipster/pull/10155
        // Fixed on 6.3.0
        condition: context => context.isTenant,
        type: 'replaceContent',
        regex: false,
        target: context => new RegExp(`global.menu.admin.admin/${context.tenantFileName}`),
        tmpl: context => `global.menu.admin.${context.tenantMenuTranslationKey}`
    }
];

module.exports = {
    file,
    tmpls
};
