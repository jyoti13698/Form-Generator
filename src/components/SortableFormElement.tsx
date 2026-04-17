import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { FormElement } from '../types';
import { useFormBuilderStore } from '../store/formBuilderStore';
import { FormElementRenderer } from './FormElementRenderer';
import './SortableFormElement.css';

interface SortableFormElementProps {
  element: FormElement;
  previewMode: boolean;
}

export const SortableFormElement: React.FC<SortableFormElementProps> = ({
  element,
  previewMode,
}) => {
  const { selectedElementId, selectElement, removeElement } = useFormBuilderStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedElementId === element.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`sortable-element ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={() => !previewMode && selectElement(element.id)}
      role={previewMode ? undefined : 'button'}
      tabIndex={previewMode ? -1 : 0}
      onKeyDown={(event) => {
        if (!previewMode && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          selectElement(element.id);
        }
      }}
    >
      {!previewMode && (
        <div className="element-controls">
          <button
            type="button"
            className="drag-handle"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder field"
          >
            ::
          </button>
          <button
            type="button"
            className="remove-btn"
            onClick={(event) => {
              event.stopPropagation();
              removeElement(element.id);
            }}
            aria-label="Remove field"
          >
            x
          </button>
        </div>
      )}
      <div className="element-content">
        <FormElementRenderer element={element} previewMode={previewMode} />
      </div>
    </div>
  );
};
