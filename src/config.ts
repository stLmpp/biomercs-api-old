import { config } from 'dotenv';
import { environment } from './shared/env/env';

if (!environment.production) {
  config();
}
