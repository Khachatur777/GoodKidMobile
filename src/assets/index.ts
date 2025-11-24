export * from './icons';
export * from './images';
export * from './animations';

import * as DesignSystemIcons from './icons';

export const Icons = {...DesignSystemIcons};

export type IIcons = keyof typeof Icons;
