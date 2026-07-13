'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { toast } from 'sonner';
import { fetchWithAuth } from '@/lib/api';


export interface WorkCategory {
  id: string;
  name: string;
  order: number;
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<WorkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  
  const { role } = useAppStore();
  const canEdit = role === 'SUPER_ADMIN' || role === 'MANAGER';

  const fetchCategories = async () => {
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/work-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuth('http://localhost:5001/api/work-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      if (res.ok) {
        setNewCategoryName('');
        await fetchCategories();
        toast.success('Category added successfully');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add category');
      }
    } catch (error: any) {
      console.error('Failed to add category', error);
      toast.error('Network error while adding category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/work-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editingName })
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to update category', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetchWithAuth(`http://localhost:5001/api/work-categories/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) return;
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap order values
    const tempOrder = newCategories[index].order;
    newCategories[index].order = newCategories[targetIndex].order;
    newCategories[targetIndex].order = tempOrder;
    
    // Sort array locally
    newCategories.sort((a, b) => a.order - b.order);
    setCategories(newCategories);

    // Save to backend
    try {
      await fetchWithAuth('http://localhost:5001/api/work-categories/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: newCategories.map(c => ({ id: c.id, order: c.order }))
        })
      });
    } catch (error) {
      console.error('Failed to reorder', error);
      fetchCategories(); // Revert on failure
    }
  };

  if (!canEdit) {
    return null; // Return nothing if the user doesn't have permissions to manage categories
  }

  return (
    <div className="mb-8 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Manage Work Categories</h3>
        <p className="text-sm text-muted-foreground">Add, edit, reorder, or delete project categories.</p>
      </div>
      <div className="p-6 pt-0">
        <div className="flex gap-4 mb-6">
          <Input 
            placeholder="New Category Name..." 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button onClick={handleAdd}><Plus className="w-4 h-4 mr-2" /> Add</Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading categories...</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat, idx) => (
              <div key={cat.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5">
                
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2 flex-grow mr-4">
                    <Input 
                      value={editingName} 
                      onChange={(e) => setEditingName(e.target.value)} 
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id)}
                    />
                    <Button size="icon" variant="ghost" onClick={() => handleUpdate(cat.id)}>
                      <Check className="w-4 h-4 text-green-600" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                      <X className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center font-medium">
                    <span className="w-6 text-gray-400 text-sm">{idx + 1}.</span>
                    {cat.name}
                  </div>
                )}

                {editingId !== cat.id && (
                  <div className="flex items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, 'up')}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMove(idx, 'down')}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditingName(cat.name);
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">No categories found. Add one above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
