const path = require('path');
const { createStrapi } = require('@strapi/strapi');

async function seedOrders() {
  console.log('--- Seeding Initial Relation Orders ---');
  const strapi = await createStrapi({ distDir: path.resolve(__dirname, '../dist') }).load();

  const allDocs = await strapi.documents('api::document.document').findMany();
  const docBySlug = {};
  allDocs.forEach(d => { docBySlug[d.slug] = d.documentId; });

  // 1. Software Development
  const softwareSlugs = [
    'clipflow',
    'betterfountain',
    'aufilmmaking',
    'metacoloreditor',
    'bmdslate'
  ];
  const softwareCat = await strapi.documents('api::category.category').findFirst({
    filters: { slug: 'software' }
  });
  if (softwareCat) {
    const docIds = softwareSlugs.map(s => docBySlug[s]).filter(Boolean);
    await strapi.documents('api::category.category').update({
      documentId: softwareCat.documentId,
      data: { documents: docIds }
    });
    console.log('✓ Seeded Software Development order (5 docs)');
  }

  // 2. Commercial
  const commercialSlugs = [
    'parent-club',
    'road-is-calling',
    'tunnocks-timeless-tastiness',
    'irn-bru-funkin-cocktail',
    'quality-meat-scotland',
    'historic-scotland-a-little-history',
    'johnnie-walker-princes-street',
    'centremk-fashion',
    'randolph-hill',
    'espc'
  ];
  const commercialCat = await strapi.documents('api::category.category').findFirst({
    filters: { slug: 'commercial' }
  });
  if (commercialCat) {
    const docIds = commercialSlugs.map(s => docBySlug[s]).filter(Boolean);
    await strapi.documents('api::category.category').update({
      documentId: commercialCat.documentId,
      data: { documents: docIds }
    });
    console.log('✓ Seeded Commercial order (10 docs)');
  }

  // 3. Short Narrative
  const shortsSlugs = [
    'shutterbug',
    'close',
    'last-train-home',
    'viking-dead',
    'bare',
    'remains',
    'chaos-rising'
  ];
  const shortsCat = await strapi.documents('api::category.category').findFirst({
    filters: { slug: 'shorts' }
  });
  if (shortsCat) {
    const docIds = shortsSlugs.map(s => docBySlug[s]).filter(Boolean);
    await strapi.documents('api::category.category').update({
      documentId: shortsCat.documentId,
      data: { documents: docIds }
    });
    console.log('✓ Seeded Short Narrative order (7 docs)');
  }

  // 4. Home Featured
  const featuredSlugs = [
    'road-is-calling',
    'tunnocks-timeless-tastiness',
    'irn-bru-funkin-cocktail',
    'quality-meat-scotland',
    'johnnie-walker-princes-street',
    'shutterbug',
    'last-train-home',
    'viking-dead'
  ];
  const home = await strapi.documents('api::home.home').findFirst();
  if (home) {
    const docIds = featuredSlugs.map(s => docBySlug[s]).filter(Boolean);
    await strapi.documents('api::home.home').update({
      documentId: home.documentId,
      data: { featured: docIds }
    });
    console.log('✓ Seeded Home Featured order (8 docs)');
  }

  // 5. Update Content Manager edit layouts so documents and featured are full-width
  const ctService = strapi.plugin('content-manager').service('content-types');

  // Update Category layout
  const catConfig = await ctService.findConfiguration(strapi.contentTypes['api::category.category']);
  catConfig.layouts.edit = [
    [
      { name: 'name', size: 6 },
      { name: 'slug', size: 6 }
    ],
    [
      { name: 'title', size: 6 },
      { name: 'order', size: 6 }
    ],
    [
      { name: 'description', size: 12 }
    ],
    [
      { name: 'thumbnailimage', size: 6 },
      { name: 'thumbnailvideo', size: 6 }
    ],
    [
      { name: 'documents', size: 12 }
    ]
  ];
  await ctService.updateConfiguration(strapi.contentTypes['api::category.category'], catConfig);
  console.log('✓ Updated Category Content Manager layout (documents full-width)');

  // Update Home layout
  const homeConfig = await ctService.findConfiguration(strapi.contentTypes['api::home.home']);
  homeConfig.layouts.edit = [
    [
      { name: 'subtitle', size: 8 },
      { name: 'underconstruction', size: 4 }
    ],
    [
      { name: 'description', size: 12 }
    ],
    [
      { name: 'featured', size: 12 }
    ],
    [
      { name: 'images', size: 12 }
    ],
    [
      { name: 'metadescription', size: 6 },
      { name: 'metaimage', size: 6 }
    ]
  ];
  await ctService.updateConfiguration(strapi.contentTypes['api::home.home'], homeConfig);
  console.log('✓ Updated Home Content Manager layout (featured full-width)');

  await strapi.destroy();
  console.log('--- Done Seeding Initial Orders ---');
}

seedOrders().catch(e => {
  console.error('Error seeding orders:', e);
  process.exit(1);
});

