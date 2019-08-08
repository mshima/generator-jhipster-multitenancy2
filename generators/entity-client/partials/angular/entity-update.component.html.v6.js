const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.html`;

const tmpls = [
    {
        // Hide the company if the current account is from a company (field)
        type: 'replaceContent',
        regex: true,
        target: context => `<div class="form-group">(\\s*)(.*)(for="field_${context.tenantNameLowerFirst})"`,
        tmpl: context => `<div class="form-group" *ngIf="!currentAccount.${context.tenantNameLowerFirst}">$1$2$3"`
    },
    {
        // Hide the company if the current account is from a company (requirements)
        type: 'replaceContent',
        regex: false,
        target: context => `<div *ngIf="editForm.get('${context.tenantNameLowerFirst}`,
        tmpl: context => `<div *ngIf="!currentAccount.${context.tenantNameLowerFirst} && editForm.get('${context.tenantNameLowerFirst}`
    }
];

module.exports = {
    file,
    tmpls
};
