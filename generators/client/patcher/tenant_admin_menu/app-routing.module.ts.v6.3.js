const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/app-routing.module.ts`;

const tmpls = [
    {
        version: '6.3.0 - 6.3.1',
        type: 'rewriteFile',
        target: context => 'const LAYOUT_ROUTES = [',
        tmpl: context => `import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
`
    }
];

module.exports = {
    file,
    tmpls
};
