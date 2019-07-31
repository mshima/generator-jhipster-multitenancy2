const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.html`;
};

const tmpls = [
    { // Hide the company if the current account is from a company (field)
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `<div class="form-group">(\\s*)(.*)(for="field_${context.tenantNameLowerFirst})"`;
        },
        tmpl: (context) => {
            return `<div class="form-group" *ngIf="!currentAccount.${context.tenantNameLowerFirst}">$1$2$3"`;
        }
    },
    {  // Hide the company if the current account is from a company (requirements)
        type: 'replaceContent',
        regex: false,
        target: (context) => {
            return `<div *ngIf="editForm.get('${context.tenantNameLowerFirst}`;
        },
        tmpl: (context) => {
            return `<div *ngIf="!currentAccount.${context.tenantNameLowerFirst} && editForm.get('${context.tenantNameLowerFirst}`;
        }
    },
]

module.exports = {
        file,
        tmpls
};
