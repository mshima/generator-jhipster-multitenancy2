const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management-update.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(<div.*ngIf="languages && languages.length > 0">)',
        tmpl: context => {
            let trans = '';
            if (context.enableTranslation) trans = ` jhiTranslate="userManagement.${context.tenantNameLowerFirst}"`;
            return `$1<div class="form-group" *ngIf="!currentAccount.${context.tenantNameLowerFirst} && ${
                context.tenantInstancePlural
            } && ${context.tenantInstancePlural}.length > 0">
$1    <label class="form-control-label"${trans} for="field_${context.tenantNameLowerFirst}">${context.tenantNameUpperFirst}</label>
$1    <select class="form-control" id="field_${context.tenantNameLowerFirst}" name="${context.tenantNameLowerFirst}" formControlName="${
                context.tenantNameLowerFirst
            }">
$1        <option *ngIf="!editForm.get('${context.tenantNameLowerFirst}').value" [ngValue]="null" selected></option>
$1        <option [ngValue]="${context.tenantNameLowerFirst}Option.id === editForm.get('${
                context.tenantNameLowerFirst
            }').value?.id ? editForm.get('${context.tenantNameLowerFirst}').value : ${context.tenantNameLowerFirst}Option" *ngFor="let ${
                context.tenantNameLowerFirst
            }Option of companies trackBy: track${context.tenantNameUpperFirst}ById">{{${context.tenantNameLowerFirst}Option.name}}</option>
$1    </select>
$1</div>

$1$2`;
        }
    }
];

module.exports = {
    file,
    tmpls
};
