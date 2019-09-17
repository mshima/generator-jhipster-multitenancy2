const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const mtExpectedFiles = require('./multitenancy_utils/expected-files');

describe('Subgenerator entity-tenant of multitenancy2 JHipster blueprint', () => {
    describe('Sample test', () => {
        before(done => {
            helpers
                .run(path.join(__dirname, '../generators/entity-tenant'))
                .withOptions({
                    'from-cli': true,
                    skipInstall: true,

                    baseName: 'jhipster',

                    clientFramework: 'angularX',
                    packageName: 'com.mycompany.myapp',
                    packageFolder: 'com/mycompany/myapp',
                    serviceDiscoveryType: false,
                    authenticationType: 'jwt',
                    cacheProvider: 'ehcache',
                    enableHibernateCache: true,
                    databaseType: 'sql',
                    devDatabaseType: 'h2Memory',
                    prodDatabaseType: 'mysql',
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr'],
                    buildTool: 'maven',
                    rememberMeKey: '5c37379956bd1242f5636c8cb322c2966ad81277',

                    blueprint: 'multitenancy2',
                    tenantName: 'Company',
                    tenantFileSuffix: 'management',
                    baseChangelogDate: '2019-09-07',
                    skipChecks: true
                })
                .withGenerators([
                    [
                        require('../generators/entity-client/index.js'), // eslint-disable-line global-require
                        'jhipster-multitenancy2:entity-client',
                        path.join(__dirname, '../generators/entity-client/index.js')
                    ],
                    [
                        require('../generators/entity-server/index.js'), // eslint-disable-line global-require
                        'jhipster-multitenancy2:entity-server',
                        path.join(__dirname, '../generators/entity-server/index.js')
                    ],
                    [
                        require('../generators/entity-i18n/index.js'), // eslint-disable-line global-require
                        'jhipster-multitenancy2:entity-i18n',
                        path.join(__dirname, '../generators/entity-i18n/index.js')
                    ]
                ])
                .withArguments(['company'])
                .withPrompts({
                    fieldAdd: false,
                    relationshipAdd: false,
                    dto: 'no',
                    service: 'serviceClass',
                    pagination: 'infinite-scroll'
                })
                .on('end', done);
        });

        it('creates expected default files with tenant files for angularX', () => {
            assert.file(mtExpectedFiles.entity.clientNg2);
            assert.file(mtExpectedFiles.entity.server);
            assert.file(mtExpectedFiles.i18nJson);
        });
    });
});
