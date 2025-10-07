'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BookOpen, 
  Shield, 
  ShieldOff, 
  Upload, 
  Download, 
  Lock, 
  Unlock,
  Code,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Sidebar } from '@/components/sidebar'

export default function APIDocumentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Complete guide to the PDF Protector REST API endpoints
              </p>
            </div>

            <div className="space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    The PDF Protector API provides REST endpoints for protecting and unprotecting PDF files using qpdf.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">REST</Badge>
                      <span className="text-sm">RESTful API</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">JSON</Badge>
                      <span className="text-sm">JSON responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Files</Badge>
                      <span className="text-sm">Multipart/form-data</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Base URL */}
              <Card>
                <CardHeader>
                  <CardTitle>Base URL</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    http://localhost:3000/api
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints */}
              <Tabs defaultValue="protect" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="protect" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Protect PDF
                  </TabsTrigger>
                  <TabsTrigger value="unprotect" className="flex items-center gap-2">
                    <ShieldOff className="h-4 w-4" />
                    Unprotect PDF
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="protect">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            POST /api/protect-pdf
                          </CardTitle>
                          <CardDescription>
                            Add password protection to a PDF file
                          </CardDescription>
                        </div>
                        <Badge variant="default">POST</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Request */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Request
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Content-Type</p>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                              multipart/form-data
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Form Data</p>
                            <div className="bg-muted p-3 rounded-lg text-sm">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-mono text-red-600">file</span>
                                  <span className="text-gray-600 ml-2">File (required)</span>
                                  <p className="text-xs text-gray-500 mt-1">The PDF file to protect</p>
                                </div>
                                <div>
                                  <span className="font-mono text-red-600">password</span>
                                  <span className="text-gray-600 ml-2">String (required)</span>
                                  <p className="text-xs text-gray-500 mt-1">User password to open the PDF</p>
                                </div>
                                <div>
                                  <span className="font-mono text-gray-600">ownerPassword</span>
                                  <span className="text-gray-600 ml-2">String (optional)</span>
                                  <p className="text-xs text-gray-500 mt-1">Owner password for permissions control</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Example Request */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Example Request
                        </h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">JavaScript</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`const formData = new FormData();
formData.append('file', pdfFile);
formData.append('password', 'user123');
formData.append('ownerPassword', 'owner456');

const response = await fetch('/api/protect-pdf', {
  method: 'POST',
  body: formData
});`)}
                            >
                              Copy
                            </Button>
                          </div>
                          <pre className="text-sm overflow-x-auto">
{`const formData = new FormData();
formData.append('file', pdfFile);
formData.append('password', 'user123');
formData.append('ownerPassword', 'owner456');

const response = await fetch('/api/protect-pdf', {
  method: 'POST',
  body: formData
});`}
                          </pre>
                        </div>
                      </div>

                      {/* Response */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Response
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Success (200)</p>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                              <p className="text-sm text-green-800">
                                Returns the protected PDF file as binary data
                              </p>
                              <div className="mt-2 text-xs text-green-600">
                                Content-Type: application/pdf<br />
                                Content-Disposition: attachment; filename="protected_filename.pdf"
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Error (400/500)</p>
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                              <pre className="text-sm text-red-800">
{`{
  "error": "Error message description"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="unprotect">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Unlock className="h-5 w-5" />
                            POST /api/unprotect-pdf
                          </CardTitle>
                          <CardDescription>
                            Remove password protection from a PDF file
                          </CardDescription>
                        </div>
                        <Badge variant="default">POST</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Request */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Request
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Content-Type</p>
                            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
                              multipart/form-data
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Form Data</p>
                            <div className="bg-muted p-3 rounded-lg text-sm">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-mono text-red-600">file</span>
                                  <span className="text-gray-600 ml-2">File (required)</span>
                                  <p className="text-xs text-gray-500 mt-1">The protected PDF file</p>
                                </div>
                                <div>
                                  <span className="font-mono text-red-600">password</span>
                                  <span className="text-gray-600 ml-2">String (required)</span>
                                  <p className="text-xs text-gray-500 mt-1">Current password for the PDF</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Example Request */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          Example Request
                        </h4>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">JavaScript</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(`const formData = new FormData();
formData.append('file', protectedPdfFile);
formData.append('password', 'currentPassword');

const response = await fetch('/api/unprotect-pdf', {
  method: 'POST',
  body: formData
});`)}
                            >
                              Copy
                            </Button>
                          </div>
                          <pre className="text-sm overflow-x-auto">
{`const formData = new FormData();
formData.append('file', protectedPdfFile);
formData.append('password', 'currentPassword');

const response = await fetch('/api/unprotect-pdf', {
  method: 'POST',
  body: formData
});`}
                          </pre>
                        </div>
                      </div>

                      {/* Response */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Response
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium mb-2">Success (200)</p>
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                              <p className="text-sm text-green-800">
                                Returns the unprotected PDF file as binary data
                              </p>
                              <div className="mt-2 text-xs text-green-600">
                                Content-Type: application/pdf<br />
                                Content-Disposition: attachment; filename="unprotected_filename.pdf"
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Error (400/500)</p>
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                              <pre className="text-sm text-red-800">
{`{
  "error": "Error message description"
}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Error Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Error Codes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive">400</Badge>
                        <div>
                          <p className="font-medium">Bad Request</p>
                          <p className="text-sm text-gray-600">
                            Missing required parameters or invalid file format
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Badge variant="destructive">500</Badge>
                        <div>
                          <p className="font-medium">Internal Server Error</p>
                          <p className="text-sm text-gray-600">
                            Server error or qpdf not installed
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Common Error Messages</h4>
                      <div className="bg-muted p-4 rounded-lg text-sm space-y-1">
                        <div>• "File and password are required"</div>
                        <div>• "Please select a valid PDF file"</div>
                        <div>• "qpdf is not installed on the server"</div>
                        <div>• "Invalid password provided"</div>
                        <div>• "Invalid or corrupted PDF file"</div>
                        <div>• "Failed to protect/unprotect PDF file"</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rate Limiting */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Currently, there are no rate limits implemented on the API endpoints. 
                  In production, consider implementing rate limiting to prevent abuse.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}