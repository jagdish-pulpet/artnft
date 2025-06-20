
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, ChangeEvent } from "react";
import NextImage from "next/image";
import { Loader2, AlertTriangle, UploadCloud } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB for profile images
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileSchemaOptional = z.custom<File>((val) => val instanceof File, "Please select a file")
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.")
  .optional();

const socialLinksSchema = z.object({
  twitter: z.string().url({ message: "Invalid Twitter URL (must include https://)" }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Invalid Instagram URL (must include https://)" }).optional().or(z.literal('')),
  website: z.string().url({ message: "Invalid Website URL (must include https://)" }).optional().or(z.literal('')),
  discord: z.string().url({ message: "Invalid Discord server URL (must include https://)" }).optional().or(z.literal('')),
});

const editProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username must be at most 20 characters."),
  bio: z.string().max(500, "Bio must be at most 500 characters.").optional(),
  avatarFile: fileSchemaOptional,
  coverFile: fileSchemaOptional,
  avatarUrl: z.string().url("Invalid avatar URL.").optional().or(z.literal('')),
  coverUrl: z.string().url("Invalid cover URL.").optional().or(z.literal('')),
  email: z.string().email("Invalid email address.").optional(),
  socialLinks: socialLinksSchema.optional(),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onProfileUpdated?: () => void; // Make this callback optional
}

export function EditProfileModal({ isOpen, onOpenChange, onProfileUpdated }: EditProfileModalProps) {
  const { user, token, refreshAuthUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting = useState(false);
  const [formError, setFormError = useState<string | null>(null);

  const [avatarPreview, setAvatarPreview = useState<string | null>(user?.avatarUrl || null);
  const [coverPreview, setCoverPreview = useState<string | null>(user?.coverUrl || null);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        username: user.username || "",
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        coverUrl: user.coverUrl || "",
        email: user.email || "",
        socialLinks: {
          twitter: user.socialLinks?.twitter || "",
          instagram: user.socialLinks?.instagram || "",
          website: user.socialLinks?.website || "",
          discord: user.socialLinks?.discord || "",
        },
      });
      setAvatarPreview(user.avatarUrl || null);
      setCoverPreview(user.coverUrl || null);
    }
  }, [user, isOpen, form]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldName: 'avatarFile' | 'coverFile',
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file);
      form.trigger(fieldName);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue(fieldName, undefined);
      setPreview(fieldName === 'avatarFile' ? user?.avatarUrl || null : user?.coverUrl || null); 
    }
  };

  const uploadImageFile = async (file: File | undefined): Promise<string | undefined> => {
    if (!file || !token) return undefined;
    const formData = new FormData();
    formData.append('imageFile', file);
    try {
      const response = await apiService.post<{ data: UploadResponse }>('/upload/image', formData, token);
      return response.data.url;
    } catch (uploadError: any) {
      const errorMsg = uploadError instanceof ApiError ? uploadError.data?.message || uploadError.message : 'Image upload failed.';
      setFormError(`Image Upload Error for ${file.name}: ${errorMsg}`);
      toast({ title: `Error uploading ${file.name}`, description: errorMsg, variant: "destructive" });
      throw new Error(errorMsg);
    }
  };

  const onSubmit = async (data: EditProfileFormValues) => {
    if (!token || !user) {
      toast({ title: "Error", description: "Authentication required.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    let finalAvatarUrl = user.avatarUrl;
    let finalCoverUrl = user.coverUrl;

    try {
      if (data.avatarFile) {
        finalAvatarUrl = await uploadImageFile(data.avatarFile);
        if (!finalAvatarUrl) { 
          setIsSubmitting(false);
          return;
        }
      }
      if (data.coverFile) {
        finalCoverUrl = await uploadImageFile(data.coverFile);
        if (!finalCoverUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const payload: Partial<EditProfileFormValues> & { avatarUrl?: string; coverUrl?: string } = {
        username: data.username,
        bio: data.bio === "" ? undefined : data.bio, 
        email: data.email === user.email ? undefined : data.email, 
        socialLinks: data.socialLinks,
        avatarUrl: finalAvatarUrl,
        coverUrl: finalCoverUrl,
      };
      
      if (payload.socialLinks) {
        (Object.keys(payload.socialLinks) as Array<keyof typeof payload.socialLinks>).forEach(key => {
            if (payload.socialLinks && (payload.socialLinks[key] === '' || payload.socialLinks[key] === undefined)) {
                 payload.socialLinks[key] = undefined; 
            }
        });
        if (Object.keys(payload.socialLinks).every(key => payload.socialLinks![key as keyof typeof payload.socialLinks] === undefined)) {
            payload.socialLinks = undefined; 
        }
      }


      await apiService.put("/users/me", payload, token);
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
      await refreshAuthUser();
      if(onProfileUpdated) onProfileUpdated(); // Call callback if provided
      onOpenChange(false);
    } catch (error: any) {
      if (!formError) { 
        const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to update profile.";
        setFormError(errorMessage);
        toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Make changes to your profile. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6 pt-4">
            {formError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0"/> {formError}
              </div>
            )}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl><Input {...field} disabled={isSubmitting} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} disabled={isSubmitting} /></FormControl>
                  <FormDescription>Changing email may require re-verification.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl><Textarea placeholder="Tell us about yourself" {...field} value={field.value ?? ""} disabled={isSubmitting} className="min-h-[80px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="avatarFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      onChange={(e) => handleFileChange(e, 'avatarFile', setAvatarPreview)}
                      disabled={isSubmitting}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </FormControl>
                  {avatarPreview && <NextImage src={avatarPreview} alt="Avatar preview" width={80} height={80} className="mt-2 rounded-full object-cover border" data-ai-hint="profile avatar" />}
                  <FormDescription>Square image recommended. Max 5MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="coverFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                     <Input 
                      type="file" 
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      onChange={(e) => handleFileChange(e, 'coverFile', setCoverPreview)}
                      disabled={isSubmitting}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </FormControl>
                  {coverPreview && <NextImage src={coverPreview} alt="Cover preview" width={200} height={100} className="mt-2 rounded-md object-cover border aspect-[2/1]" data-ai-hint="profile cover" />}
                  <FormDescription>Recommended aspect ratio 2:1 or 3:1. Max 5MB.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 pt-2">
                <h3 className="text-sm font-medium text-muted-foreground">Social Links</h3>
                <FormField control={form.control} name="socialLinks.website" render={({ field }) => (<FormItem><FormLabel className="text-xs">Website</FormLabel><FormControl><Input type="url" placeholder="https://yourdomain.com" {...field} value={field.value ?? ""} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (<FormItem><FormLabel className="text-xs">Twitter</FormLabel><FormControl><Input type="url" placeholder="https://twitter.com/username" {...field} value={field.value ?? ""} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (<FormItem><FormLabel className="text-xs">Instagram</FormLabel><FormControl><Input type="url" placeholder="https://instagram.com/username" {...field} value={field.value ?? ""} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.discord" render={({ field }) => (<FormItem><FormLabel className="text-xs">Discord</FormLabel><FormControl><Input type="url" placeholder="https://discord.gg/invitecode" {...field} value={field.value ?? ""} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
            </div>

            <DialogFooter className="pt-6 border-t mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    
