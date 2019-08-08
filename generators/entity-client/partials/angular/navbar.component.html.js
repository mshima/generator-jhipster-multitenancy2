const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => `<li>\n(\\s*)(<a class="dropdown-item" routerLink="admin/${context.tenantNameLowerFirst}-management")`,
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    },
    {
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: false,
        target: context => 'global.menu.admin.admin/company-management',
        tmpl: context => 'global.menu.admin.companyManagement'
    }
];

module.exports = {
    file,
    tmpls
};
