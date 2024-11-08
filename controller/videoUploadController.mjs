import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
// Set up AWS SDK configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Your AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Your AWS Secret Access Key
  region: process.env.AWS_REGION, // Your AWS region
});

const s3 = new AWS.S3();

// Function to upload video to S3 using async/await
export const uploadVideoToS3 = async (file) => {
  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 Bucket name
    Key: `videos/${Date.now()}-${file.originalname}`, // File name in S3
    Body: file.buffer, // File content (buffer)
    // ACL: "public-read", // File access permission (public)
    ContentType: file.mimetype, // MIME type of the file
  };

  try {
    const data = await s3.upload(uploadParams).promise(); // Use the promise-based API
    return data; // Return the data (including the S3 URL)
  } catch (err) {
    // Throw an error if upload fails
    throw new Error(`Error uploading video to S3: ${err.message}`);
  }
};
