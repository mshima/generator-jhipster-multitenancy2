const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => `<li>\n(\\s*)(<a class="dropdown-item" routerLink="admin/${context.tenantNameLowerFirst}-management")`,
        // return `<td>\n(\\s*)(<div \\*ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">)`;
        tmpl: context => `<li [hidden]="has${context.tenantNameUpperFirst}()">\n$1$2`
    }
];

module.exports = {
    file,
    tmpls
};
