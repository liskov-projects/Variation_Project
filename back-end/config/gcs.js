import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: './config/service-account.json',
});

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

export { bucket };
