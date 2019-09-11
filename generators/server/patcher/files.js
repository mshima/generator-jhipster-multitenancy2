const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        aop: [
            // copy over aspect
            {
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/aop/_tenant/_UserAspect.java',
                        renameTo: generator => `${generator.packageFolder}/aop/${generator.tenantNameLowerFirst}/UserAspect.java`
                    }
                ]
            }
        ]
    }
};
