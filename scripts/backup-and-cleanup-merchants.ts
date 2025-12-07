import { executeQuery } from '../lib/db';
import * as fs from 'fs';
import * as path from 'path';

interface Merchant {
  id: number;
  business_name: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  blink_address: string;
  osm_node_id: string;
  is_early_adopter: number;
  adopter_number: number;
  status: string;
  created_at: Date;
}

interface Submission {
  id: number;
  business_name: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  blink_address: string;
  submitter_email: string;
  status: string;
  created_at: Date;
}

async function main() {
  console.log('🔄 Starting merchant backup and cleanup process...\n');

  // 1. Backup current 43 merchants
  console.log('📦 Step 1: Backing up current 43 merchants...');
  const merchants = await executeQuery<Merchant[]>(
    'SELECT * FROM merchant_submissions WHERE status = "published" ORDER BY id'
  );

  const backupDir = path.join(__dirname, '..', 'backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `merchants_backup_${timestamp}.json`);
  
  fs.writeFileSync(backupFile, JSON.stringify(merchants, null, 2));
  console.log(`✅ Backed up ${merchants.length} merchants to: ${backupFile}\n`);

  // 2. Get submissions by edmundspira@gmail.com
  console.log('📋 Step 2: Fetching submissions by edmundspira@gmail.com...');
  const submissions = await executeQuery<Submission[]>(
    `SELECT * FROM merchant_submissions 
     WHERE submitter_email = 'edmundspira@gmail.com' 
     AND status = 'pending'
     ORDER BY created_at DESC`
  );

  console.log(`Found ${submissions.length} submissions by edmundspira@gmail.com\n`);

  // 3. Check for duplicates and matches
  console.log('🔍 Step 3: Checking for duplicates and matches...\n');

  const matches: Array<{
    submission: Submission;
    merchant: Merchant | null;
    matchType: 'exact' | 'fuzzy' | 'location' | 'none';
  }> = [];

  for (const submission of submissions) {
    console.log(`\n📍 Checking: ${submission.business_name}`);
    
    // Check exact name match
    let merchant = merchants.find(m => 
      m.business_name.toLowerCase().trim() === submission.business_name.toLowerCase().trim()
    );

    if (merchant) {
      matches.push({ submission, merchant, matchType: 'exact' });
      console.log(`   ✓ Exact match found: ${merchant.business_name}`);
      continue;
    }

    // Check fuzzy name match (remove special chars, spaces)
    const normalizedSubmission = submission.business_name.toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    
    merchant = merchants.find(m => {
      const normalizedMerchant = m.business_name.toLowerCase()
        .replace(/[^a-z0-9]/g, '');
      return normalizedMerchant === normalizedSubmission;
    });

    if (merchant) {
      matches.push({ submission, merchant, matchType: 'fuzzy' });
      console.log(`   ✓ Fuzzy match found: ${merchant.business_name}`);
      continue;
    }

    // Check location proximity (within 50 meters)
    if (submission.latitude && submission.longitude) {
      const subLat = parseFloat(submission.latitude);
      const subLng = parseFloat(submission.longitude);

      for (const m of merchants) {
        if (m.latitude && m.longitude) {
          const mLat = parseFloat(m.latitude);
          const mLng = parseFloat(m.longitude);
          
          const distance = calculateDistance(subLat, subLng, mLat, mLng);
          
          if (distance < 50) {
            matches.push({ submission, merchant: m, matchType: 'location' });
            console.log(`   ✓ Location match found: ${m.business_name} (${distance.toFixed(0)}m away)`);
            merchant = m;
            break;
          }
        }
      }
    }

    if (!merchant) {
      matches.push({ submission, merchant: null, matchType: 'none' });
      console.log(`   ✗ No match found - NEW MERCHANT`);
    }
  }

  // 4. Generate report
  console.log('\n\n📊 MATCH REPORT:');
  console.log('═══════════════════════════════════════════════════\n');

  const exactMatches = matches.filter(m => m.matchType === 'exact');
  const fuzzyMatches = matches.filter(m => m.matchType === 'fuzzy');
  const locationMatches = matches.filter(m => m.matchType === 'location');
  const newMerchants = matches.filter(m => m.matchType === 'none');

  console.log(`Exact Name Matches: ${exactMatches.length}`);
  console.log(`Fuzzy Name Matches: ${fuzzyMatches.length}`);
  console.log(`Location Matches: ${locationMatches.length}`);
  console.log(`New Merchants: ${newMerchants.length}`);
  console.log(`\nTotal Submissions: ${submissions.length}\n`);

  // Save detailed report
  const reportFile = path.join(backupDir, `match_report_${timestamp}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(matches, null, 2));
  console.log(`📄 Detailed report saved to: ${reportFile}\n`);

  // 5. Show differences for matches
  if (exactMatches.length > 0 || fuzzyMatches.length > 0 || locationMatches.length > 0) {
    console.log('\n🔄 DIFFERENCES FOUND:\n');
    
    for (const match of [...exactMatches, ...fuzzyMatches, ...locationMatches]) {
      if (!match.merchant) continue;
      
      const differences: string[] = [];
      
      if (match.submission.business_name !== match.merchant.business_name) {
        differences.push(`Name: "${match.merchant.business_name}" → "${match.submission.business_name}"`);
      }
      
      if (match.submission.category !== match.merchant.category) {
        differences.push(`Category: "${match.merchant.category}" → "${match.submission.category}"`);
      }
      
      if (match.submission.phone !== match.merchant.phone) {
        differences.push(`Phone: "${match.merchant.phone}" → "${match.submission.phone}"`);
      }
      
      if (match.submission.blink_address !== match.merchant.blink_address) {
        differences.push(`Blink: "${match.merchant.blink_address || 'none'}" → "${match.submission.blink_address || 'none'}"`);
      }

      if (match.submission.latitude && match.submission.longitude) {
        const oldDist = match.merchant.latitude && match.merchant.longitude 
          ? calculateDistance(
              parseFloat(match.merchant.latitude),
              parseFloat(match.merchant.longitude),
              parseFloat(match.submission.latitude),
              parseFloat(match.submission.longitude)
            )
          : null;
        
        if (oldDist && oldDist > 5) {
          differences.push(`Location: Moved ${oldDist.toFixed(0)}m`);
        }
      }

      if (differences.length > 0) {
        console.log(`\n${match.merchant.business_name} (${match.matchType} match):`);
        differences.forEach(diff => console.log(`  • ${diff}`));
      }
    }
  }

  console.log('\n\n✅ Backup and analysis complete!');
  console.log('\nNext steps:');
  console.log('1. Review the match report');
  console.log('2. Run update script to apply changes');
  console.log('3. Run cleanup script to remove old submissions\n');
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

main().catch(console.error);
