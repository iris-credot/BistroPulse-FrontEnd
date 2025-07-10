// components/ui/AvatarUploader.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "./Button";
import { Input } from "./Input";

interface AvatarUploaderProps {
  initialAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
}

export const AvatarUploader = ({ 
  initialAvatar = "/images/profile.jpg",
  onAvatarChange 
}: AvatarUploaderProps) => {
  const [avatar, setAvatar] = useState(initialAvatar);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      onAvatarChange(url);
    }
  };

  const handleRemove = () => {
    setAvatar(initialAvatar);
    onAvatarChange(initialAvatar);
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <Image
        src={avatar}
        alt="Avatar"
        width={80}
        height={80}
        className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-gray-200"
      />
      <div className="flex gap-2">
        <label className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 cursor-pointer">
          Upload
          <Input
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
        <Button 
          onClick={handleRemove} 
          variant="outline"
          size="sm"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};