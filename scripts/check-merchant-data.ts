import { executeQuery } from '../lib/db';

interface MerchantFields {
  business_name: string;
  category_value: string;
  opening_hours: string | null;
  website: string | null;
  social_twitter: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  description: string | null;
  verification_photos: string | null;
  verifier_notes: string | null;
  phone: string | null;
  lightning_address: string | null;
}

async function checkMerchantData() {
  console.log('🔍 Checking merchant data richness...\n');

  const merchants = await executeQuery<MerchantFields[]>(
    `SELECT
      business_name,
      category_value,
      opening_hours,
      website,
      social_twitter,
      social_facebook,
      social_instagram,
      description,
      verification_photos,
      verifier_notes,
      phone,
      lightning_address
     FROM merchant_submissions
     WHERE status = 'published'
     LIMIT 5`
  );

  console.log(`Found ${merchants.length} published merchants\n`);

  merchants.forEach((merchant, index) => {
    console.log(`\n[${ index + 1}] ${merchant.business_name}`);
    console.log('═══════════════════════════════════════');
    console.log(`Category: ${merchant.category_value || '❌ Missing'}`);
    console.log(`Phone: ${merchant.phone || '❌ Missing'}`);
    console.log(`Website: ${merchant.website || '❌ Missing'}`);
    console.log(`Lightning: ${merchant.lightning_address || '❌ Missing'}`);
    console.log(`Opening Hours: ${merchant.opening_hours || '❌ Missing'}`);
    console.log(`Description: ${merchant.description ? '✅ Present' : '❌ Missing'}`);
    console.log(`Twitter: ${merchant.social_twitter || '❌ Missing'}`);
    console.log(`Facebook: ${merchant.social_facebook || '❌ Missing'}`);
    console.log(`Instagram: ${merchant.social_instagram || '❌ Missing'}`);
    console.log(`Verification Photos: ${merchant.verification_photos ? '✅ Present' : '❌ Missing'}`);
    console.log(`Verifier Notes: ${merchant.verifier_notes ? '✅ Present' : '❌ Missing'}`);
  });

  // Count empty fields
  const fieldStats = {
    total: merchants.length,
    missingWebsite: 0,
    missingOpeningHours: 0,
    missingDescription: 0,
    missingSocialMedia: 0,
    missingVerificationPhotos: 0,
    missingLightning: 0,
  };

  merchants.forEach(m => {
    if (!m.website) fieldStats.missingWebsite++;
    if (!m.opening_hours) fieldStats.missingOpeningHours++;
    if (!m.description) fieldStats.missingDescription++;
    if (!m.social_twitter && !m.social_facebook && !m.social_instagram) fieldStats.missingSocialMedia++;
    if (!m.verification_photos) fieldStats.missingVerificationPhotos++;
    if (!m.lightning_address) fieldStats.missingLightning++;
  });

  console.log('\n\n📊 DATA COMPLETENESS SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`Total Merchants: ${fieldStats.total}`);
  console.log(`Missing Website: ${fieldStats.missingWebsite}/${fieldStats.total} (${Math.round(fieldStats.missingWebsite/fieldStats.total*100)}%)`);
  console.log(`Missing Opening Hours: ${fieldStats.missingOpeningHours}/${fieldStats.total} (${Math.round(fieldStats.missingOpeningHours/fieldStats.total*100)}%)`);
  console.log(`Missing Description: ${fieldStats.missingDescription}/${fieldStats.total} (${Math.round(fieldStats.missingDescription/fieldStats.total*100)}%)`);
  console.log(`Missing Social Media: ${fieldStats.missingSocialMedia}/${fieldStats.total} (${Math.round(fieldStats.missingSocialMedia/fieldStats.total*100)}%)`);
  console.log(`Missing Verification Photos: ${fieldStats.missingVerificationPhotos}/${fieldStats.total} (${Math.round(fieldStats.missingVerificationPhotos/fieldStats.total*100)}%)`);
  console.log(`Missing Lightning: ${fieldStats.missingLightning}/${fieldStats.total} (${Math.round(fieldStats.missingLightning/fieldStats.total*100)}%)`);
}

checkMerchantData().catch(console.error);
