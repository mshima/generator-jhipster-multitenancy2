const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-detail.component.html`;

const tmpls = [
    {
        // Hide tenant if is defined
        type: 'replaceContent',
        regex: true,
        target: context => `<dt>(<span(.*)>${context.tenantNameUpperFirst}</span></dt>(\\s*)<dd>)`,
        tmpl: context => `<dt *ngIf="${context.entityInstance}.${context.tenantNameLowerFirst}">$1`
    }
];

module.exports = {
    file,
    tmpls
};