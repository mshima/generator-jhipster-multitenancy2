const file = (context) => {
    return `${context.CLIENT_TEST_SRC_DIR}e2e/admin/${context.tenantNameLowerFirst}-management.spec.ts`;
};

/*
                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/admin/${tenantNameLowerFirst}-management.spec.ts`,
                        'clickOnCreateButton() {',
                        partialFiles.angular.tenantMgmtSpecTs(this)
                    );

 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: 'clickOnCreateButton() {',
        tmpl: (context) => {
            let template = `create${context.tenantNameUpperFirst}() {
                const ${context.tenantNameLowerFirst}MgmtUpdatePage = new ${context.tenantNameUpperFirst}MgmtUpdatePage();
                const navBarPage = new NavBarPage(true);
                navBarPage.clickOnAdminMenu();
                navBarPage.clickOnAdmin('${context.tenantNameLowerFirst}-management');
                browser.waitForAngular();

                this.clickOnCreateButton();
                ${context.tenantNameLowerFirst}MgmtUpdatePage.setNameInput('test');
                ${context.tenantNameLowerFirst}MgmtUpdatePage.save();
            }`;
            return template;
        }
    },
]

module.exports = {
    file,
    tmpls
};
