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

        this.ignorePatchErrors = [];
        if (generator.options['ignore-patch-errors']) {
            this.ignorePatchErrors = generator.options['ignore-patch-errors'].split(',');
        }

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

        this.writeFiles(requiredTemplates.fileTemplates, generator);
        this.processPartialTemplates(generator, requiredTemplates.partialTemplates);
    }

    writeFiles(requiredTemplates, generator = this.generator) {
        requiredTemplates.forEach(fileTemplate => {
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

                debug(`======== Template finished type: ${item.type}, success: ${successLog}`);
                if (success === false && generator.options['debug-patcher']) {
                    try {
                        const body = generator.fs.read(file);
                        debug(`Target: ${target}`);
                        debug(body);
                    } catch (e) {
                        debug(`File ${file} not found`);
                    }
                }

                if (!this.options.ignorePatchErrors && success === false && !this.ignorePatchErrors.includes(templates.filename))
                    generator.error(`Error applying template ${templates.filename} (${templates.origin}) on ${file}`);
            });
        });
    }

    requireTemplates(templates, generator) {
        const partialTemplates = [];
        const fileTemplates = [];

        templates.forEach(file => {
            const parse = path.parse(file);
            const filename = parse.base;
            // Rebuild file name without extension
            const template = path.format({ ...parse, ext: undefined, base: undefined });

            const relativePath = path.relative(this.rootPath, template);

            const parseRelative = path.parse(relativePath);
            let feature;
            if (parseRelative.dir) {
                feature = parseRelative.dir.split(path.sep, 1)[0];
                debug(`======== Loading feature ${feature}, template ${file}`);
            } else {
                debug(`======== Loading template ${file}`);
            }
            if (this.disableFeatures.includes(feature)) {
                debug(`======== Template with feature ${feature} disabled (${file})`);
                return;
            }

            let dest = partialTemplates;
            if (parse.name === 'files') {
                dest = fileTemplates;
            } else {
                const splitFileName = parse.name.split('.v', 2);
                if (splitFileName.length > 1) {
                    if (!jhipsterVersion.startsWith(splitFileName[1])) {
                        debug(`Template ${parse.name} not compatible with jhipster ${jhipsterVersion}`);
                        return;
                    }
                    if (splitFileName[0] === 'files') {
                        dest = fileTemplates;
                    }
                }
            }

            const loadedTemplate = require(template);
            loadedTemplate.origin = template;
            loadedTemplate.feature = feature;
            loadedTemplate.filename = filename;
            dest.push(loadedTemplate);
            debug(`======== Success loading template ${template}`);
        });
        return {
            partialTemplates,
            fileTemplates
        };
    }
};
