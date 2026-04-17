import { useMemo, useState } from 'react';
import './App.css';

type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio';

interface FieldValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
}

interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  validations: FieldValidation;
}

interface FieldDraft {
  formName: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: FieldType;
  placeholder: string;
  optionsInput: string;
  required: boolean;
  minLength: string;
  maxLength: string;
}

const defaultDraft: FieldDraft = {
  formName: 'Customer Details',
  fieldName: '',
  fieldLabel: '',
  fieldType: 'text',
  placeholder: '',
  optionsInput: '',
  required: false,
  minLength: '',
  maxLength: '',
};

const dragTypes: Array<{ type: FieldType; label: string }> = [
  { type: 'text', label: 'Text' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'date', label: 'Date' },
  { type: 'textarea', label: 'Textarea' },
  { type: 'select', label: 'Select' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'radio', label: 'Radio' },
];

const createFieldFromType = (type: FieldType): FormField => {
  const normalizedName = `${type}_${Date.now()}`;
  return {
    id: crypto.randomUUID(),
    type,
    name: normalizedName,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    placeholder: type === 'checkbox' || type === 'radio' ? '' : `Enter ${type}`,
    options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    validations: { required: false },
  };
};

function App() {
  const [draft, setDraft] = useState<FieldDraft>(defaultDraft);
  const [fields, setFields] = useState<FormField[]>([]);
  const [mode, setMode] = useState<'preview' | 'json'>('preview');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | boolean>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<string>('');

  const formName = draft.formName.trim() || 'Untitled Form';

  const resetApplication = () => {
    setDraft(defaultDraft);
    setFields([]);
    setMode('preview');
    setSelectedFieldId(null);
    setEditingFieldId(null);
    setFormValues({});
    setFormErrors({});
    setSubmitMessage('');
  };

  const resetDraftFields = () => {
    setDraft((prevDraft) => ({
      ...prevDraft,
      fieldName: '',
      fieldLabel: '',
      placeholder: '',
      optionsInput: '',
      required: false,
      minLength: '',
      maxLength: '',
      fieldType: 'text',
    }));
  };

  const handleSaveField = () => {
    if (!draft.fieldName.trim()) {
      return;
    }

    const type = draft.fieldType;
    const options =
      type === 'select' || type === 'radio'
        ? draft.optionsInput
            .split(',')
            .map((option) => option.trim())
            .filter(Boolean)
        : undefined;

    const validations: FieldValidation = {
      required: draft.required,
      ...(draft.minLength ? { minLength: Number(draft.minLength) } : {}),
      ...(draft.maxLength ? { maxLength: Number(draft.maxLength) } : {}),
    };

    const field: FormField = {
      id: crypto.randomUUID(),
      name: draft.fieldName.trim(),
      label: draft.fieldLabel.trim() || draft.fieldName.trim(),
      type,
      placeholder: draft.placeholder.trim(),
      options,
      validations,
    };

    if (editingFieldId) {
      setFields((prevFields) =>
        prevFields.map((existingField) =>
          existingField.id === editingFieldId ? { ...field, id: editingFieldId } : existingField,
        ),
      );
      setEditingFieldId(null);
      setSelectedFieldId(editingFieldId);
    } else {
      setFields((prevFields) => [...prevFields, field]);
      setSelectedFieldId(field.id);
    }

    resetDraftFields();
  };

  const handleDropType = (droppedType: FieldType) => {
    const quickField = createFieldFromType(droppedType);
    setFields((prevFields) => [...prevFields, quickField]);
    setSelectedFieldId(quickField.id);
  };

  const handleEditField = (fieldId: string) => {
    const targetField = fields.find((field) => field.id === fieldId);
    if (!targetField) {
      return;
    }

    setSelectedFieldId(fieldId);
    setEditingFieldId(fieldId);
    setDraft((prevDraft) => ({
      ...prevDraft,
      fieldName: targetField.name,
      fieldLabel: targetField.label,
      fieldType: targetField.type,
      placeholder: targetField.placeholder || '',
      optionsInput: (targetField.options || []).join(', '),
      required: targetField.validations.required,
      minLength: targetField.validations.minLength?.toString() || '',
      maxLength: targetField.validations.maxLength?.toString() || '',
    }));
  };

  const handleDeleteField = (fieldId: string) => {
    const targetField = fields.find((field) => field.id === fieldId);
    if (!targetField) {
      return;
    }

    const shouldDelete = window.confirm(`Delete "${targetField.label}" field?`);
    if (!shouldDelete) {
      return;
    }

    setFields((prevFields) => prevFields.filter((field) => field.id !== fieldId));
    setFormValues((prevValues) => {
      const updatedValues = { ...prevValues };
      delete updatedValues[fieldId];
      return updatedValues;
    });
    setFormErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[fieldId];
      return updatedErrors;
    });
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
    if (editingFieldId === fieldId) {
      setEditingFieldId(null);
      resetDraftFields();
    }
  };

  const handleReorderField = (fieldId: string, direction: 'up' | 'down') => {
    setFields((prevFields) => {
      const currentIndex = prevFields.findIndex((field) => field.id === fieldId);
      if (currentIndex === -1) {
        return prevFields;
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= prevFields.length) {
        return prevFields;
      }

      const reorderedFields = [...prevFields];
      const [movedField] = reorderedFields.splice(currentIndex, 1);
      reorderedFields.splice(targetIndex, 0, movedField);
      return reorderedFields;
    });
  };

  const handlePreviewValueChange = (field: FormField, value: string | boolean) => {
    setFormValues((prevValues) => ({ ...prevValues, [field.id]: value }));
    setSubmitMessage('');
    setFormErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };
      delete nextErrors[field.id];
      return nextErrors;
    });
  };

  const handleValidatePreview = () => {
    setSubmitMessage('');
    const nextErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const rawValue = formValues[field.id];
      const stringValue = typeof rawValue === 'string' ? rawValue.trim() : '';
      const isEmpty = field.type === 'checkbox' ? !rawValue : stringValue.length === 0;

      if (field.validations.required && isEmpty) {
        nextErrors[field.id] = `${field.label} is required.`;
        return;
      }
      if (
        typeof rawValue === 'string' &&
        field.validations.minLength &&
        rawValue.length < field.validations.minLength
      ) {
        nextErrors[field.id] = `${field.label} must be at least ${field.validations.minLength} characters.`;
        return;
      }
      if (
        typeof rawValue === 'string' &&
        field.validations.maxLength &&
        rawValue.length > field.validations.maxLength
      ) {
        nextErrors[field.id] = `${field.label} must be at most ${field.validations.maxLength} characters.`;
      }
    });

    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitMessage('Form submitted successfully.');
      window.alert('Form submitted successfully.');
      resetApplication();
    }
  };

  const generatedSchema = useMemo(
    () => ({
      formName,
      fields: fields.map((field) => ({
        name: field.name,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder || undefined,
        options: field.options,
        validations: field.validations,
      })),
    }),
    [fields, formName],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Form Generator</h1>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>1. Field Builder</h2>
          <label>
            Form Name
            <input
              value={draft.formName}
              onChange={(event) => setDraft({ ...draft, formName: event.target.value })}
            />
          </label>
          <label>
            Field Name
            <input
              value={draft.fieldName}
              onChange={(event) => setDraft({ ...draft, fieldName: event.target.value })}
              placeholder="example: firstName"
            />
          </label>
          <label>
            Field Label
            <input
              value={draft.fieldLabel}
              onChange={(event) => setDraft({ ...draft, fieldLabel: event.target.value })}
              placeholder="example: First Name"
            />
          </label>
          <label>
            Field Type
            <select
              value={draft.fieldType}
              onChange={(event) =>
                setDraft({ ...draft, fieldType: event.target.value as FieldType })
              }
            >
              {dragTypes.map((item) => (
                <option key={item.type} value={item.type}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Placeholder
            <input
              value={draft.placeholder}
              onChange={(event) => setDraft({ ...draft, placeholder: event.target.value })}
              placeholder="Enter placeholder text"
            />
          </label>
          {(draft.fieldType === 'select' || draft.fieldType === 'radio') && (
            <label>
              Options (comma-separated)
              <input
                value={draft.optionsInput}
                onChange={(event) => setDraft({ ...draft, optionsInput: event.target.value })}
                placeholder="Option 1, Option 2"
              />
            </label>
          )}
          <div className="validation-row">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={draft.required}
                onChange={(event) => setDraft({ ...draft, required: event.target.checked })}
              />
              Required
            </label>
            <input
              type="number"
              value={draft.minLength}
              onChange={(event) => setDraft({ ...draft, minLength: event.target.value })}
              placeholder="Min length"
            />
            <input
              type="number"
              value={draft.maxLength}
              onChange={(event) => setDraft({ ...draft, maxLength: event.target.value })}
              placeholder="Max length"
            />
          </div>
          <button className="primary-button" onClick={handleSaveField}>
            {editingFieldId ? 'Update Field' : 'Add Field'}
          </button>
          {editingFieldId && (
            <button
              className="secondary-button"
              onClick={() => {
                setEditingFieldId(null);
                resetDraftFields();
              }}
            >
              Cancel Edit
            </button>
          )}

          <div className="drag-library">
            <p>Or drag and drop a quick field:</p>
            <div className="chips">
              {dragTypes.map((item) => (
                <button
                  key={item.type}
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('fieldType', item.type)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          className="panel"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            const droppedType = event.dataTransfer.getData('fieldType') as FieldType;
            if (droppedType) {
              handleDropType(droppedType);
            }
          }}
        >
          <h2>2. Selected Fields</h2>
          {fields.length === 0 ? (
            <p className="empty">No fields added yet.</p>
          ) : (
            <ul className="field-list">
              {fields.map((field) => (
                <li
                  key={field.id}
                  className={selectedFieldId === field.id ? 'selected-item' : ''}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <strong>{field.label}</strong>
                  <span>{field.type}</span>
                  <div className="field-actions">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleReorderField(field.id, 'up');
                      }}
                    >
                      Move Up
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleReorderField(field.id, 'down');
                      }}
                    >
                      Move Down
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEditField(field.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteField(field.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <h2>3. Output</h2>
          <div className="output-actions">
            <button
              className={mode === 'preview' ? 'active' : ''}
              onClick={() => setMode('preview')}
            >
              Preview
            </button>
            <button className={mode === 'json' ? 'active' : ''} onClick={() => setMode('json')}>
              JSON
            </button>
          </div>

          {mode === 'preview' ? (
            <div className="preview-box">
              <h3>{formName}</h3>
              {fields.map((field) => (
                <div key={field.id} className="preview-field">
                  <label>
                    {field.label}
                    {field.validations.required ? ' *' : ''}
                  </label>
                  {field.type === 'textarea' && (
                    <textarea
                      placeholder={field.placeholder || field.label}
                      value={(formValues[field.id] as string) || ''}
                      onChange={(event) => handlePreviewValueChange(field, event.target.value)}
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={(formValues[field.id] as string) || ''}
                      onChange={(event) => handlePreviewValueChange(field, event.target.value)}
                    >
                      <option value="">Select option</option>
                      {(field.options || ['Option 1']).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === 'checkbox' && (
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(formValues[field.id])}
                        onChange={(event) => handlePreviewValueChange(field, event.target.checked)}
                      />{' '}
                      {field.label}
                    </label>
                  )}
                  {field.type === 'radio' && (
                    <div className="radio-group">
                      {(field.options || ['Option 1']).map((option) => (
                        <label key={option} className="radio-option">
                          <input
                            type="radio"
                            name={field.id}
                            value={option}
                            checked={formValues[field.id] === option}
                            onChange={(event) => handlePreviewValueChange(field, event.target.value)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  {!['textarea', 'select', 'checkbox', 'radio'].includes(field.type) && (
                    <input
                      type={field.type}
                      placeholder={field.placeholder || field.label}
                      value={(formValues[field.id] as string) || ''}
                      onChange={(event) => handlePreviewValueChange(field, event.target.value)}
                    />
                  )}
                  {formErrors[field.id] && <p className="field-error">{formErrors[field.id]}</p>}
                </div>
              ))}
              {fields.length > 0 && (
                <>
                  <button className="validate-button" onClick={handleValidatePreview}>
                    Validate Form
                  </button>
                  {submitMessage && <p className="submit-message">{submitMessage}</p>}
                </>
              )}
            </div>
          ) : (
            <pre className="json-box">{JSON.stringify(generatedSchema, null, 2)}</pre>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
