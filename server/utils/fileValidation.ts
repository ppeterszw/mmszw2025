import crypto from 'crypto';

// Document type validation configuration
export const DOCUMENT_TYPE_CONFIG = {
  // Individual documents
  o_level_cert: { 
    label: "O-Level Certificate", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024, // 20MB
    description: "O-Level certificate document",
    category: "education"
  },
  a_level_cert: { 
    label: "A-Level Certificate", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "A-Level certificate document",
    category: "education"
  },
  equivalent_cert: { 
    label: "Equivalent Certificate", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "Equivalent qualification certificate",
    category: "education"
  },
  id_or_passport: { 
    label: "ID or Passport", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "National ID or passport document",
    category: "identity"
  },
  birth_certificate: { 
    label: "Birth Certificate", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "Birth certificate document",
    category: "identity"
  },
  // Organization documents  
  bank_trust_letter: { 
    label: "Bank Trust Letter", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "Bank trust account letter",
    category: "financial"
  },
  certificate_incorporation: { 
    label: "Certificate of Incorporation", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxSize: 5 * 1024 * 1024,
    description: "Certificate of incorporation document",
    category: "legal"
  },
  partnership_agreement: { 
    label: "Partnership Agreement", 
    allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: "Partnership agreement document",
    category: "legal"
  },
  cr6: { 
    label: "CR6 Form", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxSize: 5 * 1024 * 1024,
    description: "CR6 form document",
    category: "legal"
  },
  cr11: { 
    label: "CR11 Form", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxSize: 5 * 1024 * 1024,
    description: "CR11 form document",
    category: "legal"
  },
  tax_clearance: { 
    label: "Tax Clearance", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxSize: 3 * 1024 * 1024,
    description: "Tax clearance certificate",
    category: "financial"
  },
  annual_return_1: { 
    label: "Annual Return (Year 1)", 
    allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    maxSize: 5 * 1024 * 1024,
    description: "First year annual return",
    category: "financial"
  },
  annual_return_2: { 
    label: "Annual Return (Year 2)", 
    allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    maxSize: 5 * 1024 * 1024,
    description: "Second year annual return",
    category: "financial"
  },
  annual_return_3: { 
    label: "Annual Return (Year 3)", 
    allowedMimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    allowedExtensions: [".pdf", ".doc", ".docx"],
    maxSize: 5 * 1024 * 1024,
    description: "Third year annual return",
    category: "financial"
  },
  police_clearance_director: { 
    label: "Police Clearance (Director)", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png"],
    maxSize: 3 * 1024 * 1024,
    description: "Police clearance for director",
    category: "identity"
  },
  // Payment documents
  application_fee_pop: { 
    label: "Application Fee Proof of Payment", 
    allowedMimeTypes: ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/svg+xml"],
    allowedExtensions: [".pdf", ".jpg", ".jpeg", ".png", ".svg"],
    maxSize: 20 * 1024 * 1024,
    description: "Proof of payment for application fee",
    category: "financial"
  }
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPE_CONFIG;

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo: {
    size: number;
    extension: string;
    mimeType?: string;
    hash?: string;
  };
}

export interface FileValidationOptions {
  documentType?: DocumentType;
  maxSize?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
  checkDuplicates?: boolean;
  customValidations?: Array<(file: Buffer, filename: string) => Promise<string | null>>;
}

/**
 * Comprehensive file validation utility
 */
export class FileValidator {
  private static readonly SUSPICIOUS_PATTERNS = [
    // Script patterns
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    // PHP patterns
    /<\?php/gi,
    /<\?=/gi,
    // ASP patterns
    /<%[\s\S]*?%>/gi,
    // SQL injection patterns
    /union\s+select/gi,
    /drop\s+table/gi,
    /delete\s+from/gi
  ];

  private static readonly MAGIC_NUMBERS = {
    PDF: Buffer.from([0x25, 0x50, 0x44, 0x46]), // %PDF
    JPEG: Buffer.from([0xFF, 0xD8, 0xFF]),
    PNG: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    DOC: Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1]),
    DOCX: Buffer.from([0x50, 0x4B, 0x03, 0x04]) // ZIP header, DOCX is a ZIP file
  };

  /**
   * Validate file based on document type and custom options
   */
  static async validateFile(
    fileBuffer: Buffer, 
    filename: string, 
    mimeType: string,
    options: FileValidationOptions = {}
  ): Promise<FileValidationResult> {
    const result: FileValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      fileInfo: {
        size: fileBuffer.length,
        extension: this.getFileExtension(filename),
        mimeType,
        hash: this.calculateHash(fileBuffer)
      }
    };

    try {
      // Get document type configuration
      const config = options.documentType ? DOCUMENT_TYPE_CONFIG[options.documentType] : null;

      // Validate file size
      this.validateFileSize(fileBuffer, config, options, result);

      // Validate file type and magic number
      await this.validateFileType(fileBuffer, filename, mimeType, config, options, result);

      // Check for malicious content
      await this.checkMaliciousContent(fileBuffer, filename, result);

      // Validate file structure
      await this.validateFileStructure(fileBuffer, mimeType, result);

      // Run custom validations
      if (options.customValidations) {
        await this.runCustomValidations(fileBuffer, filename, options.customValidations, result);
      }

      // Set overall validity
      result.isValid = result.errors.length === 0;

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  /**
   * Validate file size
   */
  private static validateFileSize(
    fileBuffer: Buffer,
    config: any,
    options: FileValidationOptions,
    result: FileValidationResult
  ): void {
    const maxSize = options.maxSize || config?.maxSize || (10 * 1024 * 1024); // Default 10MB
    
    if (fileBuffer.length > maxSize) {
      const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1);
      result.errors.push(`File size (${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size of ${maxSizeMB}MB`);
    }

    // Minimum size check (prevent empty files)
    if (fileBuffer.length < 100) {
      result.errors.push('File is too small or appears to be empty');
    }

    // Warning for large files
    if (fileBuffer.length > 5 * 1024 * 1024) {
      result.warnings.push('Large file detected - upload may take longer');
    }
  }

  /**
   * Validate file type using both extension and magic number
   */
  private static async validateFileType(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    config: any,
    options: FileValidationOptions,
    result: FileValidationResult
  ): Promise<void> {
    const extension = this.getFileExtension(filename);
    const allowedExtensions = options.allowedExtensions || config?.allowedExtensions || [];
    const allowedMimeTypes = options.allowedMimeTypes || config?.allowedMimeTypes || [];

    // Check extension (add dot to match allowedExtensions format)
    const extensionWithDot = `.${extension.toLowerCase()}`;
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(extensionWithDot)) {
      result.errors.push(`File extension '${extension}' not allowed. Allowed: ${allowedExtensions.join(', ')}`);
    }

    // Check MIME type
    if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(mimeType)) {
      result.errors.push(`File type '${mimeType}' not allowed. Allowed: ${allowedMimeTypes.join(', ')}`);
    }

    // Validate magic number (file signature)
    const detectedType = this.detectFileTypeByMagicNumber(fileBuffer);
    if (detectedType && !this.isMimeTypeMatchingDetected(mimeType, detectedType)) {
      result.warnings.push(`File content doesn't match declared type. Detected: ${detectedType}, Declared: ${mimeType}`);
    }
  }

  /**
   * Check for malicious content
   */
  private static async checkMaliciousContent(
    fileBuffer: Buffer,
    filename: string,
    result: FileValidationResult
  ): Promise<void> {
    // Skip malicious content checks for allowed file types (PDF, images)
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.svg'];
    const fileExtension = filename.toLowerCase().split('.').pop();
    const isAllowedFileType = fileExtension && allowedExtensions.includes('.' + fileExtension);
    
    if (isAllowedFileType) {
      // For allowed document types, only check for extremely dangerous patterns
      const dangerousFilenames = [
        /\.(bat|cmd|com|exe|scr|vbs|jar)$/i,
        /\.\.+/,
      ];

      for (const pattern of dangerousFilenames) {
        if (pattern.test(filename)) {
          result.errors.push('Filename contains suspicious patterns');
          break;
        }
      }
      return; // Skip content checking for document files
    }

    // For other file types, perform full malicious content check
    const content = fileBuffer.toString('utf8');
    
    // Check for suspicious patterns
    for (const pattern of this.SUSPICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        result.errors.push('File contains potentially malicious content');
        break;
      }
    }

    // Check for suspicious filename patterns
    const suspiciousFilenames = [
      /\.(bat|cmd|com|exe|scr|vbs|js|jar)$/i,
      /\.(php|asp|jsp|py|rb|pl)$/i,
      /\.\.+/,
      /[<>:"|?*]/
    ];

    for (const pattern of suspiciousFilenames) {
      if (pattern.test(filename)) {
        result.errors.push('Filename contains suspicious patterns');
        break;
      }
    }
  }

  /**
   * Validate file structure based on type
   */
  private static async validateFileStructure(
    fileBuffer: Buffer,
    mimeType: string,
    result: FileValidationResult
  ): Promise<void> {
    try {
      if (mimeType === 'application/pdf') {
        await this.validatePdfStructure(fileBuffer, result);
      } else if (mimeType.startsWith('image/')) {
        await this.validateImageStructure(fileBuffer, mimeType, result);
      }
    } catch (error) {
      result.warnings.push(`Could not validate file structure: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate PDF structure
   */
  private static async validatePdfStructure(
    fileBuffer: Buffer,
    result: FileValidationResult
  ): Promise<void> {
    // Check for PDF header
    if (!fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.PDF)) {
      result.errors.push('Invalid PDF file structure');
      return;
    }

    // Check for PDF footer
    const footer = fileBuffer.subarray(-10);
    if (!footer.includes(Buffer.from('%%EOF'))) {
      result.warnings.push('PDF file may be corrupted - missing EOF marker');
    }

    // Basic PDF version check
    const header = fileBuffer.subarray(0, 20).toString();
    const versionMatch = header.match(/%PDF-(\d+\.\d+)/);
    if (versionMatch) {
      const version = parseFloat(versionMatch[1]);
      if (version > 2.0) {
        result.warnings.push(`PDF version ${version} may not be compatible with all viewers`);
      }
    }
  }

  /**
   * Validate image structure
   */
  private static async validateImageStructure(
    fileBuffer: Buffer,
    mimeType: string,
    result: FileValidationResult
  ): Promise<void> {
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      if (!fileBuffer.subarray(0, 3).equals(this.MAGIC_NUMBERS.JPEG)) {
        result.errors.push('Invalid JPEG file structure');
      }
      // Check for JPEG end marker
      if (fileBuffer[fileBuffer.length - 2] !== 0xFF || fileBuffer[fileBuffer.length - 1] !== 0xD9) {
        result.warnings.push('JPEG file may be corrupted - missing end marker');
      }
    } else if (mimeType === 'image/png') {
      if (!fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.PNG)) {
        result.errors.push('Invalid PNG file structure');
      }
    }
  }

  /**
   * Run custom validation functions
   */
  private static async runCustomValidations(
    fileBuffer: Buffer,
    filename: string,
    validations: Array<(file: Buffer, filename: string) => Promise<string | null>>,
    result: FileValidationResult
  ): Promise<void> {
    for (const validation of validations) {
      try {
        const error = await validation(fileBuffer, filename);
        if (error) {
          result.errors.push(error);
        }
      } catch (error) {
        result.warnings.push(`Custom validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }

  /**
   * Get file extension from filename
   */
  private static getFileExtension(filename: string): string {
    return filename.toLowerCase().split('.').pop() || '';
  }

  /**
   * Calculate file hash
   */
  private static calculateHash(fileBuffer: Buffer): string {
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  /**
   * Detect file type by magic number
   */
  private static detectFileTypeByMagicNumber(fileBuffer: Buffer): string | null {
    if (fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.PDF)) return 'application/pdf';
    if (fileBuffer.subarray(0, 3).equals(this.MAGIC_NUMBERS.JPEG)) return 'image/jpeg';
    if (fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.PNG)) return 'image/png';
    if (fileBuffer.subarray(0, 8).equals(this.MAGIC_NUMBERS.DOC)) return 'application/msword';
    if (fileBuffer.subarray(0, 4).equals(this.MAGIC_NUMBERS.DOCX)) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    return null;
  }

  /**
   * Check if MIME type matches detected type
   */
  private static isMimeTypeMatchingDetected(mimeType: string, detectedType: string): boolean {
    const typeMap: Record<string, string[]> = {
      'application/pdf': ['application/pdf'],
      'image/jpeg': ['image/jpeg', 'image/jpg'],
      'image/png': ['image/png'],
      'application/msword': ['application/msword'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    return typeMap[detectedType]?.includes(mimeType) || false;
  }

  /**
   * Get document categories
   */
  static getDocumentCategories(): string[] {
    const categories = new Set<string>();
    Object.values(DOCUMENT_TYPE_CONFIG).forEach(config => {
      categories.add(config.category);
    });
    return Array.from(categories);
  }

  /**
   * Get documents by category
   */
  static getDocumentsByCategory(category: string): Array<{key: DocumentType, config: typeof DOCUMENT_TYPE_CONFIG[DocumentType]}> {
    return Object.entries(DOCUMENT_TYPE_CONFIG)
      .filter(([, config]) => config.category === category)
      .map(([key, config]) => ({ key: key as DocumentType, config }));
  }
}