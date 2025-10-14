'use client'

import { useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, FileText } from 'lucide-react'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PDFPreviewProps {
  base64Data: string
  filename: string
  originalSize: number
  decryptedSize: number
  onDownload?: () => void
}

export function PDFPreview({
  base64Data,
  filename,
  originalSize,
  decryptedSize,
  onDownload
}: PDFPreviewProps) {
  const [error, setError] = useState<string | null>(null)
  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const pdfData = `data:application/pdf;base64,${base64Data}`

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            PDF Preview: {filename}
          </div>
          {onDownload && (
            <Button onClick={onDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
        </CardTitle>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Original size: {(originalSize / 1024 / 1024).toFixed(2)} MB</p>
          <p>Decrypted size: {(decryptedSize / 1024 / 1024).toFixed(2)} MB</p>
          <p>Compression ratio: {((1 - decryptedSize / originalSize) * 100).toFixed(1)}%</p>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* PDF Viewer */}
            <div className="border rounded-lg overflow-hidden bg-gray-100 min-h-[600px]">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={pdfData}
                  plugins={[defaultLayoutPluginInstance]}
                  onDocumentLoad={() => {
                    setError(null)
                  }}
                  onDocumentError={(error) => {
                    console.error('PDF load error:', error)
                    setError('Failed to load PDF. The file may be corrupted.')
                  }}
                />
              </Worker>
            </div>

            {/* Download Button (if not in header) */}
            {!onDownload && (
              <div className="mt-4 flex justify-center">
                <Button onClick={() => {
                  const link = document.createElement('a')
                  link.href = pdfData
                  link.download = filename.replace('.pdf', '_unprotected.pdf')
                  link.click()
                }} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
