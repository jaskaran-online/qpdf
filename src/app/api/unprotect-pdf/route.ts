import { NextRequest } from 'next/server'
import { decryptPDF, validatePDFBuffer, validatePassword } from '@/lib/pdf-encryption'
import { 
  createErrorResponse, 
  createPDFResponse, 
  validateFormData, 
  validateFile, 
  ERROR_MESSAGES, 
  HTTP_STATUS,
  logAPIError 
} from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string

    // Validate required fields
    const validation = validateFormData(formData, ['file', 'password'])
    if (!validation.isValid) {
      return createErrorResponse(
        `${ERROR_MESSAGES.MISSING_PARAMETERS}: ${validation.missingFields.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      )
    }

    // Validate file
    const fileValidation = validateFile(file)
    if (!fileValidation.isValid) {
      return createErrorResponse(fileValidation.message!, HTTP_STATUS.BAD_REQUEST)
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return createErrorResponse(passwordValidation.message!, HTTP_STATUS.BAD_REQUEST)
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Validate PDF buffer
    if (!validatePDFBuffer(buffer)) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_FILE, HTTP_STATUS.BAD_REQUEST)
    }

    // Decrypt PDF
    const result = await decryptPDF(buffer, {
      password: password
    })

    if (!result.success) {
      logAPIError('PDF Unprotection', new Error(result.error), {
        filename: file.name,
        fileSize: file.size
      })

      const status = result.error?.includes('qpdf is not installed')
        ? HTTP_STATUS.SERVICE_UNAVAILABLE
        : result.error?.includes('Invalid password')
        ? HTTP_STATUS.BAD_REQUEST
        : HTTP_STATUS.INTERNAL_SERVER_ERROR

      return createErrorResponse(result.error!, status, {
        operation: "PDF Unprotection",
        filename: file.name,
        fileSize: file.size,
        passwordProvided: !!password,
      })
    }

    // Return unprotected PDF
    return createPDFResponse(result.data!, file.name, false)
    
  } catch (error) {
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : { error: String(error) };

    logAPIError('PDF Unprotection API', error)
    return createErrorResponse(ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      operation: "PDF Unprotection API",
      ...errorDetails,
    })
  }
}