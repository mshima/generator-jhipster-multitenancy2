const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}.component.html`;

const tmpls = [
    {
        // Hide if currentAccount has a tenant
        condition: context => context.tenantAware,
        type: 'replaceContent',
        regex: true,
        target: context => `<th><span(.*)>${context.tenantNameUpperFirst}</span>`,
        tmpl: context => `<th *ngIf="!currentAccount.${context.tenantNameLowerFirst}"><span$1>${context.tenantNameUpperFirst}</span>`
    },
    {
        // Hide if currentAccount has a tenant
        condition: context => context.tenantAware,
        type: 'replaceContent',
        regex: true,
        target: context => `<td>\n(\\s*)(<div \\*ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">)`,
        tmpl: context => `<td *ngIf="!currentAccount.${context.tenantNameLowerFirst}">\n$1$2`
    },
    {
        // Show tenant name
        condition: context => context.tenantAware,
        type: 'replaceContent',
        regex: false,
        target: context => `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.id}}`,
        tmpl: context => `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.name}}`
    },
    {
        // Fixes relationship routerLink
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: true,
        target: context => "'\\.\\./",
        tmpl: context => "'/"
    },
    {
        // Fixes delete routerLink
        type: 'replaceContent',
        versions: ['6.1.2'], // fixed in 6.2.0
        regex: false,
        target: context => "'/', '",
        tmpl: context => "'/"
    }
];
module.exports = {
    file,
    tmpls
};
