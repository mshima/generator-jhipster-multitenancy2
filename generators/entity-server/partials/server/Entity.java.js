const file = (context) => {
    return `${context.javaDir}domain/${context.entityClass}.java`;
};

const tmpls = [
    {
        type: 'rewriteFile',
        target: 'import javax.persistence.*;',
        tmpl: (context) => {
            return `import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `public class ${context.entityClass}`;
        },
        tmpl: (context) => {
            return `@FilterDef(name = "TENANT_FILTER", parameters = {@ParamDef(name = "${context.tenantNameLowerFirst}Id", type = "long")})
@Filter(name = "TENANT_FILTER", condition = "${context.tenantNameLowerFirst}_id = :${context.tenantNameLowerFirst}Id")`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
