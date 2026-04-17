export interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: ValidationRule;
  options?: string[]; // For select, radio, checkbox groups
  properties: Record<string, any>;
}

export type FormElementType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file';

export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  customMessage?: string;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormBuilderState {
  formSchema: FormSchema;
  selectedElementId: string | null;
  previewMode: boolean;
  draggedElement: FormElementType | null;
}

export interface DragItem {
  type: 'element';
  elementType: FormElementType;
}

