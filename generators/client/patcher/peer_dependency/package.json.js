const file = context => 'package.json';

const tmpls = [
    {
        type: 'replaceContent',
        target: /(\s*"generator-jhipster": "[\w.]*"),(.*)(\n\s*)("engines": \{)/is,
        tmpl: '$2$3"peerDependencies": {$1$3},$3$4'
    }
    /*
    {
        type: 'replaceContent',
        ignorePatchErrors: true,
        target: /("typescript": "[\w.]*",)(.*)(\n\s*"webdriver-manager": "[\w.]*")/is,
        tmpl: ''
    }
    */
];

module.exports = {
    file,
    tmpls
};
