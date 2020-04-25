import { config } from 'dotenv';
import { isProd } from './util/env';

if (!isProd) {
  config();
}
