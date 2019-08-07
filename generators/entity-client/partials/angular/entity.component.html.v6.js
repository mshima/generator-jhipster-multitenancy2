const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}.component.html`;

const tmpls = [
    {
        // Hide if currentAccount has a tenant
        type: 'replaceContent',
        regex: true,
        target: context => `<th><span(.*)>${context.tenantNameUpperFirst}</span>`,
        tmpl: context => `<th *ngIf="!currentAccount.${context.tenantNameLowerFirst}"><span$1>${context.tenantNameUpperFirst}</span>`
    },
    {
        // Hide if currentAccount has a tenant
        type: 'replaceContent',
        regex: true,
        target: context => `<td>\n(\\s*)(<div \\*ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">)`,
        tmpl: context => `<td *ngIf="!currentAccount.${context.tenantNameLowerFirst}">\n$1$2`
    },
    {
        // Show tenant name
        type: 'replaceContent',
        regex: false,
        target: context => `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.id}}`,
        tmpl: context => `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.name}}`
    }
];
module.exports = {
    file,
    tmpls
};
