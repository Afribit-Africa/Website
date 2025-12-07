/**
 * Form Validation Hook
 *
 * Reusable hook for validating forms with Zod schemas.
 * Provides field-level and form-level error tracking.
 */

import { useState, useCallback } from 'react';
import { z } from 'zod';

export interface ValidationErrors {
  [field: string]: string;
}

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  /**
   * Validate entire form
   * Returns true if valid, false if errors found
   */
  const validate = useCallback((data: unknown): data is z.infer<T> => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: ValidationErrors = {};
      result.error.issues.forEach(err => {
        const fieldName = err.path[0]?.toString();
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [schema]);

  /**
   * Validate single field
   * Useful for real-time validation as user types
   */
  const validateField = useCallback((fieldName: string, value: any, formData: any) => {
    try {
      // Create a partial schema for the single field
      const result = schema.safeParse({ ...formData, [fieldName]: value });

      if (!result.success) {
        const fieldError = result.error.issues.find(
          err => err.path[0]?.toString() === fieldName
        );

        if (fieldError) {
          setErrors(prev => ({ ...prev, [fieldName]: fieldError.message }));
          return false;
        }
      }

      // Clear error for this field if validation passed
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } catch {
      return true; // If validation fails unexpectedly, don't block
    }
  }, [schema]);

  /**
   * Mark field as touched (for showing errors only after user interaction)
   */
  const touchField = useCallback((fieldName: string) => {
    setTouched(prev => new Set(prev).add(fieldName));
  }, []);

  /**
   * Check if field has been touched
   */
  const isFieldTouched = useCallback((fieldName: string) => {
    return touched.has(fieldName);
  }, [touched]);

  /**
   * Get error for specific field (only if touched)
   */
  const getFieldError = useCallback((fieldName: string) => {
    return isFieldTouched(fieldName) ? errors[fieldName] : undefined;
  }, [errors, isFieldTouched]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched(new Set());
  }, []);

  /**
   * Clear error for specific field
   */
  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  /**
   * Set custom error for a field
   */
  const setFieldError = useCallback((fieldName: string, message: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: message }));
    touchField(fieldName);
  }, [touchField]);

  return {
    errors,
    touched,
    validate,
    validateField,
    touchField,
    isFieldTouched,
    getFieldError,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}

/**
 * Example usage:
 *
 * const { errors, validate, getFieldError, touchField } = useFormValidation(merchantSubmissionSchema);
 *
 * const handleSubmit = async () => {
 *   if (!validate(formData)) {
 *     console.log('Validation errors:', errors);
 *     return;
 *   }
 *   // Submit form
 * };
 *
 * <input
 *   onBlur={() => touchField('businessName')}
 *   onChange={(e) => setFormData({...formData, businessName: e.target.value})}
 * />
 * {getFieldError('businessName') && <span>{getFieldError('businessName')}</span>}
 */
