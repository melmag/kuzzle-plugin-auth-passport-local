module.exports = {
  'security:formatUserForSerialization': 'cleanUserCredentials',
  'security:beforeCreateUser': 'encryptCredentials',
  'security:beforeUpdateUser': 'encryptCredentials',
  'security:beforeCreateOrReplaceUser': 'encryptCredentials'
};
