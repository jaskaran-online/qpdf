# PDF Protector

A Next.js application that provides a web interface for protecting and unprotecting PDF files using qpdf on Linux.

## Features

- **Protect PDF**: Add password protection to PDF files
- **Unprotect PDF**: Remove password protection from PDF files
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Real-time progress indicators
- **Secure Processing**: Files are processed temporarily and cleaned up automatically

## Prerequisites

### System Requirements

- Linux operating system
- Node.js 18+ 
- qpdf installed on the system

### Installing qpdf

On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install qpdf
```

On CentOS/RHEL/Fedora:
```bash
sudo yum install qpdf
# or on newer systems
sudo dnf install qpdf
```

On Arch Linux:
```bash
sudo pacman -S qpdf
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Protecting a PDF

1. Click "Upload PDF File" or drag and drop a PDF file
2. Switch to the "Protect PDF" tab
3. Enter a user password (required to open the PDF)
4. Optionally enter an owner password (controls permissions)
5. Click "Protect PDF"
6. Download the protected file

### Unprotecting a PDF

1. Click "Upload PDF File" or drag and drop a protected PDF file
2. Switch to the "Unprotect PDF" tab
3. Enter the current password for the PDF
4. Click "Remove Protection"
5. Download the unprotected file

## Security Notes

- All files are processed temporarily in `/tmp/pdf-protect` and `/tmp/pdf-unprotect` directories
- Files are automatically cleaned up after processing
- Passwords are only used for the specific operation and not stored
- The application processes files entirely on the server-side

## API Endpoints

### POST /api/protect-pdf
Protects a PDF file with password encryption.

**Request:**
- `file`: PDF file to protect
- `password`: User password (required)
- `ownerPassword`: Owner password (optional)

**Response:** Protected PDF file

### POST /api/unprotect-pdf
Removes password protection from a PDF file.

**Request:**
- `file`: Protected PDF file
- `password`: Current password for the PDF

**Response:** Unprotected PDF file

## Error Handling

The application handles various error scenarios:
- Invalid PDF files
- Incorrect passwords
- Missing qpdf installation
- File processing errors
- Network errors

## Technology Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **File Upload**: react-dropzone
- **Backend**: Next.js API Routes
- **PDF Processing**: qpdf (Linux command-line tool)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## License

This project is open source and available under the [MIT License](LICENSE).