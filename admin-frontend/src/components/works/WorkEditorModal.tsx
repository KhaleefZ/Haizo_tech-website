'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';

export interface WorkItem {
  id: number | string;
  title: string;
  category: string;
  imageUrls: string[];
  liveUrl?: string;
  description: string;
  published?: boolean;
}

interface WorkEditorModalProps {
  work?: WorkItem;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function WorkEditorModal({ work, trigger, onSuccess }: WorkEditorModalProps) {
  const [open, setOpen] = useState(false);
  const { role } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (open) {
      fetchWithAuth('http://localhost:5001/api/work-categories')
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(console.error);
    }
  }, [open]);

  const [formData, setFormData] = useState<Partial<WorkItem>>({
    title: work?.title || '',
    category: work?.category || '',
    description: work?.description || '',
    imageUrls: work?.imageUrls || [],
    liveUrl: work?.liveUrl || '',
    published: work?.published ?? true,
  });
  const [uploading, setUploading] = useState(false);

  const isDev = role === 'DEV';
  const isEditing = !!work;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    setUploading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formDataObj,
      });
      if (res.ok) {
        const { imageUrl } = await res.json();
        setFormData(prev => ({
          ...prev,
          imageUrls: [...(prev.imageUrls || []), imageUrl]
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl: string, index: number) => {
    try {
      if (imageUrl.startsWith('/uploads/')) {
        const filename = imageUrl.split('/').pop();
        await fetchWithAuth(`http://localhost:5001/api/upload/${filename}`, {
          method: 'DELETE'
        });
      }
      
      const newImageUrls = [...(formData.imageUrls || [])];
      newImageUrls.splice(index, 1);
      setFormData({ ...formData, imageUrls: newImageUrls });
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Failed to remove image', error);
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = isEditing ? `http://localhost:5001/api/works/${work.id}` : 'http://localhost:5001/api/works';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetchWithAuth(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          imageUrls: formData.imageUrls,
          liveUrl: formData.liveUrl || null,
          published: formData.published
        })
      });

      if (!res.ok) throw new Error('Failed to save work');
      
      setOpen(false);
      toast.success(isEditing ? 'Portfolio item updated' : 'Portfolio item created');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error saving portfolio item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={trigger ? (trigger as React.ReactElement) : (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Portfolio Item
          </Button>
        )}
      />
      <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Portfolio Item' : 'New Portfolio Item'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modify the details of this portfolio work.' : 'Add a new project to your public frontend portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g. AI Document Processor"
              className="col-span-3 bg-white/5 border-white/10"
              disabled={isDev || loading} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="category" className="text-right text-sm font-medium">
              Category
            </label>
            <select
              className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              disabled={isDev || loading}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="liveUrl" className="text-right text-sm font-medium">
              Live URL
            </label>
            <Input
              id="liveUrl"
              value={formData.liveUrl || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
              placeholder="e.g. https://sriaskresidency.com"
              className="col-span-3 bg-white/5 border-white/10"
              disabled={isDev || loading} 
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium pt-3">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief overview of the project..."
              className="col-span-3 bg-white/5 border-white/10 min-h-[80px] p-2 rounded-md text-sm outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
              disabled={isDev || loading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="image" className="text-sm font-medium">Add Photos (Multiple allowed)</label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-white/5 border-white/10" 
              disabled={uploading || isDev}
            />
            {uploading && <p className="text-xs text-blue-400">Uploading...</p>}
            {formData.imageUrls && formData.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url.startsWith('http') ? url : `http://localhost:5001${url}`} alt="Preview" className="h-20 w-auto rounded border border-white/10 object-cover" />
                    {!isDev && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(url, index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {isDev && (
            <p className="text-xs text-destructive mr-auto flex items-center">
              Devs cannot modify portfolio items.
            </p>
          )}
          <Button type="button" disabled={isDev || loading} onClick={handleSubmit}>
            {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
