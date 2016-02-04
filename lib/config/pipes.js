module.exports = {
  'auth:getCurrentUser': 'cleanUserCredentials',
  'security:createUser': 'encryptCredentials',
  'security:updateUser': 'encryptCredentials',
  'security:createOrReplaceUser': 'encryptCredentials',
  'security:getUser': 'cleanUserCredentials',
  'security:searchUsers': 'cleanUsersCredentials'
};
