import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: process.env.BLOB_READ_WRITE_TOKEN, // Explicitly pass the token
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          tokenPayload: JSON.stringify({}),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Upload completed", blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Error in upload handler:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}
