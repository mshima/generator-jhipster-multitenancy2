const appAdminIndexTs = require('./angular/admin-index.ts.js');
const appLayoutsNavbarComponentHtml = require('./angular/navbar.component.html.js');
const appLayoutsNavbarComponentTs = require('./angular/navbar.component.ts.js');
const appAccountServiceTs = require('./angular/account.service.ts.js');
const appAccountModelTs = require('./angular/account.model.ts.js');
const e2eAdminSpecTs = require('./angular/administration.spec.ts.js');
const userMgmtDialogComponentSpecTs = require('./angular/user-management-dialog.component.spec.ts.js');

module.exports = {
    angular: {
        appAdminIndexTs: appAdminIndexTs.tmpl,
        appLayoutsNavbarComponentHtml: appLayoutsNavbarComponentHtml.tmpl,
        appLayoutsNavbarComponentTs: appLayoutsNavbarComponentTs.tmpl,
        appAccountServiceTs: appAccountServiceTs.tmpl,
        appAccountModelTs: appAccountModelTs.tmpl,
        e2eAdminSpecTs: e2eAdminSpecTs.tmpl,
        userMgmtDialogComponentSpecTs: userMgmtDialogComponentSpecTs.tmpl
    }
};
