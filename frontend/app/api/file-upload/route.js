import { IncomingForm } from "formidable"
import { Readable } from "stream"

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper: Convert Next.js Web Request into Node.js IncomingMessage
function toIncomingMessage(req) {
  const stream = Readable.from(req.body ?? [])
  stream.headers = Object.fromEntries(req.headers)  // Add headers for formidable
  stream.method = req.method
  return stream
}

export async function POST(req) {
  return new Promise((resolve) => {
    const form = new IncomingForm()

    const incomingReq = toIncomingMessage(req)

    form.parse(incomingReq, (err, fields, files) => {
      if (err) {
        console.error("❌ Error parsing form:", err)
        return resolve(new Response(JSON.stringify({ message: "Error parsing form" }), { status: 500 }))
      }

      const file = files.file //this will be sent to python backend
      if (!file) {
        return resolve(new Response(JSON.stringify({ message: "No file uploaded" }), { status: 400 }))
      }

      console.log("✅ File uploaded:", file)

      resolve(
        new Response(JSON.stringify({ message: "File uploaded successfully", file }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    })
  })
}
