const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-detail.component.html`;
};

const tmpls = [
    { // Hide tenant if is defined
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `<dt>(<span(.*)>${context.tenantNameUpperFirst}</span></dt>(\\s*)<dd>)`;
        },
        tmpl: (context) => {
            return `<dt *ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">$1`;
        }
    },
    { // Show tenant name
        type: 'replaceContent',
        regex: false,
        target: (context) => {
            return `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.id}}`;
        },
        tmpl: (context) => {
            return `{{${context.entityInstance}.${context.tenantNameLowerFirst}?.name}}`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
