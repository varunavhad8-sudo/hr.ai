const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'hr-ai-resumes';

// Initialize S3Client pointing to Cloudflare R2 Endpoint
let s3Client;

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

if (process.env.BYPASS_AUTH === 'true') {
  console.log('[r2Service] Sandbox mode active. Forcing R2 simulation mode to prevent offline network timeouts.');
  s3Client = null;
} else if (!accountId || !accessKeyId || !secretAccessKey) {
  console.warn('[r2Service] WARNING: Cloudflare R2 Credentials are not fully set in .env. R2 transactions will fall back to simulation mode.');
  s3Client = null;
} else {
  s3Client = new S3Client({
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
}

/**
 * Upload a resume PDF to Cloudflare R2 Storage.
 * @param {Buffer} fileBuffer File data buffer.
 * @param {string} fileName Original filename.
 * @param {string} mimeType Mime-type of the file.
 * @returns {Promise<{key: string, url: string}>} Retuns unique key and access URL.
 */
const uploadResume = async (fileBuffer, fileName, mimeType = 'application/pdf') => {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `resumes/${Date.now()}-${sanitizedFileName}`;

  if (!s3Client) {
    console.log(`[r2Service] Simulation mode: Uploaded ${fileName} to R2 (Key: ${key})`);
    return {
      key,
      url: `/simulated-r2-storage/${key}`
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType
    });

    await s3Client.send(command);
    
    // Fallback/Simulated URL
    const publicUrl = `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;

    return { key, url: publicUrl };
  } catch (err) {
    console.error('[r2Service] Upload to R2 failed:', err.message);
    throw new Error(`Failed to upload resume to R2 storage: ${err.message}`);
  }
};

/**
 * Delete a resume PDF from Cloudflare R2 Storage.
 * @param {string} key Unique object key in R2.
 */
const deleteResume = async (key) => {
  if (!key) return;

  if (!s3Client) {
    console.log(`[r2Service] Simulation mode: Deleted file from R2 (Key: ${key})`);
    return;
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(command);
    console.log(`[r2Service] Deleted file from R2 successfully (Key: ${key})`);
  } catch (err) {
    console.error('[r2Service] Delete from R2 failed:', err.message);
    // Log error but don't crash candidate deletion transaction
  }
};

/**
 * Generate a secure, private pre-signed S3 download URL valid for 1 hour.
 * @param {string} key Unique object key in R2.
 * @returns {Promise<string>} Pre-signed S3 URL.
 */
const getSignedResumeUrl = async (key) => {
  if (!key) return '';

  if (!s3Client) {
    // Return a simulated local developer path
    return `http://localhost:3001/simulated-r2-storage/${key}`;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    // Signed link expires in 3600 seconds (1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (err) {
    console.error('[r2Service] Signed URL generation failed:', err.message);
    return '';
  }
};

module.exports = {
  uploadResume,
  deleteResume,
  getSignedResumeUrl
};
