import { NextResponse } from 'next/server'

export interface APIError {
  error: string
  status: number
}

/**
 * Creates a standardized error response
 * @param message - Error message
 * @param status - HTTP status code
 * @param details - Additional error details for debugging
 * @returns NextResponse with error
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: Record<string, any>
): NextResponse {
  const errorResponse: any = {
    error: message,
    status,
    timestamp: new Date().toISOString(),
  }

  if (details && Object.keys(details).length > 0) {
    errorResponse.details = details
  }

  // In development, include stack trace if available
  if (process.env.NODE_ENV === 'development' && details?.stack) {
    errorResponse.stack = details.stack
  }

  return NextResponse.json(errorResponse, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Error': 'true',
    }
  })
}

/**
 * Creates a success response with PDF data
 * @param buffer - PDF file buffer
 * @param filename - Filename for download
 * @param isProtected - Whether the file is protected or unprotected
 * @returns NextResponse with PDF data
 */
export function createPDFResponse(
  buffer: Buffer, 
  filename: string, 
  isProtected: boolean = true
): NextResponse {
  const prefix = isProtected ? 'protected' : 'unprotected'
  const finalFilename = `${prefix}_${filename}`
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${finalFilename}"`,
    },
  })
}

/**
 * Validates required form data fields
 * @param formData - FormData object
 * @param requiredFields - Array of required field names
 * @returns object with validation result and missing fields
 */
export function validateFormData(
  formData: FormData, 
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    const value = formData.get(field)
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field)
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  }
}

/**
 * Validates file type and size
 * @param file - File object
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns object with validation result and message
 */
export function validateFile(
  file: File, 
  allowedTypes: string[] = ['application/pdf'],
  maxSize: number = 50 * 1024 * 1024 // 50MB default
): { isValid: boolean; message?: string } {
  if (!file) {
    return { isValid: false, message: 'No file provided' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: 'Invalid file type. Only PDF files are allowed.' }
  }
  
  if (file.size > maxSize) {
    return { isValid: false, message: `File size exceeds maximum limit of ${Math.round(maxSize / 1024 / 1024)}MB` }
  }
  
  if (file.size === 0) {
    return { isValid: false, message: 'File is empty' }
  }
  
  return { isValid: true }
}

/**
 * Common error messages for API responses
 */
export const ERROR_MESSAGES = {
  MISSING_PARAMETERS: 'Required parameters are missing',
  INVALID_FILE: 'Invalid or corrupted file',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_PASSWORD: 'Invalid password provided',
  QPDF_NOT_INSTALLED: 'qpdf is not installed on the server',
  PROCESSING_FAILED: 'Failed to process PDF file',
  INTERNAL_ERROR: 'Internal server error',
  PERMISSION_DENIED: 'Permission denied while processing file',
  INSUFFICIENT_SPACE: 'Insufficient disk space for processing'
} as const

/**
 * HTTP status codes for API responses
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const

/**
 * Logs API errors with context
 * @param operation - The operation being performed
 * @param error - The error object
 * @param additionalContext - Additional context information
 */
export function logAPIError(
  operation: string, 
  error: unknown, 
  additionalContext?: Record<string, any>
): void {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const context = additionalContext ? JSON.stringify(additionalContext) : ''
  
  console.error(`[${operation}] Error: ${errorMessage}${context ? ` | Context: ${context}` : ''}`)
}
