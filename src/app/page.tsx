'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Upload, Download, Lock, Unlock, FileText, Shield, ShieldOff } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Sidebar } from '@/components/sidebar'

interface ProcessingState {
  isProcessing: boolean
  progress: number
  message: string
  error: string | null
  downloadUrl: string | null
  fileName: string | null
}

export default function PDFProtector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [ownerPassword, setOwnerPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [processing, setProcessing] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    message: '',
    error: null,
    downloadUrl: null,
    fileName: null
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file)
      setProcessing(prev => ({ ...prev, error: null, downloadUrl: null, fileName: null }))
    } else {
      setProcessing(prev => ({ ...prev, error: 'Please select a valid PDF file' }))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const protectPDF = async () => {
    if (!selectedFile || !password) {
      setProcessing(prev => ({ ...prev, error: 'Please select a file and enter a password' }))
      return
    }

    setProcessing({
      isProcessing: true,
      progress: 0,
      message: 'Preparing to protect PDF...',
      error: null,
      downloadUrl: null,
      fileName: null
    })

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('password', password)
      if (ownerPassword) {
        formData.append('ownerPassword', ownerPassword)
      }

      setProcessing(prev => ({ ...prev, progress: 25, message: 'Uploading file...' }))

      const response = await fetch('/api/protect-pdf', {
        method: 'POST',
        body: formData
      })

      setProcessing(prev => ({ ...prev, progress: 75, message: 'Processing PDF...' }))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to protect PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const originalName = selectedFile.name.replace('.pdf', '')
      const protectedName = `${originalName}_protected.pdf`

      setProcessing({
        isProcessing: false,
        progress: 100,
        message: 'PDF protected successfully!',
        error: null,
        downloadUrl: url,
        fileName: protectedName
      })
    } catch (error) {
      setProcessing({
        isProcessing: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : 'Failed to protect PDF',
        downloadUrl: null,
        fileName: null
      })
    }
  }

  const unprotectPDF = async () => {
    if (!selectedFile || !currentPassword) {
      setProcessing(prev => ({ ...prev, error: 'Please select a file and enter the current password' }))
      return
    }

    setProcessing({
      isProcessing: true,
      progress: 0,
      message: 'Preparing to unprotect PDF...',
      error: null,
      downloadUrl: null,
      fileName: null
    })

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('password', currentPassword)

      setProcessing(prev => ({ ...prev, progress: 25, message: 'Uploading file...' }))

      const response = await fetch('/api/unprotect-pdf', {
        method: 'POST',
        body: formData
      })

      setProcessing(prev => ({ ...prev, progress: 75, message: 'Processing PDF...' }))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to unprotect PDF')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const originalName = selectedFile.name.replace('.pdf', '')
      const unprotectedName = `${originalName}_unprotected.pdf`

      setProcessing({
        isProcessing: false,
        progress: 100,
        message: 'PDF unprotected successfully!',
        error: null,
        downloadUrl: url,
        fileName: unprotectedName
      })
    } catch (error) {
      setProcessing({
        isProcessing: false,
        progress: 0,
        message: '',
        error: error instanceof Error ? error.message : 'Failed to unprotect PDF',
        downloadUrl: null,
        fileName: null
      })
    }
  }

  const downloadFile = () => {
    if (processing.downloadUrl && processing.fileName) {
      const a = document.createElement('a')
      a.href = processing.downloadUrl
      a.download = processing.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPassword('')
    setOwnerPassword('')
    setCurrentPassword('')
    setProcessing({
      isProcessing: false,
      progress: 0,
      message: '',
      error: null,
      downloadUrl: null,
      fileName: null
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <div className="p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-10 w-10 text-primary" />
                <h1 className="text-4xl font-bold text-gray-900">PDF Protector</h1>
              </div>
              <p className="text-gray-600 text-lg">Protect and unprotect your PDF files with passwords</p>
            </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload PDF File
            </CardTitle>
            <CardDescription>
              Select a PDF file to protect or unprotect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg font-medium">Drop the PDF file here...</p>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">
                    Drag & drop a PDF file here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">PDF files only</p>
                </div>
              )}
            </div>
            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">{selectedFile.name}</span>
                    <span className="text-sm text-green-600">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedFile && (
          <Tabs defaultValue="protect" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="protect" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Protect PDF
              </TabsTrigger>
              <TabsTrigger value="unprotect" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                Unprotect PDF
              </TabsTrigger>
            </TabsList>

            <TabsContent value="protect">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Protect PDF with Password
                  </CardTitle>
                  <CardDescription>
                    Add password protection to restrict access to your PDF
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="password">User Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to open PDF"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Required to open and view the PDF
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ownerPassword">Owner Password (Optional)</Label>
                    <Input
                      id="ownerPassword"
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Enter owner password"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Controls permissions (printing, copying, etc.)
                    </p>
                  </div>
                  <Button 
                    onClick={protectPDF} 
                    disabled={processing.isProcessing || !password}
                    className="w-full"
                  >
                    {processing.isProcessing ? 'Processing...' : 'Protect PDF'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unprotect">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldOff className="h-5 w-5" />
                    Remove PDF Protection
                  </CardTitle>
                  <CardDescription>
                    Remove password protection from your PDF
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter the current PDF password"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      The password currently protecting the PDF
                    </p>
                  </div>
                  <Button 
                    onClick={unprotectPDF} 
                    disabled={processing.isProcessing || !currentPassword}
                    className="w-full"
                  >
                    {processing.isProcessing ? 'Processing...' : 'Remove Protection'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {processing.isProcessing && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{processing.message}</span>
                  <span className="text-sm text-gray-500">{processing.progress}%</span>
                </div>
                <Progress value={processing.progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {processing.error && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {processing.error}
            </AlertDescription>
          </Alert>
        )}

        {processing.downloadUrl && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-800">Processing Complete!</h3>
                  <p className="text-sm text-green-600 mt-1">
                    Your PDF has been processed successfully.
                  </p>
                </div>
                <Button onClick={downloadFile} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download {processing.fileName}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
          </div>
        </div>
      </div>
    </div>
  )
}