import { useState, useRef, ChangeEvent } from 'react';
import { Card, CardContent } from './UI/Card';
import { Button } from './UI/Button';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  image: string;
}

export default function Settings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      try {
        setLoading(true);
        const response = await axios.post('/api/upload-image', formData);
        setProfile(prev => ({ ...prev, image: response.data.imageUrl }));
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image' + error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/users/profile', profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent>
          <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <img
                  src={profile.image || '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  placeholder='Enter your name'
                  onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  placeholder='Enter your email'
                  onChange={e => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <Button
                type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}