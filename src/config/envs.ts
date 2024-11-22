import 'dotenv/config';
import { get } from 'env-var';


export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  POSTGRES_URL: get('POSTGRES_URL').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),
}



