const {
    NODE_ENV = 'development'
} = process.env;

const IN_PROD = NODE_ENV === 'production';
exports.IN_PROD = IN_PROD;