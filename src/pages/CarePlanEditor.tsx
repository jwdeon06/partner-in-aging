import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCarePlan, updateCarePlan } from '../services/carePlans';
import { CarePlan } from '../types';
import RichTextEditor from '../components/RichTextEditor';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

const carePlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string().min(1, 'Duration is required'),
  recommendedFor: z.array(z.string()).min(1, 'At least one recommendation is required'),
  tasks: z.array(z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string(),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'as-needed'])
  })).min(1, 'At least one task is required'),
  published: z.boolean().default(false),
  featuredImage: z.string().optional()
});

type CarePlanFormData = z.infer<typeof carePlanSchema>;

interface CarePlanEditorProps {
  plan?: CarePlan;
}

export default function CarePlanEditor({ plan }: CarePlanEditorProps) {
  const navigate = useNavigate();
  const { register, control, handleSubmit, formState: { errors }, setValue, watch } = useForm<CarePlanFormData>({
    resolver: zodResolver(carePlanSchema),
    defaultValues: plan || {
      tasks: [{ title: '', description: '', frequency: 'daily' }],
      recommendedFor: [''],
      published: false
    }
  });

  const { fields: taskFields, append: appendTask, remove: removeTask } = useFieldArray({
    control,
    name: 'tasks'
  });

  const { fields: recommendationFields, append: appendRecommendation, remove: removeRecommendation } = useFieldArray({
    control,
    name: 'recommendedFor'
  });

  const onSubmit = async (data: CarePlanFormData) => {
    try {
      if (plan) {
        await updateCarePlan(plan.id, data);
        toast.success('Care plan updated successfully');
      } else {
        await createCarePlan(data);
        toast.success('Care plan created successfully');
      }
      navigate('/admin/care-plans');
    } catch (error) {
      console.error('Error saving care plan:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {plan ? 'Edit Care Plan' : 'Create New Care Plan'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Featured Image</label>
            <ImageUpload
              onImageUploaded={(url) => setValue('featuredImage', url)}
              buttonText="Upload Featured Image"
            />
            {watch('featuredImage') && (
              <img
                src={watch('featuredImage')}
                alt="Featured"
                className="mt-2 w-full h-48 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Difficulty</label>
              <select
                {...register('difficulty')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="text"
                {...register('duration')}
                placeholder="e.g., 4 weeks"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recommended For</label>
            {recommendationFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                  {...register(`recommendedFor.${index}`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="e.g., Family caregivers"
                />
                <button
                  type="button"
                  onClick={() => removeRecommendation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendRecommendation('')}
              className="mt-2 text-primary-500 hover:text-primary-700"
            >
              + Add Recommendation
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tasks</label>
            {taskFields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="space-y-4">
                  <input
                    {...register(`tasks.${index}.title`)}
                    placeholder="Task title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <textarea
                    {...register(`tasks.${index}.description`)}
                    placeholder="Task description"
                    rows={2}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <div className="flex justify-between items-center">
                    <select
                      {...register(`tasks.${index}.frequency`)}
                      className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="as-needed">As Needed</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Task
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendTask({ title: '', description: '', frequency: 'daily' })}
              className="text-primary-500 hover:text-primary-700"
            >
              + Add Task
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Detailed Content</label>
            <RichTextEditor
              value={watch('content')}
              onChange={(value) => setValue('content', value)}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('published')}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Publish this care plan
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/care-plans')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            {plan ? 'Update Care Plan' : 'Create Care Plan'}
          </button>
        </div>
      </form>
    </div>
  );
}