const tmpl = (context) => {
    let template = `it('should create and save ${context.name}', () => {
        ${context.tenantNameLowerFirst}MgmtComponentsPage = new ${context.tenantNameUpperFirst}MgmtComponentsPage();
        ${context.tenantNameLowerFirst}MgmtComponentsPage.create${context.tenantNameUpperFirst}();

        navBarPage.goToEntity('${context.entityInstance}');`;
    return template;
};

module.exports = {
    tmpl
};
