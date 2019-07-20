const file = (context) => {
    return `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityInstance}/${context.entityInstance}.page-object.ts`;
};

/*
                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.page-object.ts`,
                        'getPageTitle() {',
                        `${tenantNameLowerFirst}Select = element(by.css('select'));`
                    );

                    this.replaceContent(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.page-object.ts`,
                        '} from \'protractor\';',
                        ', protractor } from \'protractor\';'
                    );

                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.page-object.ts`,
                        'save(): promise.Promise<void> {',
                        partialFiles.angular.entitySpecTs2(this)
                    );
 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: 'getPageTitle() {',
        tmpl: (context) => {
            return `${tenantNameLowerFirst}Select = element(by.css('select'));`;
        }
    },
    {
        type: 'replaceContent',
        target: '} from \'protractor\';',
        tmpl: ', protractor } from \'protractor\';'
    },
    {
        type: 'rewriteFile',
        target: 'save(): promise.Promise<void> {',
        tmpl: (context) => {
            let template = `set${context.tenantNameUpperFirst} = function() {
        this.${context.tenantNameLowerFirst}Select.click();
        this.${context.tenantNameLowerFirst}Select.sendKeys('t');
        this.${context.tenantNameLowerFirst}Select.sendKeys(protractor.Key.ENTER);
    };
`;
            return template;
        }
    },
]

module.exports = {
    file,
    tmpls
};
