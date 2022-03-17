// @ts-ignore
module.exports = {
  jira: {
    api: {
      host: 'tranwall.atlassian.net',
      email: '...@clearspend.com',
      token: '', // Token from https://id.atlassian.com/manage-profile/security/api-tokens
      options: {
        ticketIDPattern: /\[([A-Z]+\-[0-9]+)\]/i,
      },
    },
    ticketIDPattern: /[A-Z]+\-[0-9]+/i,
  },
};
