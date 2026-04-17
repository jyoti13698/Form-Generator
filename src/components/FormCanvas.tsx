import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilderStore } from '../store/formBuilderStore';
import { SortableFormElement } from './SortableFormElement';
import './FormCanvas.css';

export const FormCanvas: React.FC = () => {
  const { formSchema, previewMode } = useFormBuilderStore();
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-canvas',
  });

  return (
    <div className="form-canvas-container">
      <div
        ref={setNodeRef}
        className={`form-canvas ${isOver ? 'drag-over' : ''} ${previewMode ? 'preview-mode' : ''}`}
      >
        <div className="canvas-header">
          <h3>{previewMode ? 'Form Preview' : 'Form Builder'}</h3>
          {!previewMode && (
            <p className="canvas-instructions">
              Drag elements from the left panel to build your form
            </p>
          )}
        </div>

        <div className="form-elements-container">
          {formSchema.elements.length === 0 ? (
            <div className="empty-canvas">
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <h4>Start Building Your Form</h4>
                <p>Drag form elements from the left panel to get started</p>
              </div>
            </div>
          ) : (
            <SortableContext
              items={formSchema.elements.map(el => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {formSchema.elements.map((element) => (
                <SortableFormElement
                  key={element.id}
                  element={element}
                  previewMode={previewMode}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};
