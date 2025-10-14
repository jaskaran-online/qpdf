import { NextRequest } from "next/server";
import {
  encryptPDF,
  validatePDFBuffer,
  validatePassword,
} from "@/lib/pdf-encryption";
import {
  createErrorResponse,
  createPDFResponse,
  validateFormData,
  validateFile,
  ERROR_MESSAGES,
  HTTP_STATUS,
  logAPIError,
} from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const password = formData.get("password") as string;
    const ownerPassword = formData.get("ownerPassword") as string;

    // Validate required fields
    const validation = validateFormData(formData, ["file", "password"]);
    if (!validation.isValid) {
      return createErrorResponse(
        `${ERROR_MESSAGES.MISSING_PARAMETERS}: ${validation.missingFields.join(
          ", "
        )}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      return createErrorResponse(
        fileValidation.message!,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return createErrorResponse(
        passwordValidation.message!,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate PDF buffer
    if (!validatePDFBuffer(buffer)) {
      return createErrorResponse(
        ERROR_MESSAGES.INVALID_FILE,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Encrypt PDF
    const result = await encryptPDF(buffer, {
      userPassword: password,
      ownerPassword: ownerPassword || undefined,
      encryptionLevel: 256,
    });

    if (!result.success) {
      logAPIError("PDF Protection", new Error(result.error), {
        filename: file.name,
        fileSize: file.size,
      });

      const status = result.error?.includes("qpdf is not installed")
        ? HTTP_STATUS.SERVICE_UNAVAILABLE
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

      return createErrorResponse(result.error!, status, {
        operation: "PDF Protection",
        filename: file.name,
        fileSize: file.size,
        userPasswordProvided: !!password,
        ownerPasswordProvided: !!ownerPassword,
        qpdfError: result.details,
      });
    }

    // Return protected PDF
    return createPDFResponse(result.data!, file.name, true);
  } catch (error) {
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : { error: String(error) };

    logAPIError("PDF Protection API", error);
    return createErrorResponse(
      ERROR_MESSAGES.INTERNAL_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      {
        operation: "PDF Protection API",
        ...errorDetails,
      }
    );
  }
}
