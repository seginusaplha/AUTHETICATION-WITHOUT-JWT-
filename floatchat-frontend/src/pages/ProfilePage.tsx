import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, X, Camera } from "lucide-react";
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Ocean Explorer",
    email: "explorer@floatchat.com",
    bio: "Passionate about marine life and ocean conservation. Love exploring the depths of our blue planet.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    location: "Pacific Coast",
    interests: "Marine Biology, Ocean Conservation, Deep Sea Exploration"
  });
  
  const [editForm, setEditForm] = useState(profile);
  const [imageUrl, setImageUrl] = useState("");

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    setImageUrl("");
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
    setImageUrl("");
  };

  const handleImageUpdate = () => {
    if (imageUrl.trim()) {
      setEditForm({ ...editForm, avatar: imageUrl });
      setImageUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-ocean relative overflow-hidden">
      <ParticleBackground />
      <Navbar />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-ocean">
            <CardHeader className="text-center pb-6">
              <div className="relative inline-block">
                <Avatar className="w-32 h-32 mx-auto border-4 border-white/30">
                  <AvatarImage src={isEditing ? editForm.avatar : profile.avatar} alt="Profile" />
                  <AvatarFallback className="text-4xl bg-ocean-deep text-white">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
                    onClick={() => document.getElementById('image-url-input')?.focus()}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {!isEditing ? (
                <>
                  <CardTitle className="text-3xl text-white mt-4">{profile.name}</CardTitle>
                  <p className="text-white/80">{profile.email}</p>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
                    variant="outline"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30">
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {isEditing && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Update Profile Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="image-url-input" className="text-white/90">
                        Unsplash Image URL
                      </Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="image-url-input"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="Paste Unsplash image URL here..."
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                        <Button onClick={handleImageUpdate} disabled={!imageUrl.trim()}>
                          Update
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">
                      Find free images at{" "}
                      <a 
                        href="https://unsplash.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-ocean-light hover:underline"
                      >
                        unsplash.com
                      </a>
                      {" "}and copy the image URL
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/90">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    ) : (
                      <p className="mt-1 text-white">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/90">Email</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    ) : (
                      <p className="mt-1 text-white">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/90">Location</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    ) : (
                      <p className="mt-1 text-white">{profile.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white/90">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60 resize-none"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-white">{profile.bio}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white/90">Interests</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.interests}
                        onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    ) : (
                      <p className="mt-1 text-white">{profile.interests}</p>
                    )}
                  </div>
                </div>
              </div>

              {!isEditing && (
                <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-white/20">
                  <Card className="bg-white/5 border-white/10 text-center">
                    <CardContent className="p-4">
                      <h3 className="text-2xl font-bold text-white">142</h3>
                      <p className="text-white/70">Queries Made</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10 text-center">
                    <CardContent className="p-4">
                      <h3 className="text-2xl font-bold text-white">28</h3>
                      <p className="text-white/70">Chat Sessions</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10 text-center">
                    <CardContent className="p-4">
                      <h3 className="text-2xl font-bold text-white">15</h3>
                      <p className="text-white/70">Images Generated</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;