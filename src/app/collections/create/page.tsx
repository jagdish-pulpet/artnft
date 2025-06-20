
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, PlusSquare, UploadCloud, Image as ImageIcon, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { apiService, ApiError } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image'; // Renamed to avoid conflict
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileSchema = z.custom<File>((val) => val instanceof File, "Please select a file")
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 5MB.`)
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.")
  .optional();

const externalLinksSchema = z.object({
  website: z.string().url({ message: "Invalid website URL" }).optional().or(z.literal('')),
  discord: z.string().url({ message: "Invalid Discord URL" }).optional().or(z.literal('')),
  twitter: z.string().url({ message: "Invalid Twitter URL" }).optional().or(z.literal('')),
  telegram: z.string().url({ message: "Invalid Telegram URL" }).optional().or(z.literal('')),
  medium: z.string().url({ message: "Invalid Medium URL" }).optional().or(z.literal('')),
}).optional();

const createCollectionFormSchema = z.object({
  name: z.string().min(3, { message: "Collection name must be at least 3 characters." }).max(100, { message: "Collection name must be 100 characters or less." }),
  description: z.string().max(1000, { message: "Description must be 1000 characters or less." }).optional(),
  
  logoFile: fileSchema,
  coverFile: fileSchema,
  bannerFile: fileSchema,
  
  // These will store the URLs after upload
  logoImageUrl: z.string().url().optional(),
  coverImageUrl: z.string().url().optional(),
  bannerImageUrl: z.string().url().optional(),

  category: z.string().max(50, { message: "Category must be 50 characters or less." }).optional(),
  externalLinks: externalLinksSchema,
});

type CreateCollectionFormValues = z.infer<typeof createCollectionFormSchema>;

interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
}

export default function CreateCollectionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const form = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionFormSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      externalLinks: { website: '', discord: '', twitter: '', telegram: '', medium: '' },
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, fieldName: 'logoFile' | 'coverFile' | 'bannerFile', setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file);
      form.trigger(fieldName); // Trigger validation for the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue(fieldName, undefined);
      setPreview(null);
    }
  };

  const uploadImageFile = async (file: File | undefined): Promise<string | undefined> => {
    if (!file || !token) return undefined;
    
    const formData = new FormData();
    formData.append('imageFile', file);

    try {
      const response = await apiService.post<{ data: UploadResponse }>('/upload/image', formData, token);
      return response.data.url;
    } catch (error: any) {
      console.error("Image upload failed:", error);
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Image upload failed.';
      toast({ title: `Error uploading ${file.name}`, description: errorMessage, variant: "destructive" });
      throw new Error(errorMessage); // Propagate error to stop form submission
    }
  };

  const onSubmit = async (data: CreateCollectionFormValues) => {
    if (!isAuthenticated || !token) {
      toast({ title: "Authentication Required", description: "Please sign in to create a collection.", variant: "destructive" });
      router.push('/signin');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const [logoUrl, coverUrl, bannerUrl] = await Promise.all([
        uploadImageFile(data.logoFile),
        uploadImageFile(data.coverFile),
        uploadImageFile(data.bannerFile),
      ]);

      const payload: Partial<CreateCollectionFormValues> & { name: string } = {
        name: data.name,
        description: data.description === '' ? undefined : data.description,
        logoImageUrl: logoUrl,
        coverImageUrl: coverUrl,
        bannerImageUrl: bannerUrl,
        category: data.category === '' ? undefined : data.category,
        externalLinks: data.externalLinks,
      };
      
      if (payload.externalLinks) {
        (Object.keys(payload.externalLinks) as Array<keyof typeof payload.externalLinks>).forEach(key => {
            if (payload.externalLinks && payload.externalLinks[key] === '') {
                 delete payload.externalLinks[key];
            }
        });
        if (Object.keys(payload.externalLinks).length === 0) {
            payload.externalLinks = undefined;
        }
      }


      const response = await apiService.post<{ data: { id: string; slug: string; name: string; } }>('/collections', payload, token);
      toast({
        title: 'Collection Created!',
        description: `Your collection "${response.data.name}" has been successfully created.`,
      });
      router.push(`/collections/${response.data.slug}`);

    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Failed to create collection.';
      setFormError(errorMessage);
      // Toast for specific image upload errors is handled in uploadImageFile
      // This toast is for the final collection creation failure or general upload error
      if (!errorMessage.toLowerCase().includes('upload')) {
        toast({ title: 'Creation Failed', description: errorMessage, variant: 'destructive' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
   if (isAuthLoading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!isAuthenticated && !isAuthLoading) {
     return (
        <div className="flex min-h-screen items-center justify-center p-4">
             <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Authentication Required</CardTitle>
                    <CardDescription>You need to be signed in to create a collection.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild><Link href="/signin">Sign In</Link></Button>
                </CardContent>
            </Card>
        </div>
     );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/collections">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Collections
              </Link>
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="shadow-xl rounded-xl max-w-3xl mx-auto">
                <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <PlusSquare className="h-12 w-12 sm:h-14 sm:w-14 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                    <div>
                      <CardTitle className="text-3xl sm:text-4xl font-headline text-primary tracking-tight">
                        Create New Collection
                      </CardTitle>
                      <CardDescription className="mt-1 text-base">
                        Establish a new home for your unique set of NFTs.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {formError && (
                    <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0"/> {formError}
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., My Awesome Art" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us about your collection..." {...field} disabled={isSubmitting} className="min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Collection Images</h3>
                    {/* Logo Image Upload */}
                    <FormField
                      control={form.control}
                      name="logoFile"
                      render={({ field: { onChange, value, ...restField }}) => ( // field.onChange is not directly compatible with input type="file"
                        <FormItem>
                          <FormLabel>Logo Image</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept={ALLOWED_IMAGE_TYPES.join(',')}
                              onChange={(e) => handleFileChange(e, 'logoFile', setLogoPreview)}
                              disabled={isSubmitting}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                              {...restField}
                            />
                          </FormControl>
                          {logoPreview && <NextImage src={logoPreview} alt="Logo preview" width={64} height={64} className="mt-2 rounded object-cover border" />}
                          <FormDescription>Recommended: Square image (e.g., 300x300px). Max 5MB.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Cover Image Upload */}
                     <FormField
                      control={form.control}
                      name="coverFile"
                      render={({ field: { onChange, value, ...restField }}) => (
                        <FormItem>
                          <FormLabel>Cover Image</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept={ALLOWED_IMAGE_TYPES.join(',')}
                              onChange={(e) => handleFileChange(e, 'coverFile', setCoverPreview)}
                              disabled={isSubmitting}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                              {...restField}
                            />
                          </FormControl>
                           {coverPreview && <NextImage src={coverPreview} alt="Cover preview" width={128} height={64} className="mt-2 rounded object-cover border aspect-video" />}
                          <FormDescription>Recommended: Landscape, e.g., 1400x350px. Max 5MB.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Banner Image Upload */}
                    <FormField
                      control={form.control}
                      name="bannerFile"
                      render={({ field: { onChange, value, ...restField }}) => (
                        <FormItem>
                          <FormLabel>Banner Image</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept={ALLOWED_IMAGE_TYPES.join(',')}
                              onChange={(e) => handleFileChange(e, 'bannerFile', setBannerPreview)}
                              disabled={isSubmitting}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                              {...restField}
                            />
                          </FormControl>
                          {bannerPreview && <NextImage src={bannerPreview} alt="Banner preview" width={128} height={64} className="mt-2 rounded object-cover border aspect-video" />}
                          <FormDescription>Large banner for collection page, e.g., 1600x400px. Max 5MB.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Art, Gaming, Photography" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Card className="bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center"><ExternalLink className="mr-2 h-5 w-5" />External Links</CardTitle>
                        <CardDescription>Provide links to your project's website and social media.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="externalLinks.website"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl><Input type="url" placeholder="https://yoursite.com" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="externalLinks.discord"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discord URL</FormLabel>
                                <FormControl><Input type="url" placeholder="https://discord.gg/yourserver" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="externalLinks.twitter"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Twitter URL</FormLabel>
                                <FormControl><Input type="url" placeholder="https://twitter.com/yourhandle" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="externalLinks.telegram"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telegram URL</FormLabel>
                                <FormControl><Input type="url" placeholder="https://t.me/yourgroup" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="externalLinks.medium"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Medium URL</FormLabel>
                                <FormControl><Input type="url" placeholder="https://medium.com/yourpublication" {...field} disabled={isSubmitting} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                  </Card>

                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Creating Collection...' : 'Create Collection'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
      <Toaster />
    </>
  );
}
