const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const COMMUNITY_INVITE = "fedi:community10v3xxmmdd46ku6t5090k6et5v90h2unvygazy6r5w3c8xw309a4x76tw943k7mtdw4hxjare9eenxtn4wvkk2ctnwsknztnpd4sh5mmwv9mhxtnrdakj7ctxwf5ky6t5ta4kjcn9wfsj7mt9w3sju6nndahzylg3wdue0";
const FEDERATION_INVITE = "fed11qgqyj3mfwfhksw309ucrxe35vgcryvesxf3nyepsv3jnyepsvgcnxdpjv5urjcfkv4nrydmxxvervef3xcmxxce5x5ergwfnxcukzetr8qen2vnpvsmr2vrzqyqjplegdfhg4qq8f0zeuvjxn8e49sa3tnep7w08dca79wecgjkyszrufgwesp";

const outputDir = path.join(__dirname, '..', 'public', 'Media', 'Images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// QR Code options for high quality
const options = {
  errorCorrectionLevel: 'H',
  type: 'png',
  quality: 1,
  margin: 2,
  width: 1024,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
};

async function generateQRCodes() {
  try {
    // Generate Community QR Code
    const communityPath = path.join(outputDir, 'fedi-community-qr.png');
    await QRCode.toFile(communityPath, COMMUNITY_INVITE, options);
    console.log(`✅ Community QR code generated: ${communityPath}`);

    // Generate Federation QR Code
    const federationPath = path.join(outputDir, 'fedi-federation-qr.png');
    await QRCode.toFile(federationPath, FEDERATION_INVITE, options);
    console.log(`✅ Federation QR code generated: ${federationPath}`);

    console.log('\n✨ All QR codes generated successfully!');
  } catch (error) {
    console.error('❌ Error generating QR codes:', error);
    process.exit(1);
  }
}

generateQRCodes();
