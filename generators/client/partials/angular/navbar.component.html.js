const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => `<li>\n(\\s*)(<a class="dropdown-item" routerLink="admin/${context.tenantNameLowerFirst}-management")`,
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    },
    {
        // https://github.com/jhipster/generator-jhipster/pull/10155
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: true,
        target: context => `global.menu.admin.admin/${context.tenantNameLowerFirst}-management`,
        tmpl: context => `global.menu.admin.${context.tenantNameLowerFirst}Management`
    }
];

module.exports = {
    file,
    tmpls
};
