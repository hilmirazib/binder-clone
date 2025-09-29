const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Icon sizes needed for comprehensive PWA support
const ICON_SIZES = [
  { size: 16, name: "icon-16x16.png", purpose: "favicon" },
  { size: 32, name: "icon-32x32.png", purpose: "favicon" },
  { size: 72, name: "icon-72x72.png", purpose: "android" },
  { size: 96, name: "icon-96x96.png", purpose: "android" },
  { size: 128, name: "icon-128x128.png", purpose: "android" },
  { size: 144, name: "icon-144x144.png", purpose: "android" },
  { size: 152, name: "apple-touch-icon-152x152.png", purpose: "apple" },
  { size: 180, name: "apple-touch-icon-180x180.png", purpose: "apple" },
  { size: 192, name: "icon-192x192.png", purpose: "android" },
  { size: 384, name: "icon-384x384.png", purpose: "android" },
  { size: 512, name: "icon-512x512.png", purpose: "android" },
];

// Simple SVG icon (if you don't have a custom icon)
const DEFAULT_ICON_SVG = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="#2563eb"/>
  <circle cx="256" cy="200" r="60" fill="white"/>
  <rect x="180" y="280" width="152" height="120" rx="12" fill="white"/>
  <rect x="200" y="300" width="112" height="8" rx="4" fill="#2563eb" opacity="0.3"/>
  <rect x="200" y="320" width="80" height="8" rx="4" fill="#2563eb" opacity="0.3"/>
  <rect x="200" y="340" width="96" height="8" rx="4" fill="#2563eb" opacity="0.3"/>
  <rect x="200" y="360" width="64" height="8" rx="4" fill="#2563eb" opacity="0.3"/>
</svg>
`;

async function generateIcons() {
  try {
    console.log("🎨 Generating PWA icons for Binder Web...");

    // Create icons directory if it doesn't exist
    const iconsDir = path.join(process.cwd(), "public", "icons");
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Create base icon from SVG
    const baseIconPath = path.join(iconsDir, "base-icon.svg");
    fs.writeFileSync(baseIconPath, DEFAULT_ICON_SVG);

    // Generate all icon sizes
    for (const iconConfig of ICON_SIZES) {
      const outputPath = path.join(iconsDir, iconConfig.name);

      await sharp(Buffer.from(DEFAULT_ICON_SVG))
        .resize(iconConfig.size, iconConfig.size)
        .png({
          quality: 90,
          compressionLevel: 9,
        })
        .toFile(outputPath);

      console.log(
        `✅ Generated ${iconConfig.name} (${iconConfig.size}x${iconConfig.size})`,
      );
    }

    // Generate favicon.ico (multi-resolution)
    const faviconPath = path.join(process.cwd(), "public", "favicon.ico");
    await sharp(Buffer.from(DEFAULT_ICON_SVG))
      .resize(32, 32)
      .png()
      .toFile(faviconPath);

    console.log("✅ Generated favicon.ico");

    // Generate OG image for social sharing
    const ogImageSvg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f8fafc"/>
      <rect x="50" y="50" width="1100" height="530" rx="24" fill="white" stroke="#e2e8f0" stroke-width="2"/>
      <circle cx="200" cy="200" r="40" fill="#2563eb"/>
      <rect x="260" y="180" width="200" height="16" rx="8" fill="#2563eb"/>
      <rect x="260" y="204" width="150" height="12" rx="6" fill="#64748b"/>
      <rect x="80" y="280" width="400" height="200" rx="16" fill="#f1f5f9" stroke="#e2e8f0"/>
      <text x="600" y="200" font-family="system-ui" font-size="48" font-weight="bold" fill="#1e293b">Binder Web</text>
      <text x="600" y="250" font-family="system-ui" font-size="24" fill="#64748b">Group chat & collaborative notes</text>
      <text x="600" y="300" font-family="system-ui" font-size="18" fill="#64748b">Create groups, chat in real-time,</text>
      <text x="600" y="330" font-family="system-ui" font-size="18" fill="#64748b">and work together on notes.</text>
    </svg>
    `;

    const ogImagePath = path.join(process.cwd(), "public", "og-image.png");
    await sharp(Buffer.from(ogImageSvg))
      .png({
        quality: 90,
      })
      .toFile(ogImagePath);

    console.log("✅ Generated og-image.png for social sharing");

    console.log(`\n🎉 Icon generation complete!`);
    console.log(
      `📁 Generated ${ICON_SIZES.length + 2} icons in /public/icons/`,
    );
    console.log(`📱 PWA installation ready!`);
  } catch (error) {
    console.error("❌ Error generating icons:", error);
    console.log(
      "\n💡 Alternative: Use online icon generators or create manually",
    );
  }
}

// Run if called directly
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons };
