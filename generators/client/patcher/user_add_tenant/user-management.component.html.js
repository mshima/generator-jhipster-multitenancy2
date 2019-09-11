const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.component.html`;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(<th jhiSortBy="langKey">)',
        tmpl: context => {
            let trans = '';
            if (context.enableTranslation) trans = ` jhiTranslate="userManagement.${context.tenantNameLowerFirst}"`;
            return `$1<th jhiSortBy="${context.tenantNameLowerFirst}" *ngIf="!currentAccount.${
                context.tenantNameLowerFirst
            }"><span${trans}>${context.tenantNameUpperFirst}</span> <span class="fa fa-sort"></span></th>
$1$2`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: context => '(.*)(<td>{{user.langKey}}</td>)',
        tmpl: context => `$1<td *ngIf="!currentAccount.${context.tenantNameLowerFirst}">{{user.${context.tenantNameLowerFirst}?.name}}</td>
$1$2`
    }
];

module.exports = {
    file,
    tmpls
};
