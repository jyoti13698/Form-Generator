import React from 'react';
import { ElementLibrary } from './ElementLibrary';
import { FormCanvas } from './FormCanvas';
import { PropertyPanel } from './PropertyPanel';
import { Toolbar } from './Toolbar';
import './FormBuilder.css';

export const FormBuilder: React.FC = () => {
  return (
    <div className="form-builder">
      <Toolbar />
      <div className="form-builder-content">
        <ElementLibrary />
        <FormCanvas />
        <PropertyPanel />
      </div>
    </div>
  );
};

