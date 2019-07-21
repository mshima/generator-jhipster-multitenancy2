const file = (context) => {
    return `${context.CLIENT_TEST_SRC_DIR}e2e/admin/administration.spec.ts`;
};

const tmpls = [
    {
        condition: (context) => context.protractorTests && !context.enableTranslation,
        type: 'rewriteFile',
        target: (context) => {
            return `it(\'should load metrics\', async () => {`;
        },
        tmpl: (context) => {
            return `it('should load ${context.tenantNameLowerFirst} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenantNameLowerFirst}-management');
        const expect1 = /${context.tenantNamePluralUpperFirst}/;
        element.all(by.css('h2 span')).first().getText().then((value) => {
            expect(value).toMatch(expect1);
        });
    });\n`;
        }
    },
    {
        condition: (context) => context.protractorTests && context.enableTranslation,
        type: 'rewriteFile',
        target: (context) => {
            return `it(\'should load metrics\', async () => {`;
        },
        tmpl: (context) => {
            return `it('should load ${context.tenantNameLowerFirst} management', async () => {
        await navBarPage.clickOnAdmin('${context.tenantNameLowerFirst}-management');
        const expect1 = /${context.tenantNameLowerFirst}Management.home.title/;
        element.all(by.css('h2 span')).first().getAttribute('jhiTranslate').then((value) => {
            expect(value).toMatch(expect1);
        });
    });\n`;
        }
    },
]

module.exports = {
    file,
    tmpls
};