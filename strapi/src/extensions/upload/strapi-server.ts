import fs from 'fs';
import path from 'path';
import sharp, { type Metadata, type ResizeOptions } from 'sharp';
import { file as fileUtils } from '@strapi/utils';

const { bytesToKbytes } = fileUtils;

const FORMATS_TO_OPTIMIZE = ['jpeg', 'png', 'webp', 'tiff', 'avif'];
const isOptimizableFormat = (format?: string): boolean =>
  format !== undefined && FORMATS_TO_OPTIMIZE.includes(format);

const getWebpOptions = (breakpoint?: string) => {
  if (breakpoint === 'large' || !breakpoint) {
    // High quality for large and full-size images: preserve film grain, eliminate color banding
    return { quality: 94, smartSubsample: true, effort: 6, preset: 'photo' as const };
  }
  if (breakpoint === 'medium') {
    return { quality: 91, smartSubsample: true, effort: 6, preset: 'photo' as const };
  }
  return { quality: 88, smartSubsample: true, effort: 5, preset: 'photo' as const };
};

const writeStreamToFile = (stream: NodeJS.ReadableStream, destPath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(destPath);
    stream.on('error', reject);
    // @ts-ignore
    stream.pipe(writeStream);
    writeStream.on('close', () => resolve());
    writeStream.on('error', reject);
  });

const getMetadata = (file: any): Promise<Metadata> => {
  if (!file.filepath) {
    return new Promise((resolve, reject) => {
      const pipeline = sharp();
      pipeline.metadata().then(resolve).catch(reject);
      file.getStream().pipe(pipeline);
    });
  }
  return sharp(file.filepath).metadata();
};

const getDimensions = async (file: any) => {
  const { width = null, height = null } = await getMetadata(file);
  return { width, height };
};

const THUMBNAIL_RESIZE_OPTIONS: ResizeOptions = {
  width: 245,
  height: 156,
  fit: 'inside',
};

const DEFAULT_BREAKPOINTS: Record<string, number> = {
  large: 1500,
  medium: 750,
  small: 500,
};

export default (plugin: any) => {
  const imageManipulationService = plugin.services['image-manipulation'];

  const resizeFileToWebp = async (
    file: any,
    options: ResizeOptions,
    { name, hash }: { name: string; hash: string },
    breakpointKey?: string
  ) => {
    const webpHash = `${hash}`;
    const filePath = file.tmpWorkingDirectory
      ? path.join(file.tmpWorkingDirectory, webpHash)
      : webpHash;
    const webpConfig = getWebpOptions(breakpointKey);

    let newInfo;
    if (!file.filepath) {
      const transform = sharp({ animated: true })
        .resize(options)
        .webp(webpConfig)
        .on('info', (info) => {
          newInfo = info;
        });

      await writeStreamToFile(file.getStream().pipe(transform), filePath);
    } else {
      newInfo = await sharp(file.filepath, { animated: true })
        .resize(options)
        .webp(webpConfig)
        .toFile(filePath);
    }

    const { width, height, size, pageHeight } = newInfo ?? {};

    const newFile: any = {
      name: name.replace(/\.[^/.]+$/, '') + '.webp',
      hash: webpHash,
      ext: '.webp',
      mime: 'image/webp',
      filepath: filePath,
      path: file.path || null,
      getStream: () => fs.createReadStream(filePath),
    };

    Object.assign(newFile, {
      width,
      height: pageHeight ?? height,
      size: size ? bytesToKbytes(size) : 0,
      sizeInBytes: size,
    });

    return newFile;
  };

  const generateThumbnail = async (file: any) => {
    if (
      file.width &&
      file.height &&
      (file.width > (THUMBNAIL_RESIZE_OPTIONS.width ?? 245) ||
        file.height > (THUMBNAIL_RESIZE_OPTIONS.height ?? 156))
    ) {
      return resizeFileToWebp(
        file,
        THUMBNAIL_RESIZE_OPTIONS,
        {
          name: `thumbnail_${file.name}`,
          hash: `thumbnail_${file.hash}`,
        },
        'thumbnail'
      );
    }
    return null;
  };

  const optimizeToWebp = async (file: any) => {
    const { format } = await getMetadata(file);

    if (!isOptimizableFormat(format)) {
      return file;
    }

    let transformer;
    if (!file.filepath) {
      transformer = sharp({ animated: true });
    } else {
      transformer = sharp(file.filepath, { animated: true });
    }

    const webpConfig = getWebpOptions(); // Full-size quality
    transformer.webp(webpConfig);
    transformer.rotate();

    const filePath = file.tmpWorkingDirectory
      ? path.join(file.tmpWorkingDirectory, `optimized-${file.hash}`)
      : `optimized-${file.hash}`;

    let newInfo;
    if (!file.filepath) {
      transformer.on('info', (info) => {
        newInfo = info;
      });
      await writeStreamToFile(file.getStream().pipe(transformer), filePath);
    } else {
      newInfo = await transformer.toFile(filePath);
    }

    const { width: newWidth, height: newHeight, size: newSize, pageHeight: newPageHeight } =
      newInfo ?? {};

    const newFile = { ...file };
    newFile.getStream = () => fs.createReadStream(filePath);
    newFile.filepath = filePath;
    newFile.ext = '.webp';
    newFile.mime = 'image/webp';
    newFile.name = file.name.replace(/\.[^/.]+$/, '') + '.webp';

    return Object.assign(newFile, {
      width: newWidth,
      height: newPageHeight ?? newHeight,
      size: newSize ? bytesToKbytes(newSize) : 0,
      sizeInBytes: newSize,
    });
  };

  const generateResponsiveFormats = async (file: any) => {
    const { responsiveDimensions = true } =
      (await strapi.plugin('upload').service('upload').getSettings()) ?? {};

    if (!responsiveDimensions) return [];

    const originalDimensions = await getDimensions(file);
    const breakpoints =
      strapi.config.get<Record<string, number>>('plugin::upload.breakpoints', DEFAULT_BREAKPOINTS) ||
      DEFAULT_BREAKPOINTS;

    const results = [];

    for (const key of Object.keys(breakpoints)) {
      const breakpoint = breakpoints[key];
      const width = originalDimensions.width ?? 0;
      const height = originalDimensions.height ?? 0;

      if (breakpoint < width || breakpoint < height) {
        const newFile = await resizeFileToWebp(
          file,
          {
            width: breakpoint,
            height: breakpoint,
            fit: 'inside',
          },
          {
            name: `${key}_${file.name}`,
            hash: `${key}_${file.hash}`,
          },
          key
        );
        results.push({
          key,
          file: newFile,
        });
      }
    }

    return results;
  };

  // Override manipulation methods with WebP handlers
  plugin.services['image-manipulation'] = {
    ...imageManipulationService,
    optimize: optimizeToWebp,
    generateThumbnail,
    generateResponsiveFormats,
  };

  return plugin;
};
