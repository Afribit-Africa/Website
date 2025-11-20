import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { executeQuery } from '@/lib/db';
import { logger } from '@/lib/logger';
import { MERCHANTS } from '@/lib/merchants-data';
import { randomUUID } from 'crypto';

// GET handler - Shows import status and provides UI to trigger import
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head><title>Unauthorized</title></head>
          <body style="font-family: system-ui; padding: 2rem; max-width: 600px; margin: 0 auto;">
            <h1>🔒 Unauthorized</h1>
            <p>Please <a href="/admin/login">log in</a> to access the merchant import tool.</p>
          </body>
        </html>`,
        { status: 401, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Check current merchant count in database
    const [stats] = await executeQuery<any[]>(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "published" THEN 1 ELSE 0 END) as published FROM merchant_submissions'
    );

    // Check how many legacy merchants are already imported
    const existing = await executeQuery<any[]>(
      `SELECT business_name FROM merchant_submissions WHERE business_name IN (${MERCHANTS.map(() => '?').join(',')})`,
      MERCHANTS.map(m => m.businessName)
    );

    const existingNames = existing.map((r: any) => r.business_name);
    const toImport = MERCHANTS.filter(m => !existingNames.includes(m.businessName));

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Merchant Import Tool</title>
          <style>
            body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; background: #0a0a0a; color: #e0e0e0; }
            h1 { color: #f7931a; }
            .stats { background: #1a1a1a; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #333; }
            .stat { display: flex; justify-content: space-between; padding: 0.5rem 0; }
            .stat-value { font-weight: bold; color: #f7931a; }
            button { background: #f7931a; color: black; border: none; padding: 1rem 2rem; font-size: 1rem; border-radius: 8px; cursor: pointer; font-weight: bold; }
            button:hover { background: #ff9f2a; }
            button:disabled { background: #666; cursor: not-allowed; }
            #result { margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none; }
            .success { background: #1a3a1a; border: 1px solid #2a5a2a; color: #7afa7a; }
            .error { background: #3a1a1a; border: 1px solid #5a2a2a; color: #fa7a7a; }
            .warning { background: #3a3a1a; border: 1px solid #5a5a2a; color: #fafa7a; }
          </style>
        </head>
        <body>
          <h1>🏪 Merchant Import Tool</h1>
          <p>Import legacy hardcoded merchants into the database for CRUD operations.</p>
          
          <div class="stats">
            <div class="stat">
              <span>Total merchants in database:</span>
              <span class="stat-value">${stats.total || 0}</span>
            </div>
            <div class="stat">
              <span>Published merchants:</span>
              <span class="stat-value">${stats.published || 0}</span>
            </div>
            <div class="stat">
              <span>Legacy merchants available:</span>
              <span class="stat-value">${MERCHANTS.length}</span>
            </div>
            <div class="stat">
              <span>Already imported:</span>
              <span class="stat-value">${existing.length}</span>
            </div>
            <div class="stat">
              <span>Ready to import:</span>
              <span class="stat-value">${toImport.length}</span>
            </div>
          </div>

          ${toImport.length === 0 ? `
            <div class="stats warning">
              <p><strong>✓ All legacy merchants have been imported!</strong></p>
              <p>No action needed. All ${MERCHANTS.length} merchants are already in the database.</p>
            </div>
          ` : `
            <button id="importBtn" onclick="runImport()">
              Import ${toImport.length} Merchant${toImport.length !== 1 ? 's' : ''}
            </button>
          `}

          <div id="result"></div>

          <script>
            async function runImport() {
              const btn = document.getElementById('importBtn');
              const result = document.getElementById('result');
              
              btn.disabled = true;
              btn.textContent = 'Importing...';
              result.style.display = 'none';

              try {
                const response = await fetch('/api/admin/merchants/import', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                });

                const data = await response.json();

                if (data.success) {
                  result.className = 'success';
                  result.innerHTML = \`
                    <h3>✓ Import Successful!</h3>
                    <p><strong>Inserted:</strong> \${data.stats.inserted} merchants</p>
                    <p><strong>Skipped:</strong> \${data.stats.skipped} (already exist)</p>
                    <p><strong>Total:</strong> \${data.stats.total} merchants processed</p>
                    \${data.stats.errors > 0 ? \`<p><strong>Errors:</strong> \${data.stats.errors}</p>\` : ''}
                    <p style="margin-top: 1rem;"><a href="/maps" style="color: #7afa7a;">View merchants on map →</a></p>
                  \`;
                  result.style.display = 'block';
                  setTimeout(() => location.reload(), 2000);
                } else {
                  throw new Error(data.error || 'Import failed');
                }
              } catch (error) {
                result.className = 'error';
                result.innerHTML = \`
                  <h3>✗ Import Failed</h3>
                  <p>\${error.message}</p>
                \`;
                result.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Retry Import';
              }
            }
          </script>
        </body>
      </html>`,
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    logger.error('Import GET handler error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info(`Admin ${session.user?.email} initiating merchant import...`);

    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const merchant of MERCHANTS) {
      try {
        // Check if merchant already exists
        const existing = await executeQuery<any[]>(
          'SELECT id FROM merchant_submissions WHERE business_name = ?',
          [merchant.businessName]
        );

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        // Generate IDs
        const id = randomUUID();
        const editToken = randomUUID().replace(/-/g, '');

        // Map category to OSM category
        let categoryKey = 'amenity';
        let categoryValue = 'other';

        switch (merchant.category) {
          case 'restaurant':
            categoryKey = 'amenity';
            categoryValue = 'restaurant';
            break;
          case 'transport':
            categoryKey = 'shop';
            categoryValue = 'car';
            break;
          case 'beauty':
            categoryKey = 'shop';
            categoryValue = 'beauty';
            break;
          case 'shop':
            categoryKey = 'shop';
            categoryValue = 'convenience';
            break;
          case 'service':
            categoryKey = 'amenity';
            categoryValue = 'community_centre';
            break;
          case 'tourism':
            categoryKey = 'tourism';
            categoryValue = 'attraction';
            break;
          case 'tech':
            categoryKey = 'shop';
            categoryValue = 'electronics';
            break;
          case 'nonprofit':
            categoryKey = 'amenity';
            categoryValue = 'social_facility';
            break;
          default:
            categoryKey = 'amenity';
            categoryValue = 'other';
        }

        // Insert merchant
        await executeQuery(
          `INSERT INTO merchant_submissions (
            id, business_name, category_key, category_value, description,
            latitude, longitude, address, phone, website,
            payment_onchain, payment_lightning, payment_lightning_contactless,
            lightning_address, contact_name, contact_email, contact_relationship,
            status, edit_token, osm_node_id, btcmap_synced,
            is_early_adopter, submitted_at, verified_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
          [
            id,
            merchant.businessName,
            categoryKey,
            categoryValue,
            merchant.description || `${merchant.businessName} in ${merchant.location}`,
            merchant.latitude || null,
            merchant.longitude || null,
            merchant.location,
            merchant.phoneNumber || null,
            merchant.btcMapUrl || null,
            false, // payment_onchain
            true,  // payment_lightning
            false, // payment_lightning_contactless
            merchant.blinkAddress || merchant.lightningAddress || null,
            merchant.ownerName,
            merchant.email && merchant.email !== 'N/A' && merchant.email !== '–'
              ? merchant.email
              : 'info@afribit.africa',
            'owner',
            'published', // Mark as published - these are legacy verified merchants
            editToken,
            merchant.btcMapNodeId || null,
            merchant.btcMapUrl ? true : false,
            true, // All legacy merchants are early adopters
          ]
        );

        inserted++;
      } catch (error: any) {
        logger.error(`Error importing ${merchant.businessName}:`, error);
        errors.push(`${merchant.businessName}: ${error.message}`);
      }
    }

    // Assign adopter numbers
    const earlyAdopters = await executeQuery<any[]>(
      `SELECT id FROM merchant_submissions
       WHERE is_early_adopter = true AND adopter_number IS NULL
       ORDER BY submitted_at ASC`
    );

    for (let i = 0; i < earlyAdopters.length; i++) {
      await executeQuery(
        'UPDATE merchant_submissions SET adopter_number = ? WHERE id = ?',
        [i + 1, earlyAdopters[i].id]
      );
    }

    logger.info(`Import complete: ${inserted} inserted, ${skipped} skipped`);

    return NextResponse.json({
      success: true,
      message: 'Merchant import completed',
      stats: {
        total: MERCHANTS.length,
        inserted,
        skipped,
        errors: errors.length,
      },
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    logger.error('Merchant import error:', error);
    return NextResponse.json(
      { success: false, error: 'Import failed' },
      { status: 500 }
    );
  }
}
