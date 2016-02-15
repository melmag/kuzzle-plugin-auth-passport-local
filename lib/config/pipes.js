module.exports = {
  'security:formatUserForSerialization': 'cleanUserCredentials',
  'security:createUser': 'encryptCredentials',
  'security:updateUser': 'encryptCredentials',
  'security:createOrReplaceUser': 'encryptCredentials'
};
