import React from 'react';
import { FormElement } from '../types';
import './FormElementRenderer.css';

interface FormElementRendererProps {
  element: FormElement;
  previewMode: boolean;
}

export const FormElementRenderer: React.FC<FormElementRendererProps> = ({
  element,
}) => {
  const renderElement = () => {
    const baseProps = {
      id: element.id,
      name: element.id,
      placeholder: element.placeholder,
      required: element.required,
      className: 'form-field',
    };

    switch (element.type) {
      case 'text':
        return <input {...baseProps} type="text" />;
      
      case 'email':
        return <input {...baseProps} type="email" />;
      
      case 'password':
        return <input {...baseProps} type="password" />;
      
      case 'number':
        return (
          <input
            {...baseProps}
            type="number"
            min={element.validation?.min}
            max={element.validation?.max}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={element.properties?.rows || 3}
            minLength={element.validation?.minLength}
            maxLength={element.validation?.maxLength}
          />
        );
      
      case 'select':
        return (
          <select {...baseProps}>
            <option value="">Choose an option</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="checkbox-group">
            <input
              {...baseProps}
              type="checkbox"
              id={`${element.id}-checkbox`}
            />
            <label htmlFor={`${element.id}-checkbox`}>
              {element.label}
            </label>
          </div>
        );
      
      case 'radio':
        return (
          <div className="radio-group">
            <fieldset>
              <legend>{element.label}</legend>
              {element.options?.map((option, index) => (
                <div key={index} className="radio-option">
                  <input
                    type="radio"
                    id={`${element.id}-${index}`}
                    name={element.id}
                    value={option}
                  />
                  <label htmlFor={`${element.id}-${index}`}>
                    {option}
                  </label>
                </div>
              ))}
            </fieldset>
          </div>
        );
      
      case 'date':
        return <input {...baseProps} type="date" />;
      
      case 'file':
        return (
          <input
            {...baseProps}
            type="file"
            accept={element.properties?.accept}
          />
        );
      
      default:
        return <input {...baseProps} type="text" />;
    }
  };

  return (
    <div className="form-element">
      {element.type !== 'checkbox' && element.type !== 'radio' && (
        <label htmlFor={element.id} className="field-label">
          {element.label}
          {element.required && <span className="required">*</span>}
        </label>
      )}
      {renderElement()}
      {element.validation?.customMessage && (
        <div className="validation-message">
          {element.validation.customMessage}
        </div>
      )}
    </div>
  );
};
