const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const sharp = require('sharp');

async function run() {
  const strapiDir = path.resolve(__dirname, '..');
  const dbPath = path.join(strapiDir, '.tmp', 'data.db');
  const publicDir = path.join(strapiDir, 'public');
  const uploadsDir = path.join(publicDir, 'uploads');
  const backupsDir = path.join(strapiDir, 'backups');

  if (!fs.existsSync(dbPath)) {
    console.error(`Database not found at ${dbPath}`);
    process.exit(1);
  }

  // Find the earliest/pristine uploads backup
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

  console.log(`Found ${rows.length} image files to re-encode with high visual fidelity.`);

  const getWebpOptions = (formatKey) => {
    if (formatKey === 'large' || !formatKey) {
      // 94 quality with smart chroma subsampling & photo preset preserves fine grain & prevents banding
      return { quality: 94, smartSubsample: true, effort: 6, preset: 'photo' };
    }
    if (formatKey === 'medium') {
      return { quality: 91, smartSubsample: true, effort: 6, preset: 'photo' };
    }
    return { quality: 88, smartSubsample: true, effort: 5, preset: 'photo' };
  };

  const updateStmt = db.prepare(`
    UPDATE files
    SET name = ?, ext = ?, mime = ?, size = ?, url = ?, width = ?, height = ?, formats = ?
    WHERE id = ?
  `);

  let processedCount = 0;

  for (const row of rows) {
    // Determine source file: check pristine backup first for original .jpg/.png
    let sourcePath = null;
    if (pristineUploadsDir) {
      // Look for files starting with row.hash
      const candidateFiles = fs.readdirSync(pristineUploadsDir).filter(
        (f) => f.startsWith(row.hash + '.') && !f.startsWith('thumbnail_') && !f.startsWith('small_') && !f.startsWith('medium_') && !f.startsWith('large_')
      );
      if (candidateFiles.length > 0) {
        sourcePath = path.join(pristineUploadsDir, candidateFiles[0]);
      }
    }

    const targetFilename = row.hash + '.webp';
    const targetPath = path.join(uploadsDir, targetFilename);

    if (!sourcePath || !fs.existsSync(sourcePath)) {
      // Fallback to current targetPath if exists
      sourcePath = targetPath;
    }

    if (!fs.existsSync(sourcePath)) {
      console.warn(`[Skip] Source file missing for ID ${row.id}: ${sourcePath}`);
      continue;
    }

    // Convert / re-encode original image with high quality
    const tempOriginal = path.join(uploadsDir, `temp-${row.hash}.webp`);
    await sharp(sourcePath)
      .webp(getWebpOptions())
      .toFile(tempOriginal);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.renameSync(tempOriginal, targetPath);

    const newOriginalMetadata = await sharp(targetPath).metadata();
    const newOriginalStat = fs.statSync(targetPath);

    // Convert / re-encode responsive formats
    let newFormats = {};
    if (row.formats) {
      try {
        const formats = typeof row.formats === 'string' ? JSON.parse(row.formats) : row.formats;
        for (const [key, fmt] of Object.entries(formats)) {
          if (!fmt) continue;

          // Check if pristine backup had this format
          let fmtSourcePath = null;
          if (pristineUploadsDir) {
            const candidateFmt = fs.readdirSync(pristineUploadsDir).filter(
              (f) => f.startsWith(fmt.hash + '.')
            );
            if (candidateFmt.length > 0) {
              fmtSourcePath = path.join(pristineUploadsDir, candidateFmt[0]);
            }
          }

          const fmtTargetFilename = fmt.hash + '.webp';
          const fmtTargetPath = path.join(uploadsDir, fmtTargetFilename);
          const tempFmt = path.join(uploadsDir, `temp-${fmt.hash}.webp`);

          const webpOpts = getWebpOptions(key);

          if (fmtSourcePath && fs.existsSync(fmtSourcePath)) {
            await sharp(fmtSourcePath)
              .webp(webpOpts)
              .toFile(tempFmt);
          } else {
            // Re-generate directly from targetPath (the high-res original)
            await sharp(targetPath)
              .resize({ width: fmt.width, height: fmt.height, fit: 'inside' })
              .webp(webpOpts)
              .toFile(tempFmt);
          }

          if (fs.existsSync(fmtTargetPath)) {
            fs.unlinkSync(fmtTargetPath);
          }
          fs.renameSync(tempFmt, fmtTargetPath);

          const fmtStat = fs.statSync(fmtTargetPath);

          newFormats[key] = {
            name: (fmt.name || '').replace(/\.[^/.]+$/, '') + '.webp',
            hash: fmt.hash,
            ext: '.webp',
            mime: 'image/webp',
            width: fmt.width,
            height: fmt.height,
            size: parseFloat((fmtStat.size / 1024).toFixed(2)),
            path: null,
            url: `/uploads/${fmtTargetFilename}`,
          };
        }
      } catch (e) {
        console.error(`Error parsing formats for file ID ${row.id}:`, e);
      }
    }

    const newName = (row.name || '').replace(/\.[^/.]+$/, '') + '.webp';
    const newSize = parseFloat((newOriginalStat.size / 1024).toFixed(2));
    const newUrl = `/uploads/${targetFilename}`;
    const newWidth = newOriginalMetadata.width || row.width;
    const newHeight = newOriginalMetadata.height || row.height;

    updateStmt.run(
      newName,
      '.webp',
      'image/webp',
      newSize,
      newUrl,
      newWidth,
      newHeight,
      JSON.stringify(newFormats),
      row.id
    );

    processedCount++;
    if (processedCount % 10 === 0 || processedCount === rows.length) {
      console.log(`Re-encoded ${processedCount}/${rows.length} files...`);
    }
  }

  console.log(`\nRe-encoding complete! All ${processedCount} images now encoded with high grain-preserving fidelity.`);
  db.close();
}

run().catch((err) => {
  console.error('Re-encoding failed:', err);
  process.exit(1);
});
