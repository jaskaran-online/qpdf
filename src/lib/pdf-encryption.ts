import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface EncryptionOptions {
  userPassword: string
  ownerPassword?: string
  encryptionLevel?: number
}

export interface EncryptionResult {
  success: boolean
  data?: Buffer
  error?: string
}

export interface DecryptionOptions {
  password: string
}

export interface DecryptionResult {
  success: boolean
  data?: Buffer
  error?: string
}

/**
 * Encrypts a PDF file using qpdf
 * @param inputBuffer - The PDF file buffer to encrypt
 * @param options - Encryption options including passwords and encryption level
 * @returns Promise with encryption result
 */
export async function encryptPDF(
  inputBuffer: Buffer,
  options: EncryptionOptions
): Promise<EncryptionResult> {
  const tempDir = '/tmp/pdf-protect'
  const timestamp = Date.now()
  const inputPath = join(tempDir, `input_${timestamp}.pdf`)
  const outputPath = join(tempDir, `output_${timestamp}.pdf`)

  try {
    // Ensure temp directory exists
    await execAsync(`mkdir -p ${tempDir}`)

    // Save input file
    await writeFile(inputPath, inputBuffer)

    // Build qpdf command
    let command = `qpdf --encrypt "${options.userPassword}"`
    
    if (options.ownerPassword) {
      command += ` "${options.ownerPassword}"`
    } else {
      // Use user password as owner password if not provided
      command += ` "${options.userPassword}"`
    }
    
    const encryptionLevel = options.encryptionLevel || 256
    command += ` ${encryptionLevel} -- "${inputPath}" "${outputPath}"`

    // Execute qpdf command
    await execAsync(command)

    // Read the encrypted file
    const encryptedBuffer = await readFile(outputPath)

    // Clean up temporary files
    await unlink(inputPath)
    await unlink(outputPath)

    return {
      success: true,
      data: encryptedBuffer
    }
  } catch (error) {
    // Clean up on error
    try {
      await unlink(inputPath)
      await unlink(outputPath)
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: handleEncryptionError(error)
    }
  }
}

/**
 * Decrypts a PDF file using qpdf
 * @param inputBuffer - The encrypted PDF file buffer
 * @param options - Decryption options including password
 * @returns Promise with decryption result
 */
export async function decryptPDF(
  inputBuffer: Buffer,
  options: DecryptionOptions
): Promise<DecryptionResult> {
  const tempDir = '/tmp/pdf-unprotect'
  const timestamp = Date.now()
  const inputPath = join(tempDir, `input_${timestamp}.pdf`)
  const outputPath = join(tempDir, `output_${timestamp}.pdf`)

  try {
    // Ensure temp directory exists
    await execAsync(`mkdir -p ${tempDir}`)

    // Save input file
    await writeFile(inputPath, inputBuffer)

    // Build qpdf command to decrypt PDF
    const command = `qpdf --password="${options.password}" --decrypt "${inputPath}" "${outputPath}"`

    // Execute qpdf command
    await execAsync(command)

    // Read the decrypted file
    const decryptedBuffer = await readFile(outputPath)

    // Clean up temporary files
    await unlink(inputPath)
    await unlink(outputPath)

    return {
      success: true,
      data: decryptedBuffer
    }
  } catch (error) {
    // Clean up on error
    try {
      await unlink(inputPath)
      await unlink(outputPath)
    } catch (cleanupError) {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: handleDecryptionError(error)
    }
  }
}

/**
 * Handles encryption-specific errors and returns user-friendly messages
 */
function handleEncryptionError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('qpdf: command not found')) {
      return 'qpdf is not installed on the server'
    }
    if (error.message.includes('wrong password')) {
      return 'Invalid password provided'
    }
    if (error.message.includes('invalid PDF')) {
      return 'Invalid or corrupted PDF file'
    }
    if (error.message.includes('permission denied')) {
      return 'Permission denied while processing PDF'
    }
    if (error.message.includes('no space left')) {
      return 'Insufficient disk space for processing'
    }
  }
  return 'Failed to encrypt PDF file'
}

/**
 * Handles decryption-specific errors and returns user-friendly messages
 */
function handleDecryptionError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('qpdf: command not found')) {
      return 'qpdf is not installed on the server'
    }
    if (error.message.includes('wrong password') || error.message.includes('invalid password')) {
      return 'Invalid password provided'
    }
    if (error.message.includes('invalid PDF') || error.message.includes('not a valid PDF')) {
      return 'Invalid or corrupted PDF file'
    }
    if (error.message.includes('unable to find') || error.message.includes('not found')) {
      return 'PDF file not found or corrupted'
    }
    if (error.message.includes('permission denied')) {
      return 'Permission denied while processing PDF'
    }
    if (error.message.includes('no space left')) {
      return 'Insufficient disk space for processing'
    }
  }
  return 'Failed to decrypt PDF file'
}

/**
 * Validates PDF file buffer
 * @param buffer - The file buffer to validate
 * @returns boolean indicating if the file appears to be a valid PDF
 */
export function validatePDFBuffer(buffer: Buffer): boolean {
  // Check for PDF header
  const pdfHeader = buffer.toString('ascii', 0, 4)
  return pdfHeader === '%PDF'
}

/**
 * Validates password strength
 * @param password - The password to validate
 * @returns object with validation result and message
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password || password.length === 0) {
    return { isValid: false, message: 'Password is required' }
  }
  
  if (password.length < 3) {
    return { isValid: false, message: 'Password must be at least 3 characters long' }
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' }
  }
  
  return { isValid: true }
}
