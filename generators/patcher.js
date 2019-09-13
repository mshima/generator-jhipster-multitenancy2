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
    constructor(generator, options = {}) {
        this.generator = generator;
        this.options = { ...defaultOptions, ...options };

        const ignorePatchErrors = generator.options.ignorePatchErrors || generator.options['ignore-patch-errors'];
        if (ignorePatchErrors !== undefined) this.options.ignorePatchErrors = ignorePatchErrors;

        // _sourceRoot is templates path from yo-generator
        // Alternative is resolved that point to generator file
        this.rootPath = path.resolve(generator._sourceRoot, `../${this.options.autoLoadPath}`);

        this.templates = glob.sync(`${this.rootPath}/**/*.js`);
        debug('Found patches:');
        debug(this.templates);

        this.disableFeatures = [];
        if (generator.options['disable-tenant-features']) {
            this.disableFeatures = generator.options['disable-tenant-features'].split(',');
        }
        debug('Disabled features:');
        debug(this.disableFeatures);
    }

    patch(generator = this.generator, templates = this.templates) {
        if (!templates) {
            generator.error('Missing templates');
        }
        const requiredTemplates = this.requireTemplates(templates, generator);
        this.processPartialTemplates(generator, requiredTemplates);

        this.writeFiles(requiredTemplates, generator);
    }

    writeFiles(requiredTemplates, generator = this.generator) {
        requiredTemplates.forEach(fileTemplate => {
            // not ejs files, treated by processPartialTemplates
            if (fileTemplate.filename !== 'files.js') return;

            // const templatesJson = JSON.stringify(templates);
            // debug(`${templatesJson}`);
            // parse the templates and write files to the appropriate locations
            if (fileTemplate.files === undefined) {
                this.generator.error(`Template file should have format: { file: { feature: [ ...patches ] } } (${fileTemplate.origin})`);
            }
            this.disableFeatures.forEach(disabledFeature => {
                if (fileTemplate.files[disabledFeature] !== undefined) {
                    debug(`======== Template with feature ${disabledFeature} disabled (${fileTemplate.origin})`);
                    delete fileTemplate.files[disabledFeature];
                }
            });
            generator.writeFilesToDisk(fileTemplate.files, generator, false);
        });
    }

    processPartialTemplates(generator, partialTemplates) {
        if (!generator || !generator.options) {
            debug('generator parameter is not a generator');
            generator.error('Error');
        }

        partialTemplates.forEach(templates => {
            // ejs files, treated by writeFiles
            if (templates.filename === 'files.js') return;

            if (typeof templates.condition === 'function' && !templates.condition(generator)) {
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
                if (!this.options.ignorePatchErrors && success === false)
                    generator.error(`Error applying template ${templates.origin} on ${file}`);

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
        const ret = [];
        templates.forEach(file => {
            const parse = path.parse(file);
            const filename = parse.base;
            // Rebuild file name without extension
            const template = path.format({ ...parse, ext: undefined, base: undefined });
            const relativePath = path.relative(this.rootPath, template);

            const feature = relativePath.split(path.sep, 1)[0];
            debug(`======== Loading feature ${feature}, template ${file}`);
            if (this.disableFeatures.includes(feature)) {
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
            loadedTemplate.feature = feature;
            loadedTemplate.filename = filename;
            ret.push(loadedTemplate);
            debug(`======== Success loading template ${loadedFile}`);
        });
        return ret;
    }
};
