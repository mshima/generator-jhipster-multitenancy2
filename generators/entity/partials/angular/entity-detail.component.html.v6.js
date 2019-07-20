const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityNameLowerFirst}/${context.entityNameLowerFirst}-detail.component.html`;
};

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `jhiTranslate="(.*\\.)${context.tenantNameLowerFirst}"`;
        },
        tmpl: (context) => {
            return `jhiTranslate="userManagement${context.tenantNameUpperFirst}"`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `<dt><span(.*)>${context.tenantNameUpperFirst}</span></dt>(\\s*)<dd>`;
        },
        tmpl: (context) => {
            return `<dt *ngIf="${context.entityNameLowerFirst}.${context.tenantNameLowerFirst}"><span$1>${context.tenantNameUpperFirst}</span></dt>$2<dd>`;
        }
    },
    {
        type: 'replaceContent',
        regex: false,
        target: (context) => {
            return `{{${context.entityNameLowerFirst}.${context.tenantNameLowerFirst}?.id}}`;
        },
        tmpl: (context) => {
            return `{{${context.entityNameLowerFirst}.${context.tenantNameLowerFirst}?.name}}`;
        }
    },
    {
        type: 'replaceContent',
        regex: false,
        target: (context) => {
            return `[routerLink]="['/${context.tenantNameLowerFirst}'`;
        },
        tmpl: (context) => {
            return `[routerLink]="['/admin/${context.tenantNameLowerFirst}-management'`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
