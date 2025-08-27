"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueId = exports.randomCredentialPayloadWithOauthTokenData = exports.randomCredentialPayload = exports.randomEmail = exports.randomName = exports.randomInvalidPassword = exports.randomValidPassword = exports.chooseRandomly = exports.randomApiKey = void 0;
const constants_1 = require("@n8n/constants");
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
const randomApiKey = () => `n8n_api_${(0, n8n_workflow_1.randomString)(40)}`;
exports.randomApiKey = randomApiKey;
const chooseRandomly = (array) => array[(0, n8n_workflow_1.randomInt)(array.length)];
exports.chooseRandomly = chooseRandomly;
const randomUppercaseLetter = () => (0, exports.chooseRandomly)(n8n_workflow_1.UPPERCASE_LETTERS.split(''));
const randomValidPassword = () => (0, n8n_workflow_1.randomString)(constants_1.MIN_PASSWORD_CHAR_LENGTH, constants_1.MAX_PASSWORD_CHAR_LENGTH - 2) +
    randomUppercaseLetter() +
    (0, n8n_workflow_1.randomInt)(10);
exports.randomValidPassword = randomValidPassword;
const randomInvalidPassword = () => (0, exports.chooseRandomly)([
    (0, n8n_workflow_1.randomString)(1, constants_1.MIN_PASSWORD_CHAR_LENGTH - 1),
    (0, n8n_workflow_1.randomString)(constants_1.MAX_PASSWORD_CHAR_LENGTH + 2, constants_1.MAX_PASSWORD_CHAR_LENGTH + 100),
    'abcdefgh',
    'abcdefg1',
    'abcdefgA',
    'abcdefA',
    'abcdef1',
    'abcdeA1',
    'abcdefg',
]);
exports.randomInvalidPassword = randomInvalidPassword;
const POPULAR_TOP_LEVEL_DOMAINS = ['com', 'org', 'net', 'io', 'edu'];
const randomTopLevelDomain = () => (0, exports.chooseRandomly)(POPULAR_TOP_LEVEL_DOMAINS);
const randomName = () => (0, n8n_workflow_1.randomString)(4, 8).toLowerCase();
exports.randomName = randomName;
const randomEmail = () => `${(0, exports.randomName)()}@${(0, exports.randomName)()}.${randomTopLevelDomain()}`;
exports.randomEmail = randomEmail;
const randomCredentialPayload = ({ isManaged = false, } = {}) => ({
    name: (0, exports.randomName)(),
    type: (0, exports.randomName)(),
    data: { accessToken: (0, n8n_workflow_1.randomString)(6, 16) },
    isManaged,
});
exports.randomCredentialPayload = randomCredentialPayload;
const randomCredentialPayloadWithOauthTokenData = ({ isManaged = false, } = {}) => ({
    name: (0, exports.randomName)(),
    type: (0, exports.randomName)(),
    data: { accessToken: (0, n8n_workflow_1.randomString)(6, 16), oauthTokenData: { access_token: (0, n8n_workflow_1.randomString)(6, 16) } },
    isManaged,
});
exports.randomCredentialPayloadWithOauthTokenData = randomCredentialPayloadWithOauthTokenData;
const uniqueId = () => (0, uuid_1.v4)();
exports.uniqueId = uniqueId;
//# sourceMappingURL=random.js.map