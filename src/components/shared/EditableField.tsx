import React, { useState, useEffect, ChangeEvent } from "react";
import { Pencil, Save, X } from "lucide-react";

type FieldType = "text" | "textarea" | "number" | "email";

interface EditableFieldProps {
  initialValue: string;
  fieldName: string;
  onSave: (fieldName: string, value: string) => Promise<void>;
  type?: FieldType;
  isAdmin?: boolean;
  placeholder?: string;
  className?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

interface ValidationError {
  hasError: boolean;
  message: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  initialValue,
  fieldName,
  onSave,
  type = "text",
  isAdmin = false,
  placeholder = "",
  className = "",
  validation,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(initialValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ValidationError>({ hasError: false, message: "" });

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const validateField = (value: string): ValidationError => {
    if (!validation) return { hasError: false, message: "" };

    if (validation.required && !value) {
      return { hasError: true, message: "Ce champ est requis" };
    }

    if (validation.minLength && value.length < validation.minLength) {
      return {
        hasError: true,
        message: `Minimum ${validation.minLength} caractères requis`,
      };
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return {
        hasError: true,
        message: `Maximum ${validation.maxLength} caractères autorisés`,
      };
    }

    if (validation.pattern && !validation.pattern.test(value)) {
      return {
        hasError: true,
        message: "Format invalide",
      };
    }

    return { hasError: false, message: "" };
  };

  const handleEdit = (): void => {
    if (isAdmin) {
      setIsEditing(true);
    }
  };

  const handleCancel = (): void => {
    setValue(initialValue);
    setIsEditing(false);
    setError({ hasError: false, message: "" });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const newValue = e.target.value;
    setValue(newValue);
    const validationResult = validateField(newValue);
    setError(validationResult);
  };

  const handleSave = async (): Promise<void> => {
    const validationResult = validateField(value);
    if (validationResult.hasError) {
      setError(validationResult);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(fieldName, value);
      setIsEditing(false);
      setError({ hasError: false, message: "" });
    } catch (error) {
      setError({
        hasError: true,
        message: "Erreur lors de la sauvegarde",
      });
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className={`group relative inline-block ${className}`}>
        <div className="min-w-[100px] p-2">
          {type === "textarea" ? (
            <div className="whitespace-pre-wrap">{value || placeholder}</div>
          ) : (
            <span>{value || placeholder}</span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={handleEdit}
            className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Modifier"
            type="button"
          >
            <Pencil className="w-4 h-4 text-gray-600 hover:text-blue-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${error.hasError ? "border-red-500" : "border-gray-300"}`}
            rows={4}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={handleChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${error.hasError ? "border-red-500" : "border-gray-300"}`}
            placeholder={placeholder}
          />
        )}
        <div className="flex gap-1">
          <button
            onClick={handleSave}
            disabled={isLoading || error.hasError}
            className="p-1 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
            title="Sauvegarder"
            type="button"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="p-1 text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
            title="Annuler"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {error.hasError && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default EditableField;
