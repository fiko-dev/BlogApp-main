//chatgpt generated - attempts to fix auth errors on ec2 instance

const forge = require('node-forge');
const fs = require('fs');

// Create a new certificate
const keys = forge.pki.rsa.generateKeyPair(2048);
const cert = forge.pki.createCertificate();

// Set the public key
cert.publicKey = keys.publicKey;

// Set certificate information
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1); // Valid for 1 year

const attrs = [
  { name: 'commonName', value: 'example.com' },
  { name: 'countryName', value: 'US' },
  { shortName: 'ST', value: 'California' },
  { name: 'localityName', value: 'San Francisco' },
  { name: 'organizationName', value: 'Example, Inc.' },
  { shortName: 'OU', value: 'IT' },
];

cert.setSubject(attrs);
cert.setIssuer(attrs);
cert.setExtensions([
  {
    name: 'basicConstraints',
    cA: true,
  },
  {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  },
  {
    name: 'subjectAltName',
    altNames: [
      {
        type: 2, // DNS
        value: 'example.com',
      },
    ],
  },
]);

// Sign the certificate
cert.sign(keys.privateKey);

// Save the private key and certificate to files
const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
const certificatePem = forge.pki.certificateToPem(cert);

fs.writeFileSync('private-key.pem', privateKeyPem);
fs.writeFileSync('certificate.pem', certificatePem);

console.log('Private key and certificate generated successfully.');