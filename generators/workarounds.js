const chalk = require('chalk');
const path = require('path');

const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const jhipsterUtils = require('generator-jhipster/generators/utils');

const debug = require('debug')('jhipster:multitenancy2:workarounds');

module.exports = {
    fixGetAllJhipsterConfig,
    fixAddEntityToMenu,
    fixAddEntityTranslationKey,
    fixAddEntityToModule,
    addReturnRewriteReplace
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

/*
 * https://github.com/jhipster/generator-jhipster/pull/10366
 */
function addBlockContentToFile(rewriteFileModel, errorMessage) {
    debug('Running addBlockContentToFile');
    try {
        return jhipsterUtils.rewriteFile(rewriteFileModel, this.generator);
    } catch (e) {
        this.logNeedleNotFound(e, errorMessage, rewriteFileModel.file);
        return false;
    }
}

/*
 * https://github.com/jhipster/generator-jhipster/pull/10366
 */
function addReturnRewriteReplace(clazz) {
    if (clazz.prototype._replaceContent !== undefined) {
        debug('Workaround addReturnRewriteReplace already installed');
        return;
    }
    debug('Workaround fixAddEntityToModule installed');

    jhipsterUtils.rewriteFile = function(args, generator) {
        debug('Running jhipsterUtils.rewriteFile');
        args.path = args.path || process.cwd();
        const fullPath = path.join(args.path, args.file);

        args.haystack = generator.fs.read(fullPath);
        const body = jhipsterUtils.rewrite(args);
        generator.fs.write(fullPath, body);
        return args.haystack !== body;
    };

    jhipsterUtils.replaceContent = function(args, generator) {
        args.path = args.path || process.cwd();
        const fullPath = path.join(args.path, args.file);

        const re = args.regex ? new RegExp(args.pattern, 'g') : args.pattern;

        const currentBody = generator.fs.read(fullPath);
        const newBody = currentBody.replace(re, args.content);
        generator.fs.write(fullPath, newBody);
        return newBody !== currentBody;
    };

    clazz.prototype._replaceContent = clazz.prototype.replaceContent;
    clazz.prototype.replaceContent = function(filePath, pattern, content, regex) {
        // yo generator queue call
        if (filePath === undefined) return undefined;
        try {
            return jhipsterUtils.replaceContent(
                {
                    file: filePath,
                    pattern,
                    content,
                    regex
                },
                this
            );
        } catch (e) {
            this.log(
                chalk.yellow('\nUnable to find ') + filePath + chalk.yellow(' or missing required pattern. File rewrite failed.\n') + e
            );
            this.debug('Error:', e);
            return false;
        }
    };

    clazz.prototype._rewriteFile = clazz.prototype.rewriteFile;
    clazz.prototype.rewriteFile = function(filePath, needle, content) {
        // yo generator queue call
        if (filePath === undefined) return undefined;
        const rewriteFileModel = this.needleApi.base.generateFileModel(filePath, needle, content);
        return addBlockContentToFile.call(this.needleApi.base, rewriteFileModel);
    };
}
