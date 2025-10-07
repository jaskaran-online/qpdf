'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Code, 
  Terminal, 
  Shield, 
  ShieldOff, 
  Lock, 
  Unlock,
  BookOpen,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  FileText,
  Key,
  Settings
} from 'lucide-react'
import { Sidebar } from '@/components/sidebar'

export default function QPDFDocumentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <div className="p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Code className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold text-gray-900">qpdf Library Guide</h1>
              </div>
              <p className="text-gray-600 text-lg">
                Comprehensive guide to qpdf - the powerful PDF transformation library
              </p>
            </div>

            <div className="space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>What is qpdf?</CardTitle>
                  <CardDescription>
                    qpdf is a command-line program and C++ library that performs content-preserving transformations on PDF files.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Encryption</h3>
                      <p className="text-sm text-gray-600">Add/remove password protection</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Splitting</h3>
                      <p className="text-sm text-gray-600">Split PDFs into pages</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Merging</h3>
                      <p className="text-sm text-gray-600">Combine multiple PDFs</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium">Optimization</h3>
                      <p className="text-sm text-gray-600">Compress and optimize PDFs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Installation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Installation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="ubuntu" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="ubuntu">Ubuntu/Debian</TabsTrigger>
                      <TabsTrigger value="centos">CentOS/RHEL</TabsTrigger>
                      <TabsTrigger value="macos">macOS</TabsTrigger>
                      <TabsTrigger value="source">Source</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ubuntu">
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">Bash</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('sudo apt-get update\nsudo apt-get install qpdf')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm">
{`sudo apt-get update
sudo apt-get install qpdf`}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="centos">
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">Bash</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('sudo yum install qpdf\n# or\nsudo dnf install qpdf')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm">
{`sudo yum install qpdf
# or
sudo dnf install qpdf`}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="macos">
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">Bash</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('brew install qpdf')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm">
{`brew install qpdf`}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="source">
                      <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium">Bash</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard('wget https://github.com/qpdf/qpdf/releases/download/v11.6.3/qpdf-11.6.3.tar.gz\ntar xzf qpdf-11.6.3.tar.gz\ncd qpdf-11.6.3\n./configure\nmake\nsudo make install')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <pre className="text-sm">
{`wget https://github.com/qpdf/qpdf/releases/download/v11.6.3/qpdf-11.6.3.tar.gz
tar xzf qpdf-11.6.3.tar.gz
cd qpdf-11.6.3
./configure
make
sudo make install`}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Basic Commands */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Commands</CardTitle>
                  <CardDescription>
                    Essential qpdf commands for PDF manipulation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="encrypt" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
                      <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
                      <TabsTrigger value="split">Split</TabsTrigger>
                      <TabsTrigger value="merge">Merge</TabsTrigger>
                    </TabsList>

                    <TabsContent value="encrypt">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Basic Encryption</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --encrypt "user-password" "owner-password" 256 -- input.pdf output.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --encrypt "user-password" "owner-password" 256 -- input.pdf output.pdf`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">With Permissions</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --encrypt "user-password" "owner-password" 256 --modify=none --extract=n --print=n -- input.pdf output.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --encrypt "user-password" "owner-password" 256 \\
  --modify=none --extract=n --print=n \\
  -- input.pdf output.pdf`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="decrypt">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Basic Decryption</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --password="password" --decrypt input.pdf output.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --password="password" --decrypt input.pdf output.pdf`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="split">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Split by Pages</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --split-pages=5 input.pdf output.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --split-pages=5 input.pdf output.pdf`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Extract Page Range</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --empty --pages input.pdf 1-5 -- output.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --empty --pages input.pdf 1-5 -- output.pdf`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="merge">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Merge Multiple PDFs</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard('qpdf --empty --pages file1.pdf file2.pdf file3.pdf -- merged.pdf')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm">
{`qpdf --empty --pages file1.pdf file2.pdf file3.pdf -- merged.pdf`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Advanced Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Usage</CardTitle>
                  <CardDescription>
                    Advanced qpdf features and techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Permission Settings</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm">
{`# Permission options
--print=full|low|none      # Printing permissions
--modify=y|n               # Modify document permissions
--extract=y|n              # Extract content permissions
--annotate=y|n             # Add/modify annotations
--form=y|n                 # Fill form fields
--assemble=y|n             # Assemble document
--extract-for-accessibility=y|n  # Extract for accessibility`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Optimization</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm">
{`# Linearize (fast web view)
qpdf --linearize input.pdf output.pdf

# Compress streams
qpdf --compress-streams=y input.pdf output.pdf

# Normalize content
qpdf --normalize-content=y input.pdf output.pdf`}
                        </pre>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Metadata Manipulation</h4>
                      <div className="bg-muted p-4 rounded-lg">
                        <pre className="text-sm">
{`# Show metadata
qpdf --show-metadata input.pdf

# Set metadata
qpdf --set-metadata=metadata.txt input.pdf output.pdf

# Remove metadata
qpdf --remove-metadata input.pdf output.pdf`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Examples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Code Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="nodejs" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="nodejs">Node.js</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="bash">Bash Script</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nodejs">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">PDF Protection Utility</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">JavaScript</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class PDFProtector {
  static async encrypt(inputPath, outputPath, userPassword, ownerPassword) {
    const command = \`qpdf --encrypt "\${userPassword}" "\${ownerPassword}" 256 -- "\${inputPath}" "\${outputPath}"\`;
    await execAsync(command);
  }

  static async decrypt(inputPath, outputPath, password) {
    const command = \`qpdf --password="\${password}" --decrypt "\${inputPath}" "\${outputPath}"\`;
    await execAsync(command);
  }

  static async split(inputPath, outputPrefix, pagesPerFile) {
    const command = \`qpdf --split-pages=\${pagesPerFile} "\${inputPath}" "\${outputPrefix}"\`;
    await execAsync(command);
  }

  static async merge(inputFiles, outputPath) {
    const fileList = inputFiles.map(f => \`"\${f}"\`).join(' ');
    const command = \`qpdf --empty --pages \${fileList} -- "\${outputPath}"\`;
    await execAsync(command);
  }
}

// Usage example
async function example() {
  try {
    await PDFProtector.encrypt('input.pdf', 'protected.pdf', 'user123', 'owner456');
    console.log('PDF encrypted successfully');
    
    await PDFProtector.decrypt('protected.pdf', 'decrypted.pdf', 'user123');
    console.log('PDF decrypted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm overflow-x-auto">
{`const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class PDFProtector {
  static async encrypt(inputPath, outputPath, userPassword, ownerPassword) {
    const command = \`qpdf --encrypt "\${userPassword}" "\${ownerPassword}" 256 -- "\${inputPath}" "\${outputPath}"\`;
    await execAsync(command);
  }

  static async decrypt(inputPath, outputPath, password) {
    const command = \`qpdf --password="\${password}" --decrypt "\${inputPath}" "\${outputPath}"\`;
    await execAsync(command);
  }

  static async split(inputPath, outputPrefix, pagesPerFile) {
    const command = \`qpdf --split-pages=\${pagesPerFile} "\${inputPath}" "\${outputPrefix}"\`;
    await execAsync(command);
  }

  static async merge(inputFiles, outputPath) {
    const fileList = inputFiles.map(f => \`"\${f}"\`).join(' ');
    const command = \`qpdf --empty --pages \${fileList} -- "\${outputPath}"\`;
    await execAsync(command);
  }
}

// Usage example
async function example() {
  try {
    await PDFProtector.encrypt('input.pdf', 'protected.pdf', 'user123', 'owner456');
    console.log('PDF encrypted successfully');
    
    await PDFProtector.decrypt('protected.pdf', 'decrypted.pdf', 'user123');
    console.log('PDF decrypted successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="python">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">PDF Processing Script</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Python</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`import subprocess
import os
from typing import List, Optional

class PDFProcessor:
    @staticmethod
    def encrypt_pdf(input_path: str, output_path: str, user_password: str, owner_password: Optional[str] = None):
        """Encrypt a PDF file with password protection."""
        if owner_password is None:
            owner_password = user_password
        
        cmd = [
            'qpdf', '--encrypt', user_password, owner_password, '256',
            '--', input_path, output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def decrypt_pdf(input_path: str, output_path: str, password: str):
        """Decrypt a password-protected PDF file."""
        cmd = ['qpdf', '--password', password, '--decrypt', input_path, output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def split_pdf(input_path: str, output_prefix: str, pages_per_file: int = 1):
        """Split PDF into multiple files."""
        cmd = ['qpdf', '--split-pages', str(pages_per_file), input_path, output_prefix]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def merge_pdfs(input_files: List[str], output_path: str):
        """Merge multiple PDF files into one."""
        cmd = ['qpdf', '--empty', '--pages'] + input_files + ['--', output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def optimize_pdf(input_path: str, output_path: str):
        """Optimize PDF for web viewing."""
        cmd = ['qpdf', '--linearize', '--compress-streams=y', input_path, output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

# Usage example
if __name__ == "__main__":
    processor = PDFProcessor()
    
    try:
        # Encrypt PDF
        processor.encrypt_pdf('document.pdf', 'protected.pdf', 'user123', 'owner456')
        print("PDF encrypted successfully")
        
        # Decrypt PDF
        processor.decrypt_pdf('protected.pdf', 'decrypted.pdf', 'user123')
        print("PDF decrypted successfully")
        
        # Split PDF
        processor.split_pdf('large_document.pdf', 'page_', 5)
        print("PDF split successfully")
        
        # Merge PDFs
        processor.merge_pdfs(['file1.pdf', 'file2.pdf', 'file3.pdf'], 'merged.pdf')
        print("PDFs merged successfully")
        
    except Exception as e:
        print(f"Error: {e}")`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm overflow-x-auto">
{`import subprocess
import os
from typing import List, Optional

class PDFProcessor:
    @staticmethod
    def encrypt_pdf(input_path: str, output_path: str, user_password: str, owner_password: Optional[str] = None):
        """Encrypt a PDF file with password protection."""
        if owner_password is None:
            owner_password = user_password
        
        cmd = [
            'qpdf', '--encrypt', user_password, owner_password, '256',
            '--', input_path, output_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def decrypt_pdf(input_path: str, output_path: str, password: str):
        """Decrypt a password-protected PDF file."""
        cmd = ['qpdf', '--password', password, '--decrypt', input_path, output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def split_pdf(input_path: str, output_prefix: str, pages_per_file: int = 1):
        """Split PDF into multiple files."""
        cmd = ['qpdf', '--split-pages', str(pages_per_file), input_path, output_prefix]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def merge_pdfs(input_files: List[str], output_path: str):
        """Merge multiple PDF files into one."""
        cmd = ['qpdf', '--empty', '--pages'] + input_files + ['--', output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

    @staticmethod
    def optimize_pdf(input_path: str, output_path: str):
        """Optimize PDF for web viewing."""
        cmd = ['qpdf', '--linearize', '--compress-streams=y', input_path, output_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(f"qpdf error: {result.stderr}")
        return True

# Usage example
if __name__ == "__main__":
    processor = PDFProcessor()
    
    try:
        # Encrypt PDF
        processor.encrypt_pdf('document.pdf', 'protected.pdf', 'user123', 'owner456')
        print("PDF encrypted successfully")
        
        # Decrypt PDF
        processor.decrypt_pdf('protected.pdf', 'decrypted.pdf', 'user123')
        print("PDF decrypted successfully")
        
        # Split PDF
        processor.split_pdf('large_document.pdf', 'page_', 5)
        print("PDF split successfully")
        
        # Merge PDFs
        processor.merge_pdfs(['file1.pdf', 'file2.pdf', 'file3.pdf'], 'merged.pdf')
        print("PDFs merged successfully")
        
    except Exception as e:
        print(f"Error: {e}")`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bash">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Batch Processing Script</h4>
                          <div className="bg-muted p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-medium">Bash</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(`#!/bin/bash

# PDF Batch Processing Script with qpdf
# Usage: ./pdf_processor.sh [encrypt|decrypt|split|merge] [options]

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "\${GREEN}[INFO]\${NC} $1"
}

print_error() {
    echo -e "\${RED}[ERROR]\${NC} $1"
}

print_warning() {
    echo -e "\${YELLOW}[WARNING]\${NC} $1"
}

# Check if qpdf is installed
check_qpdf() {
    if ! command -v qpdf &> /dev/null; then
        print_error "qpdf is not installed. Please install it first."
        exit 1
    fi
    print_status "qpdf is installed and ready to use."
}

# Encrypt PDF files
encrypt_pdfs() {
    local input_dir="$1"
    local output_dir="$2"
    local user_pass="$3"
    local owner_pass="\${4:-\$user_pass}"
    
    mkdir -p "$output_dir"
    
    for pdf in "$input_dir"/*.pdf; do
        if [ -f "$pdf" ]; then
            filename=$(basename "$pdf")
            print_status "Encrypting: $filename"
            
            qpdf --encrypt "$user_pass" "$owner_pass" 256 \\
                --modify=none --extract=n --print=n \\
                -- "$pdf" "$output_dir/protected_$filename"
            
            if [ $? -eq 0 ]; then
                print_status "Successfully encrypted: $filename"
            else
                print_error "Failed to encrypt: $filename"
            fi
        fi
    done
}

# Decrypt PDF files
decrypt_pdfs() {
    local input_dir="$1"
    local output_dir="$2"
    local password="$3"
    
    mkdir -p "$output_dir"
    
    for pdf in "$input_dir"/*.pdf; do
        if [ -f "$pdf" ]; then
            filename=$(basename "$pdf")
            print_status "Decrypting: $filename"
            
            qpdf --password="$password" --decrypt "$pdf" "$output_dir/decrypted_$filename"
            
            if [ $? -eq 0 ]; then
                print_status "Successfully decrypted: $filename"
            else
                print_error "Failed to decrypt: $filename"
            fi
        fi
    done
}

# Split PDF files
split_pdfs() {
    local input_dir="$1"
    local output_dir="$2"
    local pages_per_file="\${3:-1}"
    
    mkdir -p "$output_dir"
    
    for pdf in "$input_dir"/*.pdf; do
        if [ -f "$pdf" ]; then
            filename=$(basename "$pdf" .pdf)
            print_status "Splitting: $filename.pdf"
            
            qpdf --split-pages="$pages_per_file" "$pdf" "$output_dir/${filename}_page"
            
            if [ $? -eq 0 ]; then
                print_status "Successfully split: $filename.pdf"
            else
                print_error "Failed to split: $filename.pdf"
            fi
        fi
    done
}

# Merge PDF files
merge_pdfs() {
    local input_dir="$1"
    local output_file="$2"
    
    # Get all PDF files in the directory
    pdf_files=("\$input_dir"/*.pdf)
    
    if [ \${#pdf_files[@]} -eq 0 ]; then
        print_error "No PDF files found in $input_dir"
        exit 1
    fi
    
    print_status "Merging \${#pdf_files[@]} PDF files..."
    
    # Build the qpdf command
    cmd="qpdf --empty --pages"
    for pdf in "\${pdf_files[@]}"; do
        if [ -f "$pdf" ]; then
            cmd+=" \"$pdf\""
        fi
    done
    cmd+=" -- \"$output_file\""
    
    eval "$cmd"
    
    if [ $? -eq 0 ]; then
        print_status "Successfully merged PDFs into: $output_file"
    else
        print_error "Failed to merge PDFs"
    fi
}

# Show usage
show_usage() {
    echo "PDF Batch Processing Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  encrypt <input_dir> <output_dir> <user_password> [owner_password]"
    echo "  decrypt <input_dir> <output_dir> <password>"
    echo "  split   <input_dir> <output_dir> [pages_per_file]"
    echo "  merge   <input_dir> <output_file>"
    echo ""
    echo "Examples:"
    echo "  $0 encrypt ./input ./output mypassword ownerpass"
    echo "  $0 decrypt ./protected ./unlocked mypassword"
    echo "  $0 split ./large-docs ./pages 5"
    echo "  $0 merge ./documents merged.pdf"
}

# Main script logic
main() {
    check_qpdf
    
    case "$1" in
        encrypt)
            if [ $# -lt 4 ]; then
                print_error "Insufficient arguments for encrypt command"
                show_usage
                exit 1
            fi
            encrypt_pdfs "$2" "$3" "$4" "$5"
            ;;
        decrypt)
            if [ $# -lt 4 ]; then
                print_error "Insufficient arguments for decrypt command"
                show_usage
                exit 1
            fi
            decrypt_pdfs "$2" "$3" "$4"
            ;;
        split)
            if [ $# -lt 3 ]; then
                print_error "Insufficient arguments for split command"
                show_usage
                exit 1
            fi
            split_pdfs "$2" "$3" "$4"
            ;;
        merge)
            if [ $# -lt 3 ]; then
                print_error "Insufficient arguments for merge command"
                show_usage
                exit 1
            fi
            merge_pdfs "$2" "$3"
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"`)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <pre className="text-sm overflow-x-auto">
{`#!/bin/bash

# PDF Batch Processing Script with qpdf
# Usage: ./pdf_processor.sh [encrypt|decrypt|split|merge] [options]

set -e

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "\${GREEN}[INFO]\${NC} $1"
}

print_error() {
    echo -e "\${RED}[ERROR]\${NC} $1"
}

print_warning() {
    echo -e "\${YELLOW}[WARNING]\${NC} $1"
}

# Check if qpdf is installed
check_qpdf() {
    if ! command -v qpdf &> /dev/null; then
        print_error "qpdf is not installed. Please install it first."
        exit 1
    fi
    print_status "qpdf is installed and ready to use."
}

# Encrypt PDF files
encrypt_pdfs() {
    local input_dir="$1"
    local output_dir="$2"
    local user_pass="$3"
    local owner_pass="\${4:-\$user_pass}"
    
    mkdir -p "$output_dir"
    
    for pdf in "$input_dir"/*.pdf; do
        if [ -f "$pdf" ]; then
            filename=$(basename "$pdf")
            print_status "Encrypting: $filename"
            
            qpdf --encrypt "$user_pass" "$owner_pass" 256 \\
                --modify=none --extract=n --print=n \\
                -- "$pdf" "$output_dir/protected_$filename"
            
            if [ $? -eq 0 ]; then
                print_status "Successfully encrypted: $filename"
            else
                print_error "Failed to encrypt: $filename"
            fi
        fi
    done
}

# Show usage
show_usage() {
    echo "PDF Batch Processing Script"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  encrypt <input_dir> <output_dir> <user_password> [owner_password]"
    echo "  decrypt <input_dir> <output_dir> <password>"
    echo "  split   <input_dir> <output_dir> [pages_per_file]"
    echo "  merge   <input_dir> <output_file>"
}

# Main script logic
main() {
    check_qpdf
    
    case "$1" in
        encrypt)
            encrypt_pdfs "$2" "$3" "$4" "$5"
            ;;
        *)
            print_error "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card>
                <CardHeader>
                  <CardTitle>Common Use Cases</CardTitle>
                  <CardDescription>
                    Real-world scenarios and applications of qpdf
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Document Security
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Protect confidential business documents</li>
                        <li>• Secure financial reports and statements</li>
                        <li>• Encrypt legal documents and contracts</li>
                        <li>• Password-protect sensitive email attachments</li>
                        <li>• Control document access permissions</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Document Management
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Split large documents into manageable sections</li>
                        <li>• Combine related documents into single files</li>
                        <li>• Extract specific pages from reports</li>
                        <li>• Create document archives and libraries</li>
                        <li>• Optimize documents for web distribution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Automation & Batch Processing
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Automated document processing workflows</li>
                        <li>• Batch encryption of document archives</li>
                        <li>• Scheduled document optimization tasks</li>
                        <li>• Integration with document management systems</li>
                        <li>• Server-side PDF processing applications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Publishing & Distribution
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• Prepare documents for digital publishing</li>
                        <li>• Create optimized versions for web viewing</li>
                        <li>• Generate document samples and previews</li>
                        <li>• Package multiple documents for distribution</li>
                        <li>• Create password-protected premium content</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Best Practices */}
              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                  <CardDescription>
                    Tips and recommendations for working with qpdf
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Always backup original files</strong> before performing any transformations, especially encryption operations.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Use strong passwords</strong> for PDF encryption. Combine uppercase, lowercase, numbers, and special characters.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Test with sample files</strong> before processing large batches of important documents.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Monitor file sizes</strong> when merging multiple PDFs, as the resulting file can become very large.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Be careful with permissions</strong> - overly restrictive permissions may prevent legitimate users from accessing content.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}