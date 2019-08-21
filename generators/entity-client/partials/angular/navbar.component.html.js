const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        // Remove tenant from entities menu
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: true,
        target: context => `\n(.*)<li>\n(.*)routerLink="${context.tenantNameLowerFirst}-management"((.*)\n){4}(.*)</li>`,
        tmpl: context => ''
    },
    {
        // Add condition to hide menu
        type: 'replaceContent',
        regex: true,
        target: context => `<li>\n(\\s*)(<a class="dropdown-item" routerLink="admin/${context.tenantNameLowerFirst}-management")`,
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    },
    {
        // https://github.com/jhipster/generator-jhipster/pull/10155
        // Fixed on 6.2.1
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
