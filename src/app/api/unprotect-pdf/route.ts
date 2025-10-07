import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string

    if (!file || !password) {
      return NextResponse.json(
        { error: 'File and password are required' },
        { status: 400 }
      )
    }

    // Create temporary directory for processing
    const tempDir = '/tmp/pdf-unprotect'
    const timestamp = Date.now()
    const inputPath = join(tempDir, `input_${timestamp}.pdf`)
    const outputPath = join(tempDir, `output_${timestamp}.pdf`)

    try {
      // Ensure temp directory exists
      await execAsync(`mkdir -p ${tempDir}`)

      // Save uploaded file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(inputPath, buffer)

      // Build qpdf command to decrypt PDF
      const command = `qpdf --password="${password}" --decrypt "${inputPath}" "${outputPath}"`

      // Execute qpdf command
      await execAsync(command)

      // Read the unprotected file
      const unprotectedFileBuffer = await readFile(outputPath)

      // Clean up temporary files
      await unlink(inputPath)
      await unlink(outputPath)

      // Return the unprotected PDF
      return new NextResponse(unprotectedFileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="unprotected_${file.name}"`,
        },
      })
    } catch (error) {
      // Clean up on error
      try {
        await unlink(inputPath)
        await unlink(outputPath)
      } catch (cleanupError) {
        // Ignore cleanup errors
      }

      console.error('PDF unprotection error:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('qpdf: command not found')) {
          return NextResponse.json(
            { error: 'qpdf is not installed on the server' },
            { status: 500 }
          )
        }
        if (error.message.includes('wrong password') || error.message.includes('invalid password')) {
          return NextResponse.json(
            { error: 'Invalid password provided' },
            { status: 400 }
          )
        }
        if (error.message.includes('invalid PDF') || error.message.includes('not a valid PDF')) {
          return NextResponse.json(
            { error: 'Invalid or corrupted PDF file' },
            { status: 400 }
          )
        }
        if (error.message.includes('unable to find') || error.message.includes('not found')) {
          return NextResponse.json(
            { error: 'PDF file not found or corrupted' },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Failed to unprotect PDF file' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}