import { access } from 'fs';

export async function fileExists(filePath: string): Promise<boolean> {
  return new Promise(resolve => {
    access(filePath, err => {
      resolve(!err);
    });
  });
}
