import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AWS from "aws-sdk";
const s3 = new AWS.S3();

import dotenv from "dotenv";
dotenv.config();

// Function to read input.txt and write to output.txt
export function copyFile(req, res) {
  // Resolve __dirname using import.meta.url
  //   / Use fileURLToPath to correctly resolve __dirname from import.meta.url
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  console.log("__dirname", __dirname); // Log to ensure the correct __dirname

  // Use path.resolve() to construct the correct file paths
  const inputPath = path.resolve(__dirname, "..", "file", "input.txt");
  const outputPath = path.resolve(__dirname, "..", "file", "output.txt");

  console.log("Input Path:", inputPath);
  // Create readable and writable streams
  const inputStream = fs.createReadStream(inputPath, "utf-8");
  const outputStream = fs.createWriteStream(outputPath, "utf-8");

  // Flag to check if the response has already been sent
  let responseSent = false;

  // Pipe the input stream to the output stream
  inputStream.pipe(outputStream);

  // Handle successful completion
  outputStream.on("finish", () => {
    if (!responseSent) {
      responseSent = true; // Mark that the response has been sent
      return res
        .status(200)
        .send({ status: true, message: "File has been copied successfully." });
    }
  });

  // Handle errors during reading or writing
  inputStream.on("error", (err) => {
    if (!responseSent) {
      responseSent = true;
      console.error("Error reading the file:", err);
      return res
        .status(500)
        .send({ status: false, message: "Error reading the input file." });
    }
  });

  outputStream.on("error", (err) => {
    if (!responseSent) {
      responseSent = true;
      console.error("Error writing the file:", err);
      return res
        .status(500)
        .send({ status: false, message: "Error writing the output file." });
    }
  });
}

export function streamFile(req, res) {
  // Resolve __dirname using import.meta.url
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Construct the correct file path
  const inputPath = path.resolve(__dirname, "..", "file", "input.txt");

  // Log for debugging
  console.log("Input Path:", inputPath);

  // Check if file exists before trying to stream it
  if (!fs.existsSync(inputPath)) {
    return res.status(404).send({ status: false, message: "File not found." });
  }

  // Set appropriate headers for streaming a text file
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  // Create a readable stream for the input file
  const inputStream = fs.createReadStream(inputPath, "utf-8");

  // Pipe the input stream to the response object
  inputStream.pipe(res);

  // Handle errors during streaming
  inputStream.on("error", (err) => {
    console.error("Error streaming the file:", err);
    return res
      .status(500)
      .send({ status: false, message: "Error streaming the file." });
  });

  // Handle the 'end' event when streaming is finished
  inputStream.on("end", () => {
    console.log("File streaming finished.");
    onStreamEnd(); // Call your custom function when streaming is complete
  });
}

// Your custom function to be called when the streaming ends
function onStreamEnd() {
  console.log("The file has been successfully streamed to the client.");
  // You can perform other actions here if needed, such as logging, database updates, etc.
}

export function streamVideo(req, res) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME; // Replace with your S3 bucket name
  const videoKey =
    "videos/1731049902587-MongoDB vs DynamoDB in Under 2 Mins.mp4"; // Replace with your S3 object key

  // Set headers to inform the client that a video file is being streamed
  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", 'inline; filename="video.mp4"'); // You can change 'inline' to 'attachment' for download
  res.setHeader("Accept-Ranges", "bytes"); // Allow byte-range requests (for seeking)

  // Get the video object metadata to set the Content-Length header and handle byte-range requests
  const params = {
    Bucket: bucketName,
    Key: videoKey,
  };

  // Fetch the metadata first to get the video size
  s3.headObject(params, (err, metadata) => {
    if (err) {
      console.error("Error getting video metadata:", err);
      return res.status(500).send({
        status: false,
        message: "Error retrieving video metadata from S3.",
      });
    }

    const videoSize = metadata.ContentLength;

    // Set the Content-Length header so the client knows the size of the file
    res.setHeader("Content-Length", videoSize);

    // Declare s3Stream outside the conditional block
    let s3Stream;

    // If a range is specified in the request, handle the byte-range streaming
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunkSize = end - start + 1;

      res.status(206); // Partial Content response

      // Set the 'Content-Range' header for partial content
      res.setHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
      res.setHeader("Content-Length", chunkSize);

      // Stream the video part
      s3Stream = s3
        .getObject({
          Bucket: bucketName,
          Key: videoKey,
          Range: `bytes=${start}-${end}`,
        })
        .createReadStream();
    } else {
      // If no range is requested, stream the entire video
      s3Stream = s3.getObject(params).createReadStream();
    }

    // Ensure that the stream is being piped to the response
    s3Stream.pipe(res);

    // Handle errors during the stream
    s3Stream.on("error", (err) => {
      console.error("Error streaming the video:", err);
      res
        .status(500)
        .send({ status: false, message: "Error streaming the video from S3." });
    });
  });
}
