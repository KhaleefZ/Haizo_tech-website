'use client';

import { useState } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from '@/store/useAppStore';

export interface BlogItem {
  id: string;
  title: string;
  content: string;
  published: boolean;
  imageUrl?: string;
  tags?: string[];
  category?: string;
  createdAt?: string;
}

interface BlogEditorModalProps {
  blog?: BlogItem;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function BlogEditorModal({ blog, trigger, onSuccess }: BlogEditorModalProps) {
  const [open, setOpen] = useState(false);
  const { role } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const [formData, setFormData] = useState<Partial<BlogItem>>({
    title: blog?.title || '',
    content: blog?.content || '',
    tags: blog?.tags || [],
    imageUrl: blog?.imageUrl || '',
    category: blog?.category || '',
    published: blog?.published ?? false,
  });
  const [uploading, setUploading] = useState(false);

  const isDev = role === 'DEV';
  const isEditing = !!blog;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    setUploading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formDataObj,
      });
      if (res.ok) {
        const { imageUrl } = await res.json();
        setFormData({ ...formData, imageUrl });
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      if (imageUrl.startsWith('/uploads/')) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ imageUrl })
        });
      }
      setFormData({ ...formData, imageUrl: '' });
    } catch (error) {
      console.error('Failed to remove image', error);
      alert('Failed to remove image');
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const url = isEditing ? `${process.env.NEXT_PUBLIC_API_URL}/api/blogs/${blog?.id}` : `${process.env.NEXT_PUBLIC_API_URL}/api/blogs`;
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
          imageUrl: formData.imageUrl,
          category: formData.category,
          published: formData.published
        })
      });

      if (!res.ok) throw new Error('Failed to save blog');
      
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      alert('Error saving blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger ? (trigger as React.ReactElement) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Post
          </Button>
        )
      } />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Blog Post' : 'Create New Post'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-2 bg-white/5">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit" className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right text-sm font-medium">Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. The Future of AI"
                className="col-span-3 bg-white/5 border-white/10"
                disabled={isDev || loading} 
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <label htmlFor="content" className="text-right text-sm font-medium pt-3">Content</label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your blog post content here..."
                className="col-span-3 bg-white/5 border-white/10 min-h-[200px]"
                disabled={isDev || loading}
              />
            </div>

            <div className="grid gap-2 grid-cols-4 items-center gap-4">
              <label htmlFor="image" className="text-right text-sm font-medium">Cover Image</label>
              <div className="col-span-3">
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-white/5 border-white/10" 
                  disabled={uploading || isDev}
                />
                {uploading && <p className="text-xs text-blue-400 mt-1">Uploading...</p>}
                {formData.imageUrl && (
                  <div className="relative group inline-block mt-2">
                    <img src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${formData.imageUrl}`} alt="Preview" className="h-24 w-auto rounded border border-white/10 object-cover" />
                    {!isDev && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(formData.imageUrl!)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="category" className="text-right text-sm font-medium">Category</label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g. Technology"
                className="col-span-3 bg-white/5 border-white/10"
                disabled={isDev || loading}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="tags" className="text-right text-sm font-medium">Tags</label>
              <Input
                id="tags"
                value={formData.tags?.join(', ')}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }))}
                placeholder="e.g. Tech, AI, Cloud (comma separated)"
                className="col-span-3 bg-white/5 border-white/10"
                disabled={isDev || loading}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3 flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="published" 
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  disabled={isDev || loading}
                  className="rounded border-white/10 bg-white/5 text-primary focus:ring-primary"
                />
                <label htmlFor="published" className="text-sm font-medium">Published</label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="py-4">
            <div className="glass-panel p-6 border-white/10 bg-background/50 rounded-xl max-h-[60vh] overflow-y-auto">
              {formData.imageUrl && (
                <img src={formData.imageUrl.startsWith('http') ? formData.imageUrl : `${process.env.NEXT_PUBLIC_API_URL}${formData.imageUrl}`} alt={formData.title} className="w-full h-64 object-cover rounded-xl mb-6" />
              )}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                  {formData.category || 'Category'}
                </span>
                <span className="text-sm text-muted-foreground">Preview Mode</span>
              </div>
              <h1 className="text-3xl font-bold mb-4">{formData.title || 'Untitled Post'}</h1>
              <div className="prose prose-invert max-w-none text-foreground whitespace-pre-wrap">
                {formData.content || 'Start writing your content...'}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {isDev && (
            <p className="text-xs text-destructive mr-auto flex items-center">
              Devs cannot modify blog items.
            </p>
          )}
          <Button type="button" disabled={isDev || loading} onClick={() => handleSubmit()}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
