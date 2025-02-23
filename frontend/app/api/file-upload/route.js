import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { Deepgram } from "@deepgram/sdk";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Deepgram with your API key
const deepgramApiKey = process.env.DEEPGRAM_API_KEY; // Store this in your .env file
const deepgram = new Deepgram(deepgramApiKey);

// Helper: Convert Next.js Web Request into Node.js IncomingMessage
function toIncomingMessage(req) {
  const stream = Readable.from(req.body ?? []);
  stream.headers = Object.fromEntries(req.headers); // Add headers for formidable
  stream.method = req.method;
  return stream;
}

export async function POST(req) {
  return new Promise((resolve) => {
    const form = new IncomingForm();

    const incomingReq = toIncomingMessage(req);

    form.parse(incomingReq, async (err, fields, files) => {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*", // Replace with specific domain in production
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      };

      if (err) {
        console.error("❌ Error parsing form:", err);
        return resolve(new Response(JSON.stringify({ message: "Error parsing form" }), { status: 500, headers: corsHeaders }));
      }

      const file = files.file;
      if (!file) {
        return resolve(new Response(JSON.stringify({ message: "No file uploaded" }), { status: 400, headers: corsHeaders }));
      }

      console.log("✅ File uploaded:", file);

      try {
        const audioStream = Readable.from(file.filepath ? require("fs").createReadStream(file.filepath) : []);

        const response = await deepgram.transcription.preRecorded(
          { buffer: audioStream },
          { punctuate: true, language: "en-US" }
        );

        const transcript = response?.results?.channels[0]?.alternatives[0]?.transcript || "No transcript available";

        resolve(new Response(JSON.stringify({ message: "Transcription successful", transcript }), { status: 200, headers: corsHeaders }));
      } catch (error) {
        console.error("❌ Deepgram transcription error:", error);
        resolve(new Response(JSON.stringify({ message: "Error during transcription" }), { status: 500, headers: corsHeaders }));
      }
    });
  });
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Replace with frontend URL in production
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
