import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPost, updatePost } from '../services/posts';
import { getAllCategories, LibraryCategory } from '../services/categories';
import { Post } from '../types';
import { useAuth } from '../contexts/AuthContext';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  tags: z.string().optional(),
  published: z.boolean().default(false),
  featuredImage: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

interface PostEditorProps {
  post: Post | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [featuredImage, setFeaturedImage] = useState<string>(post?.featuredImage || '');
  const [categories, setCategories] = useState<LibraryCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      categoryId: post?.categoryId || '',
      tags: post?.tags?.join(', ') || '',
      published: post?.published || false,
      featuredImage: post?.featuredImage || '',
    }
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content,
        categoryId: post.categoryId || '',
        tags: post.tags?.join(', ') || '',
        published: post.published,
        featuredImage: post.featuredImage,
      });
      setFeaturedImage(post.featuredImage || '');
    }
  }, [post, reset]);

  const onSubmit = async (data: PostFormData) => {
    if (!user || !userProfile) return;

    setLoading(true);
    try {
      const tags = data.tags
        ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const postData = {
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        authorId: user.uid,
        authorName: userProfile.displayName || user.email || 'Anonymous',
        tags,
        published: data.published,
        featuredImage,
        createdAt: post?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (post) {
        await updatePost(post.id, postData);
        toast.success('Post updated successfully');
      } else {
        await createPost(postData);
        toast.success('Post created successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = (url: string) => {
    setFeaturedImage(url);
    setValue('featuredImage', url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              {...register('categoryId')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
            <div className="space-y-4">
              <ImageUpload 
                onImageUploaded={handleFeaturedImageUpload}
                buttonText="Upload Featured Image"
              />
              {featuredImage && (
                <div className="relative w-full h-48">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage('');
                      setValue('featuredImage', '');
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <RichTextEditor value={value} onChange={onChange} />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              placeholder="tag1, tag2, tag3"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('published')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Publish post
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}