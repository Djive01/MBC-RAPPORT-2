const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. App Icon SVG (with dark luxury slate background)
const appIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Container Box -->
  <rect width="512" height="512" rx="110" fill="url(#bg)" />
  <rect width="504" height="504" x="4" y="4" rx="106" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="3" />

  <!-- CMYK Circle Emblem & Typography -->
  <g transform="translate(48, 128) scale(1.12)" filter="url(#glow)">
    <!-- Black Slice -->
    <path d="M 50,30 A 85,85 0 0,0 20,115 A 85,85 0 0,0 50,200 L 55,200 L 55,30 Z" fill="#18181b"/>
    <!-- Yellow Slice -->
    <path d="M 60,25 L 90,15 L 90,215 L 60,205 Z" fill="#facc15"/>
    <!-- Magenta Slice -->
    <path d="M 96,10 C 145,10 175,48 175,115 C 175,182 145,220 96,220 Z" fill="#ec4899"/>
    <!-- Cyan Slice -->
    <path d="M 182,32 A 85,85 0 0,1 210,115 A 85,85 0 0,1 182,198 Z" fill="#0284c7"/>
    
    <!-- mbc text -->
    <text x="215" y="140" font-family="sans-serif" font-weight="900" font-style="italic" font-size="115" fill="none" stroke="#ffffff" stroke-width="7" letter-spacing="-2">mbc</text>
    <!-- PRINT text -->
    <text x="220" y="190" font-family="sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="14">PRINT</text>
  </g>
</svg>
`;

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'mbc-logo-icon.svg'), appIconSvg);

const resvg = new Resvg(appIconSvg, {
  fitTo: { mode: 'width', value: 512 }
});

const pngBuffer = resvg.render().asPng();
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'icon.png'), pngBuffer);
fs.writeFileSync(path.join(publicDir, 'logo.png'), pngBuffer);

console.log('PNG files written successfully.');

// Convert to ICO & ICNS using ImageMagick
try {
  const pngPath = path.join(publicDir, 'icon.png');
  const icoPath = path.join(publicDir, 'icon.ico');
  const icnsPath = path.join(publicDir, 'icon.icns');

  execSync(`convert "${pngPath}" -define icon:auto-resize=256,128,64,48,32,16 "${icoPath}"`);
  console.log('ICO created at:', icoPath);

  execSync(`convert "${pngPath}" "${icnsPath}"`);
  console.log('ICNS created at:', icnsPath);
} catch (e) {
  console.error('Error generating ICO/ICNS:', e.message);
}
