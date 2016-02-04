module.exports = {
  'auth:getCurrentUser': 'cleanCredentials',
  'security:createUser': 'encryptCredentials',
  'security:updateUser': 'encryptCredentials',
  'security:createOrReplaceUser': 'encryptCredentials',
  'security:getUser': 'cleanCredentials',
  'security:searchUsers': 'cleanCredentials'
};
