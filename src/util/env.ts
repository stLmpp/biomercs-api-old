import { get } from 'config';
import { networkInterfaces } from 'os';
import { isArray } from 'is-what';

export const LOCALE_ID = 'pt-BR';

function _getEnvVar(property: string): any {
  try {
    return get(property);
  } catch (e) {
    return process.env[property];
  }
}

export function getEnvVar(properties: string[]): { key: string; value: any }[];
export function getEnvVar(property: string): any;
export function getEnvVar(propertyOrProperties: string | string[]): any {
  if (isArray(propertyOrProperties)) {
    return propertyOrProperties.map(key => ({ key, value: _getEnvVar(key) }));
  } else {
    return _getEnvVar(propertyOrProperties);
  }
}

export const isProd = getEnvVar('NODE_ENV') === 'production';

export function getHost(): string {
  return isProd
    ? getEnvVar('HOST')
    : (
        networkInterfaces().WiFi ??
        networkInterfaces().Ethernet ??
        networkInterfaces()['Wi-Fi']
      )?.find(o => o.family === 'IPv4').address ?? getEnvVar('HOST');
}

export function getPort(): string {
  return getEnvVar('PORT') ?? getEnvVar('$PORT');
}

export function getUseAuth(): boolean {
  return getEnvVar('CONFIG_USE_AUTH');
}

export function getUseRoles(): boolean {
  return getEnvVar('CONFIG_USE_ROLE');
}

export function getUseHandleError(): boolean {
  return getEnvVar('CONFIG_USE_HANDLE_ERROR');
}

export function getImagesAllowed(): string[] {
  return getEnvVar('CONFIG_FILE_IMAGE_EXTENSIONS_ALLOWED');
}
