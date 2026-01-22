import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserPhoto {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  imageUrl: string;
  caption?: string;
  likes: number;
  datePosted: string;
  verified: boolean;
}

interface UserContentContextType {
  userPhotos: UserPhoto[];
  getPhotosForProduct: (productId: string) => UserPhoto[];
  addUserPhoto: (photo: Omit<UserPhoto, "id" | "datePosted" | "likes" | "verified">) => void;
  likePhoto: (photoId: string) => void;
  reportPhoto: (photoId: string) => void;
  featuredPhotos: UserPhoto[];
}

const UserContentContext = createContext<UserContentContextType | undefined>(undefined);

const USER_PHOTOS_STORAGE_KEY = "statio-user-photos";

// Sample user-generated content
const SAMPLE_USER_PHOTOS: UserPhoto[] = [
  {
    id: "1",
    productId: "2026-daily-planner",
    userName: "Sarah M.",
    userAvatar: "",
    imageUrl: "/api/placeholder/400/400", // Placeholder - in real app would be actual image
    caption: "My new planner setup for the year! Loving the quality 📓✨",
    likes: 24,
    datePosted: "2024-01-15T10:30:00Z",
    verified: true
  },
  {
    id: "2",
    productId: "marble-notebook",
    userName: "Ahmed K.",
    userAvatar: "",
    imageUrl: "/api/placeholder/400/400",
    caption: "Perfect for bullet journaling! The paper quality is amazing 📝",
    likes: 18,
    datePosted: "2024-01-12T14:20:00Z",
    verified: true
  },
  {
    id: "3",
    productId: "luxury-gift-tags",
    userName: "Leila B.",
    userAvatar: "",
    imageUrl: "/api/placeholder/400/400",
    caption: "Wrapped the perfect gift with these beautiful tags 🎁",
    likes: 31,
    datePosted: "2024-01-10T09:15:00Z",
    verified: false
  },
  {
    id: "4",
    productId: "gold-gel-pen",
    userName: "Mohamed T.",
    userName: "Mohamed T.",
    userAvatar: "",
    imageUrl: "/api/placeholder/400/400",
    caption: "My favorite writing companion! ✍️",
    likes: 15,
    datePosted: "2024-01-08T16:45:00Z",
    verified: true
  }
];

export const UserContentProvider = ({ children }: { children: ReactNode }) => {
  const [userPhotos, setUserPhotos] = useState<UserPhoto[]>(() => {
    try {
      const stored = localStorage.getItem(USER_PHOTOS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SAMPLE_USER_PHOTOS;
    } catch {
      return SAMPLE_USER_PHOTOS;
    }
  });

  // Save to localStorage whenever photos change
  useEffect(() => {
    try {
      localStorage.setItem(USER_PHOTOS_STORAGE_KEY, JSON.stringify(userPhotos));
    } catch (error) {
      console.error("Failed to save user photos:", error);
    }
  }, [userPhotos]);

  const getPhotosForProduct = (productId: string) => {
    return userPhotos.filter(photo => photo.productId === productId);
  };

  const addUserPhoto = (photoData: Omit<UserPhoto, "id" | "datePosted" | "likes" | "verified">) => {
    const newPhoto: UserPhoto = {
      ...photoData,
      id: `user-photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      datePosted: new Date().toISOString(),
      likes: 0,
      verified: false // New photos start as unverified
    };

    setUserPhotos(prev => [newPhoto, ...prev]);
  };

  const likePhoto = (photoId: string) => {
    setUserPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      )
    );
  };

  const reportPhoto = (photoId: string) => {
    // In a real app, this would send a report to moderation
    console.log(`Photo ${photoId} reported for moderation`);
  };

  // Get featured photos (highest likes, verified first)
  const featuredPhotos = userPhotos
    .sort((a, b) => {
      // Verified photos first, then by likes
      if (a.verified !== b.verified) return a.verified ? -1 : 1;
      return b.likes - a.likes;
    })
    .slice(0, 6);

  return (
    <UserContentContext.Provider
      value={{
        userPhotos,
        getPhotosForProduct,
        addUserPhoto,
        likePhoto,
        reportPhoto,
        featuredPhotos
      }}
    >
      {children}
    </UserContentContext.Provider>
  );
};

export const useUserContent = () => {
  const context = useContext(UserContentContext);
  if (context === undefined) {
    throw new Error("useUserContent must be used within a UserContentProvider");
  }
  return context;
};