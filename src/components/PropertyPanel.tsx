import React, { useState, useEffect } from 'react';
import { useFormBuilderStore } from '../store/formBuilderStore';
import { FormElement } from '../types';
import './PropertyPanel.css';

export const PropertyPanel: React.FC = () => {
  const { formSchema, selectedElementId, updateElement, updateFormTitle, updateFormDescription } = useFormBuilderStore();
  const [localTitle, setLocalTitle] = useState(formSchema.title);
  const [localDescription, setLocalDescription] = useState(formSchema.description || '');

  const selectedElement = formSchema.elements.find(el => el.id === selectedElementId);

  useEffect(() => {
    setLocalTitle(formSchema.title);
  }, [formSchema.title]);

  useEffect(() => {
    setLocalDescription(formSchema.description || '');
  }, [formSchema.description]);

  const handleTitleChange = (value: string) => {
    setLocalTitle(value);
    updateFormTitle(value);
  };

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    updateFormDescription(value);
  };

  const handleElementUpdate = (updates: Partial<FormElement>) => {
    if (selectedElementId) {
      updateElement(selectedElementId, updates);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!selectedElement?.options) return;
    const newOptions = [...selectedElement.options];
    newOptions[index] = value;
    handleElementUpdate({ options: newOptions });
  };

  const addOption = () => {
    if (!selectedElement?.options) return;
    handleElementUpdate({ options: [...selectedElement.options, 'New Option'] });
  };

  const removeOption = (index: number) => {
    if (!selectedElement?.options) return;
    const newOptions = selectedElement.options.filter((_, i) => i !== index);
    handleElementUpdate({ options: newOptions });
  };

  return (
    <div className="property-panel">
      <h3>Properties</h3>
      
      <div className="property-section">
        <h4>Form Settings</h4>
        <div className="property-field">
          <label>Form Title</label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter form title"
          />
        </div>
        <div className="property-field">
          <label>Description</label>
          <textarea
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Enter form description"
            rows={3}
          />
        </div>
      </div>

      {selectedElement && (
        <div className="property-section">
          <h4>Element Properties</h4>
          
          <div className="property-field">
            <label>Label</label>
            <input
              type="text"
              value={selectedElement.label}
              onChange={(e) => handleElementUpdate({ label: e.target.value })}
            />
          </div>

          <div className="property-field">
            <label>Placeholder</label>
            <input
              type="text"
              value={selectedElement.placeholder || ''}
              onChange={(e) => handleElementUpdate({ placeholder: e.target.value })}
            />
          </div>

          <div className="property-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedElement.required}
                onChange={(e) => handleElementUpdate({ required: e.target.checked })}
              />
              Required Field
            </label>
          </div>

          {(selectedElement.type === 'select' || selectedElement.type === 'radio') && (
            <div className="property-field">
              <label>Options</label>
              {selectedElement.options?.map((option, index) => (
                <div key={index} className="option-row">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="remove-option-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOption} className="add-option-btn">
                + Add Option
              </button>
            </div>
          )}

          {selectedElement.type === 'textarea' && (
            <div className="property-field">
              <label>Rows</label>
              <input
                type="number"
                value={selectedElement.properties?.rows || 3}
                onChange={(e) => handleElementUpdate({
                  properties: { ...selectedElement.properties, rows: parseInt(e.target.value) }
                })}
                min="1"
                max="10"
              />
            </div>
          )}

          {selectedElement.type === 'file' && (
            <div className="property-field">
              <label>Accept File Types</label>
              <input
                type="text"
                value={selectedElement.properties?.accept || '*'}
                onChange={(e) => handleElementUpdate({
                  properties: { ...selectedElement.properties, accept: e.target.value }
                })}
                placeholder="e.g., .pdf,.doc,.docx"
              />
            </div>
          )}
        </div>
      )}

      {!selectedElement && (
        <div className="no-selection">
          <p>Select an element to edit its properties</p>
        </div>
      )}
    </div>
  );
};

