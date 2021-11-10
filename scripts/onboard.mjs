import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';

let HOST = '';
let COOKIE = '';

const ARGUMENTS = process.argv.slice(2);
if (ARGUMENTS.length !== 4 || ARGUMENTS.some((val) => !val)) throw new Error('Invalid arguments');

const [firstName, lastName, email, phone] = ARGUMENTS;
const PASS = '1234567890';

const ADDRESS = {
  streetLine1: 'Some Street',
  streetLine2: '',
  locality: 'Some',
  region: 'Alabama',
  postalCode: '12345',
  country: 'USA',
};

function readEnvFile() {
  const content = fs.readFileSync(path.resolve('.env.dev'), 'utf8');

  return content.split('\n').filter(Boolean).reduce((acc, str) => {
    const [key, value] = str.split('=');
    if (key && value) acc[key] = value;
    return acc;
  }, {});
}

function randomInteger(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function getRandomNum(length = 9) {
  return Array.from(new Array(length)).map(() => randomInteger(0, 9)).join('');
}

// function get(url) {
//   return new Promise((resolve, reject) => {
//     https
//       .get(
//         {
//           hostname: HOST,
//           port: 443,
//           path: '/api' + url,
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         },
//         (resp) => {
//           let data = '';
//           resp.on('data', (chunk) => (data += chunk));
//           resp.on('end', () => resolve(data ? JSON.parse(data) : null));
//         },
//       )
//       .on('error', (error) => reject(error));
//   });
// }

function request(method, url, params) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: HOST,
        port: 443,
        path: '/api' + url,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Cookie': COOKIE,
        },
      },
      (resp) => {
        let data = '';
        resp.on('data', (chunk) => (data += chunk));
        resp.on('end', () => {
          if (resp.statusCode !== 200) {
            return reject(data);
          }

          if (url === '/authentication/login') {
            COOKIE = (resp.headers['set-cookie'] || [])
              .map(item => {
                const match = item.match(/^.+?=.+?;/);
                return Boolean(match) ? match[0] : '';
              })
              .join(' ');
          }

          resolve(data ? JSON.parse(data) : null);
        });
      },
    );

    req.on('error', (error) => reject(error));
    req.write(JSON.stringify(params));
    req.end();
  });
}

function post(url, params) {
  return request('POST', url, params);
}

function patch(url, params) {
  return request('PATCH', url, params);
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function main() {
  const env = readEnvFile();

  HOST = env.DEV_API.replace(/^https?:\/\//, '');
  if (!HOST) throw new Error('Invalid host');

  console.log('Get prospect ID...');
  const prospect = await post('/business-prospects', { email, firstName, lastName });
  const { businessProspectId: pid, businessProspectStatus: status } = prospect;

  if (status !== 'NEW') throw new Error('Not NEW');

  const emailOTP = await ask('Input email code:');
  await post(`/business-prospects/${pid}/validate-identifier`, { identifierType: 'EMAIL', otp: emailOTP });

  console.log('Set phone number...');
  await post(`/business-prospects/${pid}/phone`, { phone });

  const phoneOTP = await ask('Input phone code:');
  await post(`/business-prospects/${pid}/validate-identifier`, { identifierType: 'PHONE', otp: phoneOTP });

  console.log('Set password...');
  await post(`/business-prospects/${pid}/password`, { password: PASS });

  console.log('Login...');
  await post('/authentication/login', { username: email, password: PASS });

  console.log('Set business info...');
  const { businessOwnerId } = await post(`/business-prospects/${pid}/convert`, {
    legalName: `Legal Name (${firstName} ${lastName})`,
    businessType: 'LLC',
    employerIdentificationNumber: getRandomNum(),
    businessPhone: '+12345678901',
    address: ADDRESS,
  });

  console.log('Set business owner...');
  await patch(`/business-owners/${businessOwnerId}`, {
    firstName,
    lastName,
    dateOfBirth: '1990-01-01',
    taxIdentificationNumber: getRandomNum(),
    email,
    address: ADDRESS,
    isOnboarding: true,
  });
}

main()
  .then(() => console.log('Done!'))
  .catch(console.error);
