const tenantResource = require('./server/_TenantResource.js');
const tenantService = require('./server/_TenantService.js');

const mtUtils = require('../../multitenancy-utils');

const serverTemplates = [
    'Entity.java',
] 


module.exports = {
    serverEntityTenantAware: {
        templates: function (context) {
            return mtUtils.requireTemplates('./entity-server/partials/server/', serverTemplates, context);
        },
    },
    server: {
        tenantResource: tenantResource.tmpl,
        tenantService: tenantService.tmpl
    }
};
