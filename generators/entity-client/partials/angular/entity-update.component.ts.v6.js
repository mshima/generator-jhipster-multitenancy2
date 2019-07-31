const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.ts`;
};

const tmpls = [
    { // Add imports account
        type: 'rewriteFile',
        target: 'import { Observable } from \'rxjs\';',
        tmpl: (context) => {
            return `import { AccountService } from 'app/core';`;
        }
    },
    { // Add currentAccount field
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)isSaving: boolean;',
        tmpl: '\n$1currentAccount: any;\n$1isSaving: boolean;'
    },
    { // Load currentAccount
        type: 'replaceContent',
        regex: true,
        target: '\n(\\s*)private fb: FormBuilder\n(\\s*)\\) {(\\s*)}',
        tmpl: (context) => {
            return `\n$1private fb: FormBuilder,
$1private accountService: AccountService
$2) {
$1this.accountService.identity().then(account => {
$1$2this.currentAccount = account;
$1});
$2}`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
