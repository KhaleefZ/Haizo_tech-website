'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function SettingsPage() {
  const { role } = useAppStore();
  const isAdmin = ['SUPER_ADMIN', 'MANAGER'].includes(role);

  const [profile, setProfile] = useState({ name: '', email: '', bio: '', role: '', avatarUrl: '' });
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '' });
  const [preferences, setPreferences] = useState({ notificationsEnabled: true, maintenanceMode: false });
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile({ name: data.name, email: data.email, bio: data.bio || '', role: data.role, avatarUrl: data.avatarUrl || '' });
        setPreferences({ notificationsEnabled: data.notificationsEnabled, maintenanceMode: data.maintenanceMode });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/profile`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ name: profile.name, bio: profile.bio, avatarUrl: profile.avatarUrl })
      });
      if (res.ok) {
        alert('Profile updated');
      } else {
        alert('Update failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => ({ ...prev, avatarUrl: data.imageUrl }));
      } else {
        alert('Image upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Upload error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleUpdateSecurity = async () => {
    if (!security.currentPassword || !security.newPassword) return alert('Fill passwords');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/security`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(security)
      });
      if (res.ok) {
        alert('Password updated');
        setSecurity({ currentPassword: '', newPassword: '' });
      } else {
        const data = await res.json();
        alert(data.error || 'Update failed');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = async (key: 'notificationsEnabled' | 'maintenanceMode') => {
    const newValue = !preferences[key];
    setPreferences(prev => ({ ...prev, [key]: newValue }));
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/preferences`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ ...preferences, [key]: newValue })
      });
    } catch (e) {
      console.error(e);
      // Revert on fail
      setPreferences(prev => ({ ...prev, [key]: !newValue }));
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage dashboard configuration and global preferences.</p>
      </div>

      <AnimatedSection className="glass-card p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Profile Information</h2>
          
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="h-24 w-24 border-2 border-white/10">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
              <AvatarFallback className="text-2xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <label htmlFor="avatar-upload" className="cursor-pointer bg-white/5 border border-white/10 hover:bg-white/10 transition px-4 py-2 rounded-md flex items-center gap-2 w-fit text-sm font-medium">
                {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                Change Picture
              </label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
              <p className="text-xs text-muted-foreground">JPG, PNG or GIF. 1MB max.</p>
            </div>
          </div>

          <div className="grid gap-4 max-w-md">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="bg-white/5 border-white/10" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input id="email" type="email" value={profile.email} className="bg-white/5 border-white/10" disabled />
            </div>
            <div className="grid gap-2">
              <label htmlFor="bio" className="text-sm font-medium">Bio</label>
              <textarea id="bio" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="bg-white/5 border-white/10 p-2 rounded-md min-h-[80px] text-sm resize-none focus:ring-1 focus:ring-primary outline-none" />
            </div>
            <Button className="w-fit mt-2" disabled={loading} onClick={handleUpdateProfile}>Update Profile</Button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">Account Security</h2>
          <div className="flex flex-col gap-4 max-w-md">
            <div className="grid gap-2">
              <label htmlFor="current_password" className="text-sm font-medium">Current Password</label>
              <Input id="current_password" type="password" value={security.currentPassword} onChange={e => setSecurity({...security, currentPassword: e.target.value})} placeholder="••••••••" className="bg-white/5 border-white/10" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="new_password" className="text-sm font-medium">New Password</label>
              <Input id="new_password" type="password" value={security.newPassword} onChange={e => setSecurity({...security, newPassword: e.target.value})} placeholder="••••••••" className="bg-white/5 border-white/10" />
            </div>
            <Button className="w-fit mt-2" disabled={loading} onClick={handleUpdateSecurity}>Change Password</Button>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-4 border-b border-white/10 pb-2">System Preferences</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-white">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive daily summaries of your tasks.</p>
              </div>
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full border cursor-pointer ${preferences.notificationsEnabled ? 'bg-primary/20 border-primary/50' : 'bg-white/10 border-white/20'}`}
                onClick={() => isAdmin && togglePreference('notificationsEnabled')}
              >
                <span className={`inline-block h-4 w-4 rounded-full transition transform ${preferences.notificationsEnabled ? 'translate-x-6 bg-primary' : 'translate-x-1 bg-muted-foreground'}`} />
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <div>
                <p className="font-medium text-white">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Suspend access to the public frontend.</p>
              </div>
              <div 
                className={`relative inline-flex h-6 w-11 items-center rounded-full border cursor-pointer ${preferences.maintenanceMode ? 'bg-red-500/20 border-red-500/50' : 'bg-white/10 border-white/20'}`}
                onClick={() => isAdmin && togglePreference('maintenanceMode')}
              >
                <span className={`inline-block h-4 w-4 rounded-full transition transform ${preferences.maintenanceMode ? 'translate-x-6 bg-red-500' : 'translate-x-1 bg-muted-foreground'}`} />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
