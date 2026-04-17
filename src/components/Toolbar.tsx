import React from 'react';
import { useFormBuilderStore } from '../store/formBuilderStore';
import './Toolbar.css';

export const Toolbar: React.FC = () => {
  const { previewMode, togglePreviewMode, formSchema, exportToJSON } = useFormBuilderStore();

  const handleExport = () => {
    const jsonData = exportToJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formSchema.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h2>{formSchema.title}</h2>
        {formSchema.description && (
          <p className="form-description">{formSchema.description}</p>
        )}
      </div>
      <div className="toolbar-right">
        <button
          className={`preview-toggle ${previewMode ? 'active' : ''}`}
          onClick={togglePreviewMode}
        >
          {previewMode ? 'Edit Mode' : 'Preview Mode'}
        </button>
        <button className="export-btn" onClick={handleExport}>
          Export JSON
        </button>
      </div>
    </div>
  );
};

