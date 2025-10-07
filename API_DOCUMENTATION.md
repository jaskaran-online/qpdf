# PDF Protection API Documentation

This documentation provides detailed information about implementing PDF protection and unprotection APIs using qpdf.

## Overview

The PDF Protection API provides REST endpoints for adding and removing password protection from PDF files using the qpdf command-line tool.

## Prerequisites

- qpdf must be installed on the server
- Node.js with file system access
- Support for multipart/form-data requests

## Base URL

```
http://localhost:3000/api
```

## API Endpoints

### 1. Protect PDF

**Endpoint:** `POST /api/protect-pdf`

**Description:** Adds password protection to a PDF file using 256-bit AES encryption.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

- `file` (File, required) - The PDF file to protect
- `password` (String, required) - User password to open the PDF
- `ownerPassword` (String, optional) - Owner password for permissions control

#### Response

**Success (200):**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="protected_filename.pdf"`
- Body: Binary PDF data

**Error (400/500):**

```json
{
  "error": "Error message description"
}
```

#### Implementation Example

```javascript
// Frontend implementation
const formData = new FormData();
formData.append("file", pdfFile);
formData.append("password", "user123");
formData.append("ownerPassword", "owner456"); // optional

const response = await fetch("/api/protect-pdf", {
  method: "POST",
  body: formData,
});

if (response.ok) {
  const protectedPdf = await response.blob();
  // Handle protected PDF
} else {
  const error = await response.json();
  console.error("Error:", error.error);
}
```

#### Server Implementation (Node.js/Next.js)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;
    const ownerPassword = formData.get("ownerPassword") as string;

    if (!file || !password) {
      return NextResponse.json(
        { error: "File and password are required" },
        { status: 400 }
      );
    }

    // Create temporary directory for processing
    const tempDir = "/tmp/pdf-protect";
    const timestamp = Date.now();
    const inputPath = join(tempDir, `input_${timestamp}.pdf`);
    const outputPath = join(tempDir, `output_${timestamp}.pdf`);

    try {
      // Ensure temp directory exists
      await execAsync(`mkdir -p ${tempDir}`);

      // Save uploaded file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(inputPath, buffer);

      // Build qpdf command
      let command = `qpdf --encrypt "${password}"`;

      if (ownerPassword) {
        command += ` "${ownerPassword}"`;
      } else {
        // Use user password as owner password if not provided
        command += ` "${password}"`;
      }

      command += ` 256 -- "${inputPath}" "${outputPath}"`;

      // Execute qpdf command
      await execAsync(command);

      // Read the protected file
      const protectedFileBuffer = await readFile(outputPath);

      // Clean up temporary files
      await unlink(inputPath);
      await unlink(outputPath);

      // Return the protected PDF
      return new NextResponse(protectedFileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="protected_${file.name}"`,
        },
      });
    } catch (error) {
      // Clean up on error
      try {
        await unlink(inputPath);
        await unlink(outputPath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      console.error("PDF protection error:", error);

      if (error instanceof Error) {
        if (error.message.includes("qpdf: command not found")) {
          return NextResponse.json(
            { error: "qpdf is not installed on the server" },
            { status: 500 }
          );
        }
        if (error.message.includes("wrong password")) {
          return NextResponse.json(
            { error: "Invalid password provided" },
            { status: 400 }
          );
        }
        if (error.message.includes("invalid PDF")) {
          return NextResponse.json(
            { error: "Invalid or corrupted PDF file" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to protect PDF file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. Unprotect PDF

**Endpoint:** `POST /api/unprotect-pdf`

**Description:** Removes password protection from a PDF file.

#### Request

**Content-Type:** `multipart/form-data`

**Parameters:**

- `file` (File, required) - The protected PDF file
- `password` (String, required) - Current password for the PDF

#### Response

**Success (200):**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="unprotected_filename.pdf"`
- Body: Binary PDF data

**Error (400/500):**

```json
{
  "error": "Error message description"
}
```

#### Implementation Example

```javascript
// Frontend implementation
const formData = new FormData();
formData.append("file", protectedPdfFile);
formData.append("password", "currentPassword");

const response = await fetch("/api/unprotect-pdf", {
  method: "POST",
  body: formData,
});

if (response.ok) {
  const unprotectedPdf = await response.blob();
  // Handle unprotected PDF
} else {
  const error = await response.json();
  console.error("Error:", error.error);
}
```

#### Server Implementation (Node.js/Next.js)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, unlink } from "fs/promises";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;

    if (!file || !password) {
      return NextResponse.json(
        { error: "File and password are required" },
        { status: 400 }
      );
    }

    // Create temporary directory for processing
    const tempDir = "/tmp/pdf-unprotect";
    const timestamp = Date.now();
    const inputPath = join(tempDir, `input_${timestamp}.pdf`);
    const outputPath = join(tempDir, `output_${timestamp}.pdf`);

    try {
      // Ensure temp directory exists
      await execAsync(`mkdir -p ${tempDir}`);

      // Save uploaded file
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(inputPath, buffer);

      // Build qpdf command to decrypt PDF
      const command = `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`;

      // Execute qpdf command
      await execAsync(command);

      // Read the unprotected file
      const unprotectedFileBuffer = await readFile(outputPath);

      // Clean up temporary files
      await unlink(inputPath);
      await unlink(outputPath);

      // Return the unprotected PDF
      return new NextResponse(unprotectedFileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="unprotected_${file.name}"`,
        },
      });
    } catch (error) {
      // Clean up on error
      try {
        await unlink(inputPath);
        await unlink(outputPath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      console.error("PDF unprotection error:", error);

      if (error instanceof Error) {
        if (error.message.includes("qpdf: command not found")) {
          return NextResponse.json(
            { error: "qpdf is not installed on the server" },
            { status: 500 }
          );
        }
        if (
          error.message.includes("wrong password") ||
          error.message.includes("invalid password")
        ) {
          return NextResponse.json(
            { error: "Invalid password provided" },
            { status: 400 }
          );
        }
        if (
          error.message.includes("invalid PDF") ||
          error.message.includes("not a valid PDF")
        ) {
          return NextResponse.json(
            { error: "Invalid or corrupted PDF file" },
            { status: 400 }
          );
        }
        if (
          error.message.includes("unable to find") ||
          error.message.includes("not found")
        ) {
          return NextResponse.json(
            { error: "PDF file not found or corrupted" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to unprotect PDF file" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

## Error Codes

| Code | Description           | Common Causes                                    |
| ---- | --------------------- | ------------------------------------------------ |
| 400  | Bad Request           | Missing required parameters, invalid file format |
| 500  | Internal Server Error | Server error, qpdf not installed                 |

## Common Error Messages

- "File and password are required"
- "qpdf is not installed on the server"
- "Invalid password provided"
- "Invalid or corrupted PDF file"
- "Failed to protect/unprotect PDF file"

## Security Considerations

1. **File Cleanup**: Always clean up temporary files to prevent disk space issues
2. **Password Security**: Passwords are passed to qpdf via command line (consider environment variables for sensitive deployments)
3. **File Validation**: Validate file types and sizes before processing
4. **Rate Limiting**: Consider implementing rate limiting in production
5. **Input Sanitization**: Sanitize file names and paths to prevent directory traversal

## Installation Requirements

### Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install qpdf
```

### macOS

```bash
brew install qpdf
```

### CentOS/RHEL

```bash
sudo yum install qpdf
# or
sudo dnf install qpdf
```

### Windows

Download from: https://qpdf.sourceforge.io/

## Testing the APIs

### Using curl

**Protect PDF:**

```bash
curl -X POST \
  -F "file=@document.pdf" \
  -F "password=user123" \
  -F "ownerPassword=owner456" \
  http://localhost:3000/api/protect-pdf \
  --output protected.pdf
```

**Unprotect PDF:**

```bash
curl -X POST \
  -F "file=@protected.pdf" \
  -F "password=user123" \
  http://localhost:3000/api/unprotect-pdf \
  --output unprotected.pdf
```

### Using JavaScript

```javascript
// Test function
async function testPDFProtection() {
  const fileInput = document.getElementById("pdfFile");
  const file = fileInput.files[0];

  if (!file) {
    console.error("No file selected");
    return;
  }

  try {
    // Test protection
    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", "test123");

    const protectResponse = await fetch("/api/protect-pdf", {
      method: "POST",
      body: formData,
    });

    if (protectResponse.ok) {
      const protectedBlob = await protectResponse.blob();
      console.log("PDF protected successfully");

      // Test unprotection
      const unprotectFormData = new FormData();
      unprotectFormData.append("file", protectedBlob);
      unprotectFormData.append("password", "test123");

      const unprotectResponse = await fetch("/api/unprotect-pdf", {
        method: "POST",
        body: unprotectFormData,
      });

      if (unprotectResponse.ok) {
        console.log("PDF unprotected successfully");
      } else {
        const error = await unprotectResponse.json();
        console.error("Unprotection failed:", error);
      }
    } else {
      const error = await protectResponse.json();
      console.error("Protection failed:", error);
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}
```

## Production Considerations

1. **File Size Limits**: Implement file size restrictions
2. **Timeout Handling**: Set appropriate timeouts for large files
3. **Logging**: Add comprehensive logging for debugging
4. **Monitoring**: Monitor disk usage and processing times
5. **Backup**: Consider backing up original files before processing
6. **Queue System**: For high-volume usage, consider implementing a queue system
7. **Caching**: Cache processed files if appropriate for your use case

## License

This implementation uses qpdf, which is licensed under the Apache License 2.0.
