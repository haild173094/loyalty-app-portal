// There might be some feature in the future
export const getCdnImage = (image: any) => image;

// Support by Shopify
const sizes = {
  pico: '16x16',
  icon: '32x32',
  thumb: '50x50',
  small: '100x100',
  compact: '160x160',
  medium: '240x240',
  large: '480x480',
  grande: '600x600',
  original: '1024x1024',
  master: '',
};

export const shopifyImageFilter = (imageUrl: string, imageSize: keyof typeof sizes) => {
  const size = imageSize !== undefined ? imageSize : 'master';

  if (imageUrl) {
    const urls = imageUrl.split('.');
    const ext = urls.pop();

    return `${urls.join('.')}_${sizes[size]}.${ext}`;
  }

  return '';
};
