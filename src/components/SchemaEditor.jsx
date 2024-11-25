import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';

const INITIAL_FIELD = {
  name: '',
  label: '',
  type: 'text',
  required: false,
  options: [],
  validation: null
};

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' }
];

const SortableField = ({ field, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-medium">{field.label}</h4>
          <p className="text-sm text-gray-500">
            Name: {field.name} | Type: {field.type}
            {field.required && ' | Required'}
          </p>
          {field.options?.length > 0 && (
            <p className="text-sm text-gray-500">
              Options: {field.options.join(', ')}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(field)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(field.id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function FieldForm({ field, onSave, onCancel }) {
  const [formData, setFormData] = useState(field);
  const isEditing = Boolean(field.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.label) {
      toast.error('Name and label are required');
      return;
    }

    if (!formData.name.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
      toast.error('Field name must start with a letter and contain only letters and numbers');
      return;
    }

    onSave({
      ...formData,
      id: formData.id || Date.now().toString()
    });
  };

  const needsOptions = ['select', 'multiselect', 'radio'].includes(formData.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., phoneNumber"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Label
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="e.g., Phone Number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ 
              ...formData, 
              type: e.target.value,
              options: e.target.value === formData.type ? formData.options : []
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {FIELD_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="h-4 w-4 text-primary-600 rounded border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Required Field</span>
          </label>
        </div>
        {needsOptions && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (comma-separated)
            </label>
            <input
              type="text"
              value={formData.options.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., option1, option2, option3"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          {isEditing ? 'Update Field' : 'Add Field'}
        </button>
      </div>
    </form>
  );
}

function SchemaEditor({ schema, onSave }) {
  const [fields, setFields] = useState(schema?.fields || []);
  const [editingField, setEditingField] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddField = (newField) => {
    setFields([...fields, newField]);
    setShowForm(false);
    toast.success('Field added successfully');
  };

  const handleUpdateField = (updatedField) => {
    const updatedFields = fields.map(f => 
      f.id === updatedField.id ? updatedField : f
    );
    setFields(updatedFields);
    setEditingField(null);
    toast.success('Field updated successfully');
  };

  const handleDeleteField = (fieldId) => {
    if (!window.confirm('Are you sure you want to delete this field? This action cannot be undone.')) return;
    setFields(fields.filter(f => f.id !== fieldId));
    toast.success('Field deleted successfully');
  };

  const handleSave = () => {
    if (fields.length === 0) {
      toast.error('You must have at least one field in the schema');
      return;
    }
    onSave({ fields });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Add/Edit Field Form */}
      {(showForm || editingField) && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            {editingField ? 'Edit Field' : 'Add New Field'}
          </h3>
          <FieldForm
            field={editingField || INITIAL_FIELD}
            onSave={editingField ? handleUpdateField : handleAddField}
            onCancel={() => {
              setEditingField(null);
              setShowForm(false);
            }}
          />
        </div>
      )}

      {/* Add Field Button */}
      {!showForm && !editingField && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Add New Field
        </button>
      )}

      {/* Field List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Schema Fields</h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  onEdit={() => setEditingField(field)}
                  onDelete={handleDeleteField}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No fields defined yet. Add your first field to get started.</p>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
        >
          Save Schema
        </button>
      </div>
    </div>
  );
}

export default SchemaEditor;