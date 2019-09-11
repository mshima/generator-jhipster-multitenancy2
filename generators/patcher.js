const chalk = require('chalk');
const path = require('path');
const glob = require('glob');
const debug = require('debug')('jhipster:multitenancy2:patcher');

const packagejs = require('generator-jhipster/package.json');

const jhipsterVersion = packagejs.version;
const defaultOptions = {
    autoLoadPath: 'patcher',
    defaultLoadPath: 'partials'
};

module.exports = class Patcher {
    constructor(generator, module, templates, writeFiles, options = {}) {
        this.options = { ...defaultOptions, ...options };
        this.module = module;
        this.writeFiles = writeFiles;
        if (templates !== undefined) {
            this.templates = templates;
        } else if (generator) {
            // _sourceRoot is templates path from yo-generator
            // Alternative is resolved that point to generator file
            this.rootPath = path.resolve(generator._sourceRoot, `../${this.options.autoLoadPath}`);
            this.templates = glob.sync(`${this.rootPath}/**/*.js`);
            debug('Found patches:');
            debug(this.templates);
        }
    }

    patch(generator) {
        this._patch(generator, this.templates, this.writeFiles);
    }

    _patch(generator, templates, writeFiles) {
        if (generator.ignorePatcher) return;
        if (templates) {
            const fileTemplates = this.requireTemplates(templates, generator);
            this.processPartialTemplates(generator, fileTemplates);
        }

        if (writeFiles) {
            writeFiles.call(generator);
        }
    }

    processPartialTemplates(generator, partialTemplates) {
        if (!generator || !generator.options) {
            debug('generator parameter is not a generator');
            generator.error('Error');
        }

        const abortOnPatchError = generator.options.abortOnPatchError || generator.options['abort-on-patch-error'] || false;
        partialTemplates.forEach(templates => {
            if (typeof templates.condition === 'function' && templates.condition(generator)) {
                debug(`Disabled by templates condition ${templates.condition}`);
                return;
            }
            const file = typeof templates.file === 'function' ? templates.file(generator) : templates.file;
            templates.tmpls.forEach((item, index) => {
                debug(`======== Applying template ${templates.origin}[${index}] on ${file}`);
                // ignore if version is not compatible
                if (item.versions && !item.versions.includes(jhipsterVersion)) {
                    debug(`Version not compatible ${jhipsterVersion}`);
                    return;
                }
                if (item.disabled) {
                    debug('Template disabled');
                    return;
                }
                if (typeof item.condition === 'function') {
                    if (!item.condition(generator)) {
                        debug(`Disabled by condition ${item.condition}`);
                        return;
                    }
                }
                // debug(`type: ${item.type}`);
                // debug(`regex: ${item.regex}`);
                const target = typeof item.target === 'function' ? item.target(generator) : item.target;
                // debug(`target: ${target}`);

                const tmpl = typeof item.tmpl === 'function' ? item.tmpl(generator) : item.tmpl;
                // debug(`tmpl: ${tmpl}`);
                let success;
                if (item.type === 'replaceContent') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    success = generator.replaceContent(file, target, tmpl, item.regex);
                } else if (item.type === 'rewriteFile') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    success = generator.rewriteFile(file, target, tmpl);
                }
                let successLog = `${success}`;
                if (!success) successLog = chalk.red(`${success}`);
                if (abortOnPatchError && success === false) generator.error(`Error applying template ${templates.origin} on ${file}`);
                debug(`======== Template finished type: ${item.type}, success: ${successLog}`);
                if (!success && generator.options['debug-patcher']) {
                    try {
                        const body = generator.fs.read(file);
                        debug(`Target: ${target}`);
                        generator.log(body);
                    } catch (e) {
                        debug(`File ${file} not found`);
                    }
                }
            });
        });
    }

    requireTemplates(templates, generator) {
        const disableTenantFeatures = (generator.options['disable-tenant-features'] || '').split(',');
        const ret = [];
        templates.forEach(file => {
            let template = file;
            let relativePath;
            if (path.isAbsolute(file)) {
                template = path.format({ ...path.parse(file), ext: undefined, base: undefined });
                relativePath = path.relative(this.rootPath, template);
            } else {
                relativePath = file;
                template = `./${this.module}/${this.options.defaultLoadPath}/${file}`;
            }
            const feature = relativePath.split(path.sep, 1)[0];
            debug(`======== Loading feature ${feature}, template ${file}`);
            if (disableTenantFeatures.includes(feature)) {
                debug(`======== Template with feature ${feature} disabled (${file})`);
                return;
            }
            let version = jhipsterVersion;
            let loadedFile;
            let loadedTemplate;
            while (loadedTemplate === undefined) {
                // Look for specific version
                try {
                    loadedFile = `${template}.v${version}.js`;
                    // debug(`Trying ${loadedFile}`);
                    loadedTemplate = require(loadedFile);
                } catch (e) {
                    const lastIndex = version.lastIndexOf('.');
                    if (lastIndex === -1) break;
                    version = version.substring(0, lastIndex);
                }
            }
            if (loadedTemplate === undefined) {
                try {
                    loadedFile = `${template}.js`;
                    loadedTemplate = require(loadedFile);
                } catch (e) {
                    if (generator && generator.log) generator.log(`Error loading ${loadedFile}`);
                    debug(`Error loading ${loadedFile}`);
                    return;
                }
            }
            loadedTemplate.origin = loadedFile;
            ret.push(loadedTemplate);
            debug(`======== Success loaging template ${loadedFile}`);
        });
        return ret;
    }
};
