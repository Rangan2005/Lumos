import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    form.parse(incomingReq, (err, fields, files) => {
      // Set CORS headers
      const corsHeaders = {
        "Access-Control-Allow-Origin": "", // Replace '*' with specific domain in production
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Content-Type": "application/json",
      };

      if (err) {
        console.error("❌ Error parsing form:", err);
        return resolve(
          new Response(
            JSON.stringify({ message: "Error parsing form" }),
            { status: 500, headers: corsHeaders }
          )
        );
      }

      const file = files.file; // This will be sent to the Python backend
      if (!file) {
        return resolve(
          new Response(
            JSON.stringify({ message: "No file uploaded" }),
            { status: 400, headers: corsHeaders }
          )
        );
      }

      console.log("✅ File uploaded:", file);

      resolve(
        new Response(
          JSON.stringify({ message: "File uploaded successfully", file }),
          { status: 200, headers: corsHeaders }
        )
      );
    });
  });
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*", // Replace '*' with your frontend URL in production
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
