const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const sharp = require('sharp');

async function run() {
  const strapiDir = path.resolve(__dirname, '..');
  const dbPath = path.join(strapiDir, '.tmp', 'data.db');
  const uploadsDir = path.join(strapiDir, 'public', 'uploads');
  const backupsDir = path.join(strapiDir, 'backups');

  if (!fs.existsSync(dbPath)) {
    console.error(`Database not found at ${dbPath}`);
    process.exit(1);
  }

  let pristineUploadsDir = null;
  if (fs.existsSync(backupsDir)) {
    const backupEntries = fs.readdirSync(backupsDir).filter((e) => e.startsWith('uploads-')).sort();
    if (backupEntries.length > 0) {
      pristineUploadsDir = path.join(backupsDir, backupEntries[0]);
      console.log(`Using pristine backup source from: ${pristineUploadsDir}`);
    }
  }

  const db = new Database(dbPath);
  const rows = db.prepare(`
    SELECT * FROM files 
    WHERE mime != 'image/svg+xml' 
      AND (mime LIKE 'image/%' OR ext IN ('.jpg', '.jpeg', '.png', '.tiff', '.webp'))
  `).all();

  console.log(`Analyzing ${rows.length} images for 1500px large breakpoint...`);

  const updateStmt = db.prepare(`
    UPDATE files
    SET formats = ?
    WHERE id = ?
  `);

  const webpOpts = { quality: 94, smartSubsample: true, effort: 5, preset: 'photo' };
  let resizedCount = 0;
  let removedCount = 0;

  for (const row of rows) {
    let formats = {};
    if (row.formats) {
      try {
        formats = typeof row.formats === 'string' ? JSON.parse(row.formats) : row.formats;
      } catch (e) {
        formats = {};
      }
    }

    const origWidth = row.width || 0;
    const origHeight = row.height || 0;

    // Determine high-res source file
    let sourcePath = null;
    if (pristineUploadsDir) {
      const candidateFiles = fs.readdirSync(pristineUploadsDir).filter(
        (f) => f.startsWith(row.hash + '.') && !f.startsWith('thumbnail_') && !f.startsWith('small_') && !f.startsWith('medium_') && !f.startsWith('large_')
      );
      if (candidateFiles.length > 0) {
        sourcePath = path.join(pristineUploadsDir, candidateFiles[0]);
      }
    }

    if (!sourcePath || !fs.existsSync(sourcePath)) {
      sourcePath = path.join(uploadsDir, `${row.hash}.webp`);
    }

    if (!fs.existsSync(sourcePath)) {
      console.warn(`[Skip] Source file not found for ${row.name} (id: ${row.id})`);
      continue;
    }

    if (origWidth > 1500 || origHeight > 1500) {
      // Generate 1500px large format
      const largeFilename = `large_${row.hash}.webp`;
      const largePath = path.join(uploadsDir, largeFilename);
      const tempLarge = path.join(uploadsDir, `temp-${largeFilename}`);

      await sharp(sourcePath)
        .resize({ width: 1500, height: 1500, fit: 'inside' })
        .webp(webpOpts)
        .toFile(tempLarge);

      if (fs.existsSync(largePath)) {
        fs.unlinkSync(largePath);
      }
      fs.renameSync(tempLarge, largePath);

      const largeMeta = await sharp(largePath).metadata();
      const largeStat = fs.statSync(largePath);

      const baseName = (row.name || '').replace(/\.[^/.]+$/, '');
      formats.large = {
        name: `large_${baseName}.webp`,
        hash: `large_${row.hash}`,
        ext: '.webp',
        mime: 'image/webp',
        width: largeMeta.width,
        height: largeMeta.height,
        size: parseFloat((largeStat.size / 1024).toFixed(2)),
        path: null,
        url: `/uploads/${largeFilename}`,
      };

      updateStmt.run(JSON.stringify(formats), row.id);
      resizedCount++;
    } else {
      // Original is <= 1500px. If an old 1000px large format exists, remove it.
      if (formats.large) {
        const oldLargePath = path.join(uploadsDir, `large_${row.hash}.webp`);
        if (fs.existsSync(oldLargePath)) {
          try { fs.unlinkSync(oldLargePath); } catch (e) {}
        }
        delete formats.large;
        updateStmt.run(JSON.stringify(formats), row.id);
        removedCount++;
      }
    }

    if ((resizedCount + removedCount) % 15 === 0) {
      console.log(`Processed: ${resizedCount} resized to 1500px, ${removedCount} cleaned up...`);
    }
  }

  console.log(`\nDone! Successfully updated large breakpoint to 1500px:`);
  console.log(`- ${resizedCount} images generated at 1500px.`);
  console.log(`- ${removedCount} images under 1500px cleaned up (will serve full original).`);

  db.close();
}

run().catch((err) => {
  console.error('Error resizing large breakpoint to 1500px:', err);
  process.exit(1);
});

