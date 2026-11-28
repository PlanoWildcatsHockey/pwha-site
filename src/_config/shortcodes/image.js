import Image from '@11ty/eleventy-img';
import path from 'node:path';
import fs from 'node:fs/promises';

// Resized images are written to .cache (kept between Cloudflare builds by
// Workers build caching), so unchanged photos aren't re-encoded on every
// build. eleventy-img skips any output file that already exists; the
// content hash in the filename keeps a replaced photo from reusing a stale
// copy. Files used by this build are copied into dist after the build.
export const IMAGE_CACHE_DIR = './.cache/@11ty/img/';
const IMAGE_OUTPUT_DIR = './dist/assets/images/';
const usedImageFiles = new Set();

export const copyCachedImages = async () => {
  await fs.mkdir(IMAGE_OUTPUT_DIR, {recursive: true});
  await Promise.all(
    [...usedImageFiles].map(file =>
      fs.copyFile(path.join(IMAGE_CACHE_DIR, file), path.join(IMAGE_OUTPUT_DIR, file))
    )
  );
};

const stringifyAttributes = attributeMap => {
  return Object.entries(attributeMap)
    .map(([attribute, value]) => {
      if (typeof value === 'undefined') return '';
      return `${attribute}="${value}"`;
    })
    .join(' ');
};

const errorSrcRequired = shortcodeName => {
  throw new Error(`src parameter is required for {% ${shortcodeName} %} shortcode`);
};

// Handles image processing
const processImage = async options => {
  let {
    src,
    alt = '',
    caption = '',
    loading = 'lazy',
    containerClass,
    imageClass,
    widths = [650, 960, 1400],
    sizes,
    formats = ['avif', 'webp', 'jpeg']
  } = options;

  // Set sizes based on loading (if not provided)
  if (sizes == null) {
    sizes = loading === 'lazy' ? 'auto' : '100vw';
  }

  // Prepend "./src" if not present
  if (!src.startsWith('./src')) {
    src = `./src${src}`;
  }

  const metadata = await Image(src, {
    widths: [...widths],
    formats: [...formats],
    urlPath: '/assets/images/',
    outputDir: IMAGE_CACHE_DIR,
    filenameFormat: (id, src, width, format, options) => {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${id}-${width}w.${format}`;
    }
  });

  Object.values(metadata)
    .flat()
    .forEach(entry => usedImageFiles.add(entry.filename));

  // PNG fallback for callers that need transparency (e.g. logos) and pass
  // formats without jpeg.
  const fallback = metadata.jpeg || metadata.png;
  const lowsrc = fallback[fallback.length - 1];

  const imageSources = Object.values(metadata)
    .map(imageFormat => {
      return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat
        .map(entry => entry.srcset)
        .join(', ')}" sizes="${sizes}">`;
    })
    .join('\n');

  const imageAttributes = stringifyAttributes({
    'src': lowsrc.url,
    'width': lowsrc.width,
    'height': lowsrc.height,
    alt,
    loading,
    'decoding': loading === 'eager' ? 'sync' : 'async',
    ...(imageClass && {class: imageClass}),
    'eleventy:ignore': ''
  });

  const pictureElement = `<picture> ${imageSources}<img ${imageAttributes}></picture>`;

  return caption
    ? `<figure slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${pictureElement}<figcaption>${caption}</figcaption></figure>`
    : `<picture slot="image"${containerClass ? ` class="${containerClass}"` : ''}>${imageSources}<img ${imageAttributes}></picture>`;
};

// Positional parameters (legacy)
export const imageShortcode = async (
  src,
  alt,
  caption,
  loading,
  containerClass,
  imageClass,
  widths,
  sizes,
  formats
) => {
  if (!src) {
    errorSrcRequired('image');
  }
  return processImage({
    src,
    alt,
    caption,
    loading,
    containerClass,
    imageClass,
    widths,
    sizes,
    formats
  });
};

// Named parameters
export const imageKeysShortcode = async (options = {}) => {
  if (!options.src) {
    errorSrcRequired('imageKeys');
  }
  return processImage(options);
};
