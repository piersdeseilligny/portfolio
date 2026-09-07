const Database = require('better-sqlite3');
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function migrate() {
  console.log('====================================================');
  console.log('🚀 Starting Strapi v3 -> v5 Direct Data Migration');
  console.log('====================================================\n');

  const v3DbPath = path.resolve(__dirname, '../../strapi-v3-backup/.tmp/data.db');
  console.log('📖 Opening v3 database:', v3DbPath);
  const v3Db = new Database(v3DbPath, { readonly: true });

  console.log('⚙️  Loading Strapi v5 instance...');
  const strapi = await createStrapi({ distDir: path.resolve(__dirname, '../dist') }).load();
  console.log('✅ Strapi v5 loaded successfully!\n');

  // Helper to read v3 tables
  function readV3(table) {
    try {
      return v3Db.prepare(`SELECT * FROM "${table}"`).all();
    } catch (e) {
      console.warn(`  ⚠ Table "${table}" not found in v3 db`);
      return [];
    }
  }

  const v3Morphs = readV3('upload_file_morph');
  function getMorphFiles(relatedType, relatedId, field) {
    return v3Morphs
      .filter(m => m.related_type === relatedType && m.related_id === relatedId && m.field === field)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(m => m.upload_file_id);
  }

  function getMorphFile(relatedType, relatedId, field) {
    const files = getMorphFiles(relatedType, relatedId, field);
    return files.length > 0 ? files[0] : null;
  }

  // --- Step 1: Clean existing data in Strapi 5 database ---
  console.log('🧹 Clearing previous entries in Strapi 5 tables...');
  await strapi.db.query('api::document.document').deleteMany({});
  await strapi.db.query('api::category.category').deleteMany({});
  await strapi.db.query('api::tag.tag').deleteMany({});
  await strapi.db.query('api::outlink.outlink').deleteMany({});
  await strapi.db.query('api::home.home').deleteMany({});
  await strapi.db.query('api::contact-image.contact-image').deleteMany({});
  await strapi.db.query('plugin::upload.file').deleteMany({});
  console.log('✅ Cleaned!\n');

  // --- Step 2: Migrate Upload Files (158 rows) ---
  console.log('📁 Migrating upload_file records...');
  const v3Files = readV3('upload_file');
  let fileCount = 0;
  for (const f of v3Files) {
    await strapi.db.query('plugin::upload.file').create({
      data: {
        id: f.id,
        name: f.name,
        alternativeText: f.alternativeText || null,
        caption: f.caption || null,
        width: f.width || null,
        height: f.height || null,
        formats: f.formats ? JSON.parse(f.formats) : null,
        hash: f.hash,
        ext: f.ext,
        mime: f.mime,
        size: f.size,
        url: f.url,
        previewUrl: f.previewUrl || null,
        provider: f.provider || 'local',
        provider_metadata: f.provider_metadata || null,
        createdAt: f.created_at ? new Date(f.created_at) : new Date(),
        updatedAt: f.updated_at ? new Date(f.updated_at) : new Date(),
        publishedAt: new Date()
      }
    });
    fileCount++;
  }
  console.log(`✅ Migrated ${fileCount} files (preserved exact IDs)\n`);

  // --- Step 3: Migrate Tags (14 rows) ---
  console.log('🏷️  Migrating tags...');
  const v3Tags = readV3('tags');
  const tagDocIdMap = {};
  for (const t of v3Tags) {
    const doc = await strapi.documents('api::tag.tag').create({
      data: {
        name: t.name,
        icon: t.icon || null,
        title: t.title || null,
        order: t.order != null ? t.order : null
      },
      status: 'published'
    });
    tagDocIdMap[t.id] = doc.documentId;
    console.log(`  ✓ Tag "${t.name}" -> ${doc.documentId}`);
  }
  console.log(`✅ Migrated ${Object.keys(tagDocIdMap).length} tags\n`);

  // --- Step 4: Migrate Outlinks (8 rows) ---
  console.log('🔗 Migrating outlinks...');
  const v3Outlinks = readV3('outlinks');
  const outlinkDocIdMap = {};
  for (const o of v3Outlinks) {
    const iconId = getMorphFile('outlinks', o.id, 'icon');
    const doc = await strapi.documents('api::outlink.outlink').create({
      data: {
        name: o.name,
        tooltip: o.tooltip || null,
        svg: o.svg || null,
        icon: iconId || null
      },
      status: 'published'
    });
    outlinkDocIdMap[o.id] = doc.documentId;
    console.log(`  ✓ Outlink "${o.name}" (icon:${iconId}) -> ${doc.documentId}`);
  }
  console.log(`✅ Migrated ${Object.keys(outlinkDocIdMap).length} outlinks\n`);

  // --- Step 5: Migrate Categories (5 rows) ---
  console.log('📂 Migrating categories...');
  const v3Categories = readV3('categories');
  const catDocIdMap = {};
  for (const c of v3Categories) {
    const thumbImgId = getMorphFile('categories', c.id, 'thumbnailimage');
    const thumbVidId = getMorphFile('categories', c.id, 'thumbnailvideo');
    const doc = await strapi.documents('api::category.category').create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.description || null,
        order: c.order != null ? c.order : null,
        title: c.title || null,
        thumbnailimage: thumbImgId || null,
        thumbnailvideo: thumbVidId || null
      },
      status: 'published'
    });
    catDocIdMap[c.id] = doc.documentId;
    console.log(`  ✓ Category "${c.name}" -> ${doc.documentId}`);
  }
  console.log(`✅ Migrated ${Object.keys(catDocIdMap).length} categories\n`);

  // --- Step 6: Migrate Documents (22 rows) ---
  console.log('📄 Migrating documents...');
  const v3Docs = readV3('documents');
  const v3DocCategories = readV3('categories_documents__documents_categories');
  const v3DocTags = readV3('documents_tags__tags_documents');
  const v3DocComponents = readV3('documents_components');
  const v3Contentblocks = readV3('components_component_contentblocks');
  const v3ContentblocksComponents = readV3('components_component_contentblocks_components');
  const v3Beforeafters = readV3('components_component_beforeafters');
  const v3Moreinfos = readV3('components_component_moreinfos');

  const docDocIdMap = {};

  for (const d of v3Docs) {
    // Media
    const posterId = getMorphFile('documents', d.id, 'poster');
    const videoId = getMorphFile('documents', d.id, 'video');
    const imageIds = getMorphFiles('documents', d.id, 'images');
    const laurelIds = getMorphFiles('documents', d.id, 'laurels');

    // Relations
    const relatedCatDocIds = v3DocCategories
      .filter(r => r.document_id === d.id)
      .map(r => catDocIdMap[r.category_id])
      .filter(Boolean);

    const relatedTagDocIds = v3DocTags
      .filter(r => r.document_id === d.id)
      .map(r => tagDocIdMap[r.tag_id])
      .filter(Boolean);

    const singleCatDocId = d.category ? catDocIdMap[d.category] : null;

    // Components: moreinfo
    const docMoreinfoLinks = v3DocComponents
      .filter(l => l.document_id === d.id && l.component_type === 'components_component_moreinfos')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const moreinfo = docMoreinfoLinks.map(l => {
      const mi = v3Moreinfos.find(m => m.id === l.component_id);
      if (!mi) return null;
      return {
        header: mi.header || null,
        subheader: mi.subheader || null,
        link: mi.link || null,
        outlink: mi.outlink ? outlinkDocIdMap[mi.outlink] : null
      };
    }).filter(Boolean);

    // Components: contentblocks
    const docCBLinks = v3DocComponents
      .filter(l => l.document_id === d.id && l.component_type === 'components_component_contentblocks')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const contentblocks = docCBLinks.map(l => {
      const cb = v3Contentblocks.find(c => c.id === l.component_id);
      if (!cb) return null;

      // Stills media
      const stillIds = getMorphFiles('components_component_contentblocks', cb.id, 'stills');

      // Nested beforeafters
      const cbBaLinks = v3ContentblocksComponents
        .filter(nested => nested.components_component_contentblock_id === cb.id && nested.component_type === 'components_component_beforeafters')
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const beforeafters = cbBaLinks.map(baLink => {
        const ba = v3Beforeafters.find(b => b.id === baLink.component_id);
        if (!ba) return null;
        const beforeId = getMorphFile('components_component_beforeafters', ba.id, 'before');
        const afterId = getMorphFile('components_component_beforeafters', ba.id, 'after');
        return {
          caption: ba.caption || null,
          offset: ba.offset != null ? ba.offset : 0.5,
          before: beforeId || null,
          after: afterId || null
        };
      }).filter(Boolean);

      return {
        title: cb.title || null,
        description: cb.description || null,
        videoembed: cb.videoembed || null,
        videoembedaspect: cb.videoembedaspect != null ? cb.videoembedaspect : null,
        squarestills: cb.squarestills === 1,
        tag: cb.tag ? tagDocIdMap[cb.tag] : null,
        stills: stillIds,
        beforeafters: beforeafters
      };
    }).filter(Boolean);

    const docData = {
      title: d.title,
      description: d.description || null,
      date: d.date || null,
      slug: d.slug || null,
      backgroundcolor: d.backgroundcolor || null,
      foregroundcolor: d.foregroundcolor || null,
      foregroundcolor2: d.foregroundcolor2 || null,
      typeoverride: d.typeoverride || null,
      order: d.order != null ? d.order : null,
      nopostershadow: d.nopostershadow === 1,
      shortdescription: d.shortdescription || null,
      nopage: d.nopage === 1,
      np_link: d.np_link || null,
      hero: d.hero === 1,
      poster: posterId || null,
      video: videoId || null,
      images: imageIds,
      laurels: laurelIds,
      category: singleCatDocId || null,
      categories: relatedCatDocIds,
      tags: relatedTagDocIds,
      moreinfo: moreinfo,
      contentblocks: contentblocks
    };

    const createdDoc = await strapi.documents('api::document.document').create({
      data: docData,
      status: 'published'
    });
    docDocIdMap[d.id] = createdDoc.documentId;
    console.log(`  ✓ Document "${d.title}" (${d.slug}) -> ${createdDoc.documentId}`);
  }
  console.log(`✅ Migrated ${Object.keys(docDocIdMap).length} documents\n`);

  // --- Step 7: Migrate Home (1 row) ---
  console.log('🏠 Migrating home single type...');
  const v3Homes = readV3('homes');
  if (v3Homes.length > 0) {
    const h = v3Homes[0];
    const metaImgId = getMorphFile('homes', h.id, 'metaimage');

    // Featured docs
    const v3HomesFeatured = readV3('homes__featured');
    const featuredDocIds = v3HomesFeatured
      .filter(f => f.home_id === h.id)
      .map(f => docDocIdMap[f.document_id])
      .filter(Boolean);

    // Random images component
    const v3HomeComponents = readV3('homes_components');
    const v3RandomImages = readV3('components_component_random_images');

    const riLinks = v3HomeComponents
      .filter(l => l.home_id === h.id && l.component_type === 'components_component_random_images')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const images = riLinks.map(link => {
      const ri = v3RandomImages.find(r => r.id === link.component_id);
      if (!ri) return null;
      const imgId = getMorphFile('components_component_random_images', ri.id, 'image');
      return {
        caption: ri.caption || null,
        document: ri.document ? docDocIdMap[ri.document] : null,
        image: imgId || null
      };
    }).filter(Boolean);

    await strapi.documents('api::home.home').create({
      data: {
        description: h.description || null,
        subtitle: h.subtitle || null,
        underconstruction: h.underconstruction === 1,
        metadescription: h.metadescription || null,
        metaimage: metaImgId || null,
        featured: featuredDocIds,
        images: images
      },
      status: 'published'
    });
    console.log(`✅ Migrated home single type\n`);
  }

  // --- Step 8: Migrate Contact Image (1 row) ---
  console.log('📸 Migrating contact-image single type...');
  const v3ContactImages = readV3('contact_images');
  if (v3ContactImages.length > 0) {
    const ci = v3ContactImages[0];
    const imageIds = getMorphFiles('contact_images', ci.id, 'image');

    await strapi.documents('api::contact-image.contact-image').create({
      data: {
        image: imageIds
      },
      status: 'published'
    });
    console.log(`✅ Migrated contact-image single type\n`);
  }

  // --- Step 9: Configure Public Permissions ---
  console.log('🔒 Configuring Public permissions for users-permissions...');
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' }
  });

  const publicActions = [
    'api::category.category.find',
    'api::category.category.findOne',
    'api::document.document.find',
    'api::document.document.findOne',
    'api::tag.tag.find',
    'api::tag.tag.findOne',
    'api::outlink.outlink.find',
    'api::outlink.outlink.findOne',
    'api::home.home.find',
    'api::contact-image.contact-image.find',
    'plugin::upload.content-api.find',
    'plugin::upload.content-api.findOne'
  ];

  for (const action of publicActions) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id }
    });
    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id }
      });
      console.log(`  ✓ Granted: ${action}`);
    }
  }
  console.log('✅ Public permissions configured!\n');

  v3Db.close();
  await strapi.destroy();

  console.log('====================================================');
  console.log('🎉 Migration Completed Successfully!');
  console.log('====================================================');
}

migrate().catch(err => {
  console.error('💥 Migration error:', err);
  process.exit(1);
});
