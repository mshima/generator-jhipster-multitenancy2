const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.ts`;

const tmpls = [
    {
        // Add imports account
        type: 'rewriteFile',
        target: "import { Observable } from 'rxjs';",
        tmpl: context => "import { AccountService } from 'app/core';"
    },
    {
        // Add imports account
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: false,
        target: context => `'app/entities/../admin/${context.tenantNameLowerFirst}'`,
        tmpl: context => `'app/entities/../admin/${context.tenantNameLowerFirst}-management'`
    },
    {
        // Add currentAccount field
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)isSaving: boolean;',
        tmpl: '\n$1currentAccount: any;\n$1isSaving: boolean;'
    },
    {
        // Add currentAccount field
        type: 'replaceContent',
        regex: false,
        target: context => `admin/${context.tenantNameLowerFirst}'`,
        tmpl: context => `admin/${context.tenantNameLowerFirst}-management'`
    },
    {
        // Load currentAccount
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)private fb: FormBuilder\n(\\s*)\\) {(\\s*)}',
        tmpl: context => `\n$1private fb: FormBuilder,
$1private accountService: AccountService
$2) {
$1this.accountService.identity().then(account => {
$1$2this.currentAccount = account;
$1});
$2}`
    }
];

module.exports = {
    file,
    tmpls
};
