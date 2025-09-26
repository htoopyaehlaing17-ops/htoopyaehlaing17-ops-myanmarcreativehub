'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/components/providers/app-provider';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { X, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { PORTFOLIO_CATEGORIES } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { suggestCoverImages } from '@/ai/flows/suggest-cover-images-from-description';
import Image from 'next/image';

const portfolioSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  category: z.string().min(1, 'Please select a category'),
  coverImage: z.string().min(1, 'Please upload or select a cover image.'),
  images: z.array(z.string()).optional(),
  isPublic: z.boolean().default(true),
  featured: z.boolean().default(false),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export default function UploadPortfolioModal() {
  const { activeModal, closeModal, modalData } = useApp();
  const { addPortfolio, updatePortfolio } = useAuth();
  const { toast } = useToast();
  const [suggestedImages, setSuggestedImages] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  const editingPortfolio = modalData?.portfolio;
  const isEditing = !!editingPortfolio;

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      coverImage: '',
      images: [],
      isPublic: true,
      featured: false,
    },
  });

  const descriptionValue = watch('description');
  const coverImageValue = watch('coverImage');
  const imagesValue = watch('images');

  useEffect(() => {
    if (isEditing && editingPortfolio) {
        reset({
            title: editingPortfolio.title,
            description: editingPortfolio.description,
            category: editingPortfolio.category,
            coverImage: editingPortfolio.coverImage,
            images: editingPortfolio.images,
            isPublic: editingPortfolio.isPublic,
            featured: editingPortfolio.featured,
        });
    } else {
        reset({
            title: '',
            description: '',
            category: '',
            coverImage: '',
            images: [],
            isPublic: true,
            featured: false,
        });
    }
  }, [isEditing, editingPortfolio, reset]);
  
  const handleClose = () => {
    reset();
    setSuggestedImages([]);
    closeModal();
  }

  const onSubmit = (data: PortfolioFormData) => {
    if (isEditing && editingPortfolio) {
        updatePortfolio({ ...editingPortfolio, ...data });
        toast({ title: 'Project Updated!', description: 'Your project has been successfully updated.' });
    } else {
        addPortfolio({ ...data, images: data.images || [] });
        toast({ title: 'Project Added!', description: 'Your new project has been added to your portfolio.' });
    }
    handleClose();
  };
  
  const handleSuggestImages = async () => {
    if (!descriptionValue || descriptionValue.length < 20) {
      toast({ variant: 'destructive', title: 'Description too short', description: 'Please provide a longer description (at least 20 characters) for better suggestions.' });
      return;
    }
    setIsSuggesting(true);
    setSuggestedImages([]);
    try {
      const result = await suggestCoverImages({ description: descriptionValue });
      if (result.imageUrls && result.imageUrls.length > 0) {
        setSuggestedImages(result.imageUrls);
      } else {
        toast({ variant: 'destructive', title: 'No suggestions found', description: 'The AI could not find suitable images. Try a different description.' });
      }
    } catch (error) {
      console.error('Error suggesting images:', error);
      toast({ variant: 'destructive', title: 'Suggestion Failed', description: 'An error occurred while fetching image suggestions.' });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const dataUri = await toBase64(file);
      setValue('coverImage', dataUri);
    }
  };
  
  const handleProjectImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const dataUris = await Promise.all(fileArray.map(file => toBase64(file)));
      const currentImages = watch('images') || [];
      setValue('images', [...currentImages, ...dataUris]);
    }
  };

  const removeProjectImage = (index: number) => {
    const currentImages = watch('images') || [];
    setValue('images', currentImages.filter((_, i) => i !== index));
  }


  if (activeModal !== 'uploadPortfolio') return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl relative animate-in fade-in-0 zoom-in-95">
        <div className="flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold font-headline text-card-foreground">{isEditing ? "Edit Project" : "Add New Project"}</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="p-2 hover:bg-muted rounded-full">
              <X className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => <Input id="title" placeholder="e.g., Modern E-commerce Website" {...field} />}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Textarea id="description" placeholder="Describe your project in detail..." {...field} rows={4} />}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                 <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PORTFOLIO_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="coverImage">Cover Image</Label>
                        <p className="text-xs text-muted-foreground">Upload an image or let AI suggest one.</p>
                    </div>
                    <Button type="button" onClick={handleSuggestImages} disabled={isSuggesting} size="sm">
                      {isSuggesting ? 'Thinking...' : 'Suggest with AI'}
                    </Button>
                </div>
                 <Input id="coverImage-upload" type="file" accept="image/*" onChange={handleCoverImageUpload} className="hidden" />
                 <label htmlFor="coverImage-upload" className="cursor-pointer border-2 border-dashed border-muted hover:border-primary rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground">
                    {coverImageValue ? <Image src={coverImageValue} alt="Cover preview" width={150} height={100} className="rounded-md object-cover" /> : (
                        <>
                            <UploadCloud className="w-8 h-8 mb-2" />
                            <span>Click to upload a cover image</span>
                        </>
                    )}
                 </label>
                  {errors.coverImage && <p className="text-sm text-destructive">{errors.coverImage.message}</p>}
                  
                  {suggestedImages.length > 0 && !coverImageValue && (
                    <div className="grid grid-cols-3 gap-4">
                      {suggestedImages.map((url, i) => (
                        <div key={i} className="relative aspect-video cursor-pointer rounded-md overflow-hidden" onClick={() => setValue('coverImage', url)}>
                            <Image src={url} alt={`Suggestion ${i + 1}`} fill className="object-cover"/>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="images-upload">Project Images</Label>
                <Input id="images-upload" type="file" accept="image/*" multiple onChange={handleProjectImagesUpload} className="hidden" />
                <label htmlFor="images-upload" className="cursor-pointer border-2 border-dashed border-muted hover:border-primary rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span>Click to add project images</span>
                </label>
                 <p className="text-xs text-muted-foreground">You can select multiple images.</p>
                 {imagesValue && imagesValue.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {imagesValue.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-md overflow-hidden group">
                                <Image src={src} alt={`Project image ${i+1}`} fill className="object-cover" />
                                <button type="button" onClick={() => removeProjectImage(i)} className="absolute top-1 right-1 bg-destructive/80 hover:bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                 )}
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                   <Controller
                      name="isPublic"
                      control={control}
                      render={({ field }) => <Switch id="isPublic" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  <Label htmlFor="isPublic">Make Project Public</Label>
                </div>
                 <div className="flex items-center space-x-2">
                   <Controller
                      name="featured"
                      control={control}
                      render={({ field }) => <Checkbox id="featured" checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  <Label htmlFor="featured">Feature this project</Label>
                </div>
              </div>
              
            </div>
            
            <div className="flex justify-end p-6 border-t bg-muted/50">
              <Button type="submit">{isEditing ? "Save Changes" : "Add Project"}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
