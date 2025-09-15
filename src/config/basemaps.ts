export interface BasemapConfig {
  id: string;
  label: string;
  thumbnail: string;
}

export const BASEMAPS: BasemapConfig[] = [
  {
    id: 'dark-gray-vector',
    label: 'Dark Gray',
    thumbnail:
      'https://www.arcgis.com/sharing/rest/content/items/908967a20fee4d1db3ff5149ec6efcc5/info/thumbnail/thumbnail1739589775091.png?f=json',
  },
  {
    id: 'streets-vector',
    label: 'Streets',
    thumbnail:
      'https://www.arcgis.com/sharing/rest/content/items/22fb75c0fa5a4c88b8ca4c4b8ae5c90b/info/thumbnail/thumbnail1739461862774.png?f=json',
  },
  {
    id: 'satellite',
    label: 'Satellite',
    thumbnail:
      'https://www.arcgis.com/sharing/rest/content/items/0d17ba68a8f64c278e7e2e7864e1069d/info/thumbnail/thumbnail1739466348621.png?f=json',
  },
  {
    id: 'topo-vector',
    label: 'Topographic',
    thumbnail:
      'https://www.arcgis.com/sharing/rest/content/items/668f436dc2dc4f2c83ceb0c064380590/info/thumbnail/thumbnail1739488895125.png?f=json',
  },
];

export const DEFAULT_BASEMAP = BASEMAPS[0];
