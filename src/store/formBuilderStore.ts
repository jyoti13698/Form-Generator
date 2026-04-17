import { create } from 'zustand';
import { FormBuilderState, FormElement, FormElementType, FormSchema } from '../types';

interface FormBuilderStore extends FormBuilderState {
  // Actions
  addElement: (elementType: FormElementType, position?: number) => void;
  removeElement: (elementId: string) => void;
  updateElement: (elementId: string, updates: Partial<FormElement>) => void;
  selectElement: (elementId: string | null) => void;
  reorderElements: (fromIndex: number, toIndex: number) => void;
  togglePreviewMode: () => void;
  setDraggedElement: (elementType: FormElementType | null) => void;
  updateFormTitle: (title: string) => void;
  updateFormDescription: (description: string) => void;
  exportToJSON: () => string;
}

const createDefaultElement = (type: FormElementType, id: string): FormElement => {
  const baseElement: FormElement = {
    id,
    type,
    label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    required: false,
    properties: {},
  };

  switch (type) {
    case 'text':
    case 'email':
    case 'password':
      return {
        ...baseElement,
        placeholder: `Enter ${type}`,
        validation: { minLength: 1 },
      };
    case 'number':
      return {
        ...baseElement,
        validation: { min: 0 },
      };
    case 'textarea':
      return {
        ...baseElement,
        label: 'Text Area',
        properties: { rows: 3 },
      };
    case 'select':
      return {
        ...baseElement,
        label: 'Select Option',
        options: ['Option 1', 'Option 2', 'Option 3'],
      };
    case 'checkbox':
      return {
        ...baseElement,
        label: 'Checkbox Option',
      };
    case 'radio':
      return {
        ...baseElement,
        label: 'Radio Group',
        options: ['Option A', 'Option B', 'Option C'],
      };
    case 'date':
      return {
        ...baseElement,
        label: 'Date',
      };
    case 'file':
      return {
        ...baseElement,
        label: 'File Upload',
        properties: { accept: '*' },
      };
    default:
      return baseElement;
  }
};

const initialFormSchema: FormSchema = {
  id: 'form-1',
  title: 'Untitled Form',
  description: '',
  elements: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useFormBuilderStore = create<FormBuilderStore>((set, get) => ({
  formSchema: initialFormSchema,
  selectedElementId: null,
  previewMode: false,
  draggedElement: null,

  addElement: (elementType: FormElementType, position?: number) => {
    const { formSchema } = get();
    const newElement = createDefaultElement(elementType, `element-${Date.now()}`);
    
    const updatedElements = [...formSchema.elements];
    const insertPosition = position !== undefined ? position : updatedElements.length;
    updatedElements.splice(insertPosition, 0, newElement);

    set({
      formSchema: {
        ...formSchema,
        elements: updatedElements,
        updatedAt: new Date(),
      },
      selectedElementId: newElement.id,
    });
  },

  removeElement: (elementId: string) => {
    const { formSchema, selectedElementId } = get();
    const updatedElements = formSchema.elements.filter(el => el.id !== elementId);
    
    set({
      formSchema: {
        ...formSchema,
        elements: updatedElements,
        updatedAt: new Date(),
      },
      selectedElementId: selectedElementId === elementId ? null : selectedElementId,
    });
  },

  updateElement: (elementId: string, updates: Partial<FormElement>) => {
    const { formSchema } = get();
    const updatedElements = formSchema.elements.map(el =>
      el.id === elementId ? { ...el, ...updates } : el
    );

    set({
      formSchema: {
        ...formSchema,
        elements: updatedElements,
        updatedAt: new Date(),
      },
    });
  },

  selectElement: (elementId: string | null) => {
    set({ selectedElementId: elementId });
  },

  reorderElements: (fromIndex: number, toIndex: number) => {
    const { formSchema } = get();
    const updatedElements = [...formSchema.elements];
    const [movedElement] = updatedElements.splice(fromIndex, 1);
    updatedElements.splice(toIndex, 0, movedElement);

    set({
      formSchema: {
        ...formSchema,
        elements: updatedElements,
        updatedAt: new Date(),
      },
    });
  },

  togglePreviewMode: () => {
    set(state => ({ previewMode: !state.previewMode }));
  },

  setDraggedElement: (elementType: FormElementType | null) => {
    set({ draggedElement: elementType });
  },

  updateFormTitle: (title: string) => {
    const { formSchema } = get();
    set({
      formSchema: {
        ...formSchema,
        title,
        updatedAt: new Date(),
      },
    });
  },

  updateFormDescription: (description: string) => {
    const { formSchema } = get();
    set({
      formSchema: {
        ...formSchema,
        description,
        updatedAt: new Date(),
      },
    });
  },

  exportToJSON: () => {
    const { formSchema } = get();
    return JSON.stringify(formSchema, null, 2);
  },
}));

