export default (context, inject) => {
  const getFullUrl = (url, baseUri) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return (baseUri || '') + url;
  };

  const responsiveAsset = (image, options = {}) => {
    if (!image) {
      return {
        src: '',
        srcset: '',
        width: 0,
        height: 0,
        aspectRatio: 1,
      };
    }

    const baseUri = context.$config ? context.$config.strapiBaseUri : '';
    const fullurl = Boolean(options.fullurl);
    const formats = image.formats || {};

    const rawCandidates = [];

    if (formats.thumbnail && formats.thumbnail.url) {
      rawCandidates.push({
        width: formats.thumbnail.width || 245,
        height: formats.thumbnail.height || 156,
        url: formats.thumbnail.url,
        type: 'thumbnail',
      });
    }

    if (formats.small && formats.small.url) {
      rawCandidates.push({
        width: formats.small.width || 500,
        height: formats.small.height,
        url: formats.small.url,
        type: 'small',
      });
    }

    if (formats.medium && formats.medium.url) {
      rawCandidates.push({
        width: formats.medium.width || 750,
        height: formats.medium.height,
        url: formats.medium.url,
        type: 'medium',
      });
    }

    if (formats.large && formats.large.url) {
      rawCandidates.push({
        width: formats.large.width || 1500,
        height: formats.large.height,
        url: formats.large.url,
        type: 'large',
      });
    }

    if (image.url && (image.width || rawCandidates.length === 0)) {
      rawCandidates.push({
        width: image.width || (rawCandidates[rawCandidates.length - 1]?.width ? rawCandidates[rawCandidates.length - 1].width + 100 : 1200),
        height: image.height,
        url: image.url,
        type: 'original',
      });
    }

    // Deduplicate candidates by width and sort ascending
    const candidates = [];
    const seenWidths = new Set();
    rawCandidates.sort((a, b) => a.width - b.width);

    for (const cand of rawCandidates) {
      if (cand.width && !seenWidths.has(cand.width)) {
        seenWidths.add(cand.width);
        candidates.push(cand);
      }
    }

    // Process all candidate URLs with $staticAsset during generation / SSR
    const srcsetEntries = candidates.map((cand) => {
      const fullUrl = getFullUrl(cand.url, baseUri);
      const assetUrl = context.$staticAsset(fullUrl, fullurl);
      return `${assetUrl} ${cand.width}w`;
    });

    const srcset = srcsetEntries.join(', ');

    // Choose best fallback src (prefer medium, then large, then small, then any)
    const fallbackCand =
      candidates.find((c) => c.type === 'medium') ||
      candidates.find((c) => c.type === 'large') ||
      candidates.find((c) => c.type === 'small') ||
      candidates[0];

    let src = '';
    if (fallbackCand) {
      src = context.$staticAsset(getFullUrl(fallbackCand.url, baseUri), fullurl);
    } else if (image.url) {
      src = context.$staticAsset(getFullUrl(image.url, baseUri), fullurl);
    }

    const width = image.width || fallbackCand?.width || 0;
    const height = image.height || fallbackCand?.height || 0;
    const aspectRatio = width && height ? width / height : 1;

    return {
      src,
      srcset,
      width,
      height,
      aspectRatio,
    };
  };

  inject('responsiveAsset', responsiveAsset);
};

