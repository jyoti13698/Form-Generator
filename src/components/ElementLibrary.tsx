import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FormElementType } from '../types';
import './ElementLibrary.css';

interface DraggableElementProps {
  elementType: FormElementType;
  icon: string;
  label: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ elementType, icon, label }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `element-${elementType}`,
    data: {
      type: 'element',
      elementType,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-element ${isDragging ? 'dragging' : ''}`}
      {...listeners}
      {...attributes}
    >
      <span className="element-icon">{icon}</span>
      <span className="element-label">{label}</span>
    </div>
  );
};

export const ElementLibrary: React.FC = () => {
  const elements: Array<{ type: FormElementType; icon: string; label: string }> = [
    { type: 'text', icon: '📝', label: 'Text Input' },
    { type: 'email', icon: '📧', label: 'Email' },
    { type: 'password', icon: '🔒', label: 'Password' },
    { type: 'number', icon: '🔢', label: 'Number' },
    { type: 'textarea', icon: '📄', label: 'Text Area' },
    { type: 'select', icon: '📋', label: 'Select' },
    { type: 'checkbox', icon: '☑️', label: 'Checkbox' },
    { type: 'radio', icon: '🔘', label: 'Radio' },
    { type: 'date', icon: '📅', label: 'Date' },
    { type: 'file', icon: '📁', label: 'File Upload' },
  ];

  return (
    <div className="element-library">
      <h3>Form Elements</h3>
      <div className="elements-grid">
        {elements.map((element) => (
          <DraggableElement
            key={element.type}
            elementType={element.type}
            icon={element.icon}
            label={element.label}
          />
        ))}
      </div>
    </div>
  );
};

