const envName = process.env.NODE_ENV;

const defaultEnv = {
    port: 8080
};

const environments = {};

module.exports = { ...defaultEnv, ...(environments[envName] || {}) };
