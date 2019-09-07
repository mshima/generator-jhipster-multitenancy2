const chalk = require('chalk');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const debug = require('debug')('jhipster:multitenancy2:workarounds');

module.exports = {
    fixGetAllJhipsterConfig,
    fixAddEntityToMenu,
    fixAddEntityTranslationKey,
    fixAddEntityToModule
};

/*
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function fixGetAllJhipsterConfig(clazz) {
    if (clazz.prototype._getAllJhipsterConfig !== undefined) {
        debug('Workaround getAllJhipsterConfig already installed');
        return;
    }
    debug('Workaround getAllJhipsterConfig installed');
    const old = clazz.prototype.getAllJhipsterConfig;
    clazz.prototype._getAllJhipsterConfig = old;
    clazz.prototype.getAllJhipsterConfig = function(generator2 = this, force) {
        const configuration = old.call(this, generator2, force);
        const options = generator2.options || {};
        const configOptions = generator2.configOptions || {};
        configuration._get = configuration.get;
        configuration.get = function(key) {
            const ret = options[key] || configOptions[key] || configuration._get(key);
            // debug(`${key} = ${ret}`);
            return ret;
        };
        return configuration;
    };
}

/*
 * Override addEntityToMenu changing the menu tenant is added to.
 */
function fixAddEntityToMenu(clazz) {
    if (clazz.prototype._addEntityToMenu !== undefined) {
        debug('Workaround fixAddEntityToMenu already installed');
        return;
    }
    debug('Workaround fixAddEntityToMenu installed');
    const addEntityToMenu = clazz.prototype.addEntityToMenu;
    clazz.prototype._addEntityToMenu = addEntityToMenu;
    clazz.prototype.addEntityToMenu = function(...args) {
        debug(`Executing addEntityToMenu ${args}`);
        if (args.length === 0) return;
        if (this.isTenant) {
            this.addElementToAdminMenu(
                `admin/${this.tenantFileName}`,
                'asterisk',
                this.enableTranslation,
                this.clientFramework,
                `global.menu.admin.${this.tenantMenuTranslationKey}`
            );
            debug('Ignoring addEntityToMenu');
            return;
        }
        addEntityToMenu.apply(this, args);
    };
}

/*
 * Override addEntityTranslationKey changing the menu tenant is added to.
 */
function fixAddEntityTranslationKey(clazz) {
    if (clazz.prototype._addEntityTranslationKey !== undefined) {
        debug('Workaround fixAddEntityTranslationKey already installed');
        return;
    }
    debug('Workaround fixAddEntityTranslationKey installed');
    const addEntityTranslationKey = clazz.prototype.addEntityTranslationKey;
    clazz.prototype._addEntityTranslationKey = addEntityTranslationKey;
    clazz.prototype.addEntityTranslationKey = function(...args) {
        debug(`Executing addEntityTranslationKey ${args}`);
        if (args.length === 0) return;
        if (this.isTenant) {
            debug('Using addAdminElementTranslationKey');
            this.addAdminElementTranslationKey(...args);
            return;
        }
        addEntityTranslationKey.apply(this, args);
    };
}

/*
 * Workaround entity always been add to entity module
 */
function fixAddEntityToModule(clazz) {
    if (clazz.prototype._addEntityToModule !== undefined) {
        debug('Workaround fixAddEntityToModule already installed');
        return;
    }
    const addEntityToModule = clazz.prototype.addEntityToModule;
    clazz.prototype._addEntityToModule = addEntityToModule;
    debug('Workaround fixAddEntityToModule installed');
    clazz.prototype.addEntityToModule = function(
        entityInstance,
        entityClass,
        entityName,
        entityFolderName,
        entityFileName,
        entityUrl,
        clientFramework,
        microServiceName
    ) {
        debug(`fixAddEntityToModule ${entityInstance}`);
        if (entityInstance === undefined) return;
        if (!this.isTenant) {
            addEntityToModule.apply(this, [
                entityInstance,
                entityClass,
                entityName,
                entityFolderName,
                entityFileName,
                entityUrl,
                clientFramework,
                microServiceName
            ]);
            return;
        }
        /**
         * Add a new admin in the TS modules file.
         *
         * @param {string} appName - Angular2 application name.
         * @param {string} adminAngularName - The name of the new admin item.
         * @param {string} adminFolderName - The name of the folder.
         * @param {string} adminFileName - The name of the file.
         * @param {boolean} enableTranslation - If translations are enabled or not.
         * @param {string} clientFramework - The name of the client framework.
         */
        const moduleNeedle = 'jhipster-needle-add-admin-module';
        const appName = this.getAngularXAppName();
        const entityAngularName = entityName;

        const adminModulePath = `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/admin/admin.module.ts`;
        const modulePath = `./${entityFolderName}/${entityFileName}.module`;

        const moduleName = microServiceName
            ? `${this.upperFirstCamelCase(microServiceName)}${entityAngularName}Module`
            : `${appName}${entityAngularName}Module`;
        const splicable = `|RouterModule.forChild([
                |            {
                |                path: '${entityFileName}',
                |                loadChildren: '${modulePath}#${moduleName}'
                |            }]),`;

        const errorMessage = `${chalk.yellow('Reference to ') + entityFileName + clientFramework} ${chalk.yellow(
            `not added to ${modulePath}.\n`
        )}`;

        const moduleRewriteFileModel = this.needleApi.clientAngular.generateFileModel(
            adminModulePath,
            moduleNeedle,
            this.stripMargin(splicable)
        );
        this.needleApi.clientAngular.addBlockContentToFile(moduleRewriteFileModel, errorMessage);
    };
}
