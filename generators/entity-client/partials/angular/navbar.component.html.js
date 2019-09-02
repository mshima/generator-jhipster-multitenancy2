const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        // Add condition to hide menu
        type: 'replaceContent',
        regex: false,
        target: context => new RegExp(`<li>\n(\\s*)(<a class="dropdown-item" routerLink="${context.tenantStateName}")`),
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    },
    {
        // https://github.com/jhipster/generator-jhipster/pull/10155
        // Fixed on 6.2.1
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: false,
        target: context => new RegExp(`global.menu.admin.admin/${context.tenantFileName}`),
        tmpl: context => `global.menu.admin.${context.tenantMenuTranslationKey}`
    }
];

module.exports = {
    file,
    tmpls
};
