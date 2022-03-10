import { FileTypes } from '../types/common';

export const FILE_EXTENSIONS: Readonly<Record<FileTypes, string>> = {
  [FileTypes.JPG]: 'jpg',
  [FileTypes.PNG]: 'png',
  [FileTypes.PDF]: 'pdf',
};
