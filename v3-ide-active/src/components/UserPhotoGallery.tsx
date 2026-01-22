import { useState } from "react";
import { Heart, MessageSquare, Flag, Plus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserContent, UserPhoto } from "@/contexts/UserContentContext";
import { toast } from "sonner";

interface UserPhotoGalleryProps {
  productId: string;
  productName: string;
  maxPhotos?: number;
  className?: string;
}

const UserPhotoGallery = ({
  productId,
  productName,
  maxPhotos = 6,
  className = ""
}: UserPhotoGalleryProps) => {
  const { language } = useLanguage();
  const { getPhotosForProduct, addUserPhoto, likePhoto, reportPhoto } = useUserContent();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    userName: "",
    caption: "",
    imageFile: null as File | null
  });

  const photos = getPhotosForProduct(productId);
  const displayPhotos = photos.slice(0, maxPhotos);

  const handleLike = (photoId: string) => {
    likePhoto(photoId);
    toast.success(language === "AR" ? "تم الإعجاب!" : language === "FR" ? "Aimé !" : "Liked!");
  };

  const handleReport = (photoId: string) => {
    reportPhoto(photoId);
    toast.success(language === "AR" ? "تم الإبلاغ" : language === "FR" ? "Signalé" : "Reported");
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.imageFile || !uploadForm.userName.trim()) {
      toast.error(language === "AR" ? "يرجى ملء جميع الحقول" : language === "FR" ? "Veuillez remplir tous les champs" : "Please fill all fields");
      return;
    }

    // In a real app, you would upload the image to a server
    // For now, we'll simulate with a placeholder
    const imageUrl = URL.createObjectURL(uploadForm.imageFile);

    addUserPhoto({
      productId,
      userName: uploadForm.userName,
      imageUrl,
      caption: uploadForm.caption
    });

    setUploadForm({ userName: "", caption: "", imageFile: null });
    setIsUploadOpen(false);
    toast.success(language === "AR" ? "تم رفع الصورة بنجاح!" : language === "FR" ? "Photo téléchargée avec succès !" : "Photo uploaded successfully!");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, imageFile: file }));
    }
  };

  const labels = {
    EN: {
      title: "Customer Photos",
      subtitle: "See how others are using this product",
      upload: "Share Your Photo",
      likes: "likes",
      verified: "Verified Purchase",
      report: "Report",
      uploadTitle: "Share Your Photo",
      yourName: "Your Name",
      caption: "Caption (optional)",
      chooseImage: "Choose Image",
      submit: "Upload Photo",
      cancel: "Cancel",
      viewAll: "View All Photos"
    },
    FR: {
      title: "Photos Clients",
      subtitle: "Découvrez comment les autres utilisent ce produit",
      upload: "Partagez Votre Photo",
      likes: "j'aime",
      verified: "Achat Vérifié",
      report: "Signaler",
      uploadTitle: "Partagez Votre Photo",
      yourName: "Votre Nom",
      caption: "Légende (optionnel)",
      chooseImage: "Choisir une Image",
      submit: "Télécharger",
      cancel: "Annuler",
      viewAll: "Voir Toutes les Photos"
    },
    AR: {
      title: "صور العملاء",
      subtitle: "شاهد كيف يستخدم الآخرون هذا المنتج",
      upload: "شارك صورك",
      likes: "إعجاب",
      verified: "شراء موثق",
      report: "إبلاغ",
      uploadTitle: "شارك صورك",
      yourName: "اسمك",
      caption: "وصف (اختياري)",
      chooseImage: "اختر صورة",
      submit: "رفع الصورة",
      cancel: "إلغاء",
      viewAll: "عرض جميع الصور"
    }
  };

  const l = labels[language as keyof typeof labels];

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{l.title}</h3>
          <p className="text-sm text-muted-foreground">{l.subtitle}</p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {l.upload}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{l.uploadTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">{l.yourName}</label>
                <Input
                  value={uploadForm.userName}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, userName: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{l.caption}</label>
                <Textarea
                  value={uploadForm.caption}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder={language === "AR" ? "اكتب وصفاً لصورتك..." : language === "FR" ? "Décrivez votre photo..." : "Describe your photo..."}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">{l.chooseImage}</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  required
                />
                {uploadForm.imageFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Selected: {uploadForm.imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  {l.submit}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                  {l.cancel}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {displayPhotos.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <div className="text-muted-foreground mb-4">
            <div className="w-12 h-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
              📸
            </div>
            <p className="text-sm">
              {language === "AR" ? "لا توجد صور بعد" : language === "FR" ? "Aucune photo pour le moment" : "No photos yet"}
            </p>
          </div>
          <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {language === "AR" ? "كن أول من يشارك" : language === "FR" ? "Soyez le premier à partager" : "Be the first to share"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayPhotos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-muted rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setSelectedImage(photo.imageUrl)}
            >
              <img
                src={photo.imageUrl}
                alt={`Photo by ${photo.userName}`}
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay with user info */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="text-white w-full">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-medium">
                      {photo.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate">{photo.userName}</span>
                    {photo.verified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓
                      </Badge>
                    )}
                  </div>

                  {photo.caption && (
                    <p className="text-xs line-clamp-2 mb-2">{photo.caption}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(photo.id);
                      }}
                      className="flex items-center gap-1 text-xs hover:text-red-400 transition-colors"
                    >
                      <Heart className="w-3 h-3" />
                      {photo.likes}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReport(photo.id);
                      }}
                      className="text-xs hover:text-red-400 transition-colors"
                    >
                      <Flag className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length > maxPhotos && (
        <div className="text-center pt-4">
          <Button variant="ghost" size="sm">
            {l.viewAll} ({photos.length})
          </Button>
        </div>
      )}

      {/* Full-size image modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <img
              src={selectedImage}
              alt="User uploaded photo"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserPhotoGallery;