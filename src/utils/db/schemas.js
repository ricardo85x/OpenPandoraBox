export const SupportedTypes = {
    INTEGER: {
        value: 'INTEGER',
        type: 'INTEGER',
        default_value: null
    },
    LONG: {
        value: 'LONG',
        type: 'INTEGER',
        default_value: null
    },
    DOUBLE: {
        value: 'DOUBLE',
        type: 'REAL',
        default_value: null
    },
    TEXT: {
        value: 'TEXT',
        type: 'TEXT',
        default_value: null
    },
    BOOLEAN: {
        value: 'BOOLEAN',
        type: 'INTEGER',
        default_value: null
    },
    DATETIME: {
        value: 'DATETIME',
        type: 'TEXT',
        default_value: null
    },
    SYNC_STATUS: {
        value: 'STATUS',
        type: 'TEXT',
        default_value: null
    },
    JSON: {
        value: 'JSON',
        type: 'TEXT',
        default_value: null
    },
};

export const Tables = {
    
    Rom: {
        platform: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        id: {
            type: SupportedTypes.INTEGER,
            primary_key: false,
            default_value: null,
        },
        name: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        path: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        thumbnail: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        image: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        video: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        desc: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        },
        romName: {
            type: SupportedTypes.TEXT,
            primary_key: false,
            default_value: null,
        }
    }
};