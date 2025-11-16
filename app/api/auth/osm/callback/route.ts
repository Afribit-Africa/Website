import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth Callback Handler
 * Captures the authorization code from OpenStreetMap and displays it
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Error</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    .error { background: #fee; border: 2px solid #c00; padding: 20px; border-radius: 8px; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="error">
    <h1>❌ Authorization Error</h1>
    <p><strong>Error:</strong> <code>${error}</code></p>
    <p><strong>Description:</strong> ${searchParams.get('error_description') || 'Unknown error'}</p>
  </div>
</body>
</html>
      `,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  if (!code) {
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <title>Missing Code</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    .warning { background: #ffc; border: 2px solid #fa0; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="warning">
    <h1>⚠️ No Authorization Code</h1>
    <p>The OAuth callback was called but no authorization code was provided.</p>
  </div>
</body>
</html>
      `,
      {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  // Display the authorization code
  return new NextResponse(
    `
<!DOCTYPE html>
<html>
<head>
  <title>Authorization Successful</title>
  <style>
    body {
      font-family: system-ui;
      max-width: 900px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .success {
      background: white;
      border: 3px solid #0a0;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: #0a0; margin-top: 0; }
    .code-box {
      background: #f8f8f8;
      border: 2px solid #ddd;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      word-break: break-all;
    }
    .command-box {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      overflow-x: auto;
    }
    .command-box code {
      font-family: 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
    }
    button {
      background: #0070f3;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 10px;
    }
    button:hover { background: #0051cc; }
    .copy-btn { background: #10a37f; }
    .copy-btn:hover { background: #0d8c6a; }
    .step { margin: 30px 0; }
    .step-number {
      display: inline-block;
      background: #0070f3;
      color: white;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      margin-right: 10px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="success">
    <h1>✅ Authorization Successful!</h1>
    <p>OpenStreetMap has granted access. Now exchange this code for an access token.</p>

    <div class="step">
      <h3><span class="step-number">1</span>Copy Your Authorization Code</h3>
      <div class="code-box">
        <strong>Authorization Code:</strong><br>
        <code id="auth-code">${code}</code>
      </div>
      <button class="copy-btn" onclick="copyCode()">📋 Copy Code</button>
    </div>

    <div class="step">
      <h3><span class="step-number">2</span>Run This PowerShell Command</h3>
      <p>Open PowerShell in your project directory and run:</p>
      <div class="command-box">
        <code id="ps-command">$code = "${code}"
$body = @{
    grant_type = "authorization_code"
    code = $code
    client_id = "RsGxFgLS2k0db6FLonFMwYtQGqaHeq2-U5cIJ-BswXE"
    client_secret = "NdxzOeE0E14TotU9GEt_0JIUVdoeemuN13ObFIAW8ig"
    redirect_uri = "https://afribit.africa/api/auth/osm/callback"
}
$response = Invoke-RestMethod -Uri "https://www.openstreetmap.org/oauth2/token" -Method POST -Body $body
Write-Host "\`nAccess Token: " -ForegroundColor Green
Write-Host $response.access_token -ForegroundColor Yellow
Write-Host "\`nAdd this to your .env.local file:" -ForegroundColor Cyan
Write-Host "OSM_ACCESS_TOKEN=\`"$($response.access_token)\`"" -ForegroundColor White</code>
      </div>
      <button class="copy-btn" onclick="copyCommand()">📋 Copy PowerShell Command</button>
    </div>

    <div class="step">
      <h3><span class="step-number">3</span>Save the Access Token</h3>
      <p>Copy the <code>access_token</code> from the PowerShell output and add it to your <code>.env.local</code> file:</p>
      <div class="code-box">
        <code>OSM_ACCESS_TOKEN="your_access_token_here"</code>
      </div>
    </div>

    <div class="step">
      <h3><span class="step-number">4</span>Restart Your Server</h3>
      <p>After saving the token, restart your development server for the changes to take effect.</p>
    </div>
  </div>

  <script>
    function copyCode() {
      const code = document.getElementById('auth-code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('Authorization code copied to clipboard!');
      });
    }

    function copyCommand() {
      const command = document.getElementById('ps-command').textContent;
      navigator.clipboard.writeText(command).then(() => {
        alert('PowerShell command copied to clipboard!');
      });
    }
  </script>
</body>
</html>
    `,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}
