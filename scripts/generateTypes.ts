const { resolve } = require('path');
const { generateApi } = require('swagger-typescript-api');

const DEFAULT_URL = 'https://api.capital.dev.tranwall.net/v3/api-docs';
const url = process.env.API_DOC_URL ?? DEFAULT_URL;

generateApi({
  url,
  name: 'capital.ts',
  output: resolve(__dirname, '../src/generated'),
  generateClient: false,
  prettier: true,
});
