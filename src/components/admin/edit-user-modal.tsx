
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import type { User, UserRole as UserRoleEnum } from "@/types/entities"; // Import UserRoleEnum

const socialLinksSchema = z.object({
  twitter: z.string().url({ message: "Invalid Twitter URL (must include https://)" }).optional().or(z.literal('')),
  instagram: z.string().url({ message: "Invalid Instagram URL (must include https://)" }).optional().or(z.literal('')),
  website: z.string().url({ message: "Invalid Website URL (must include https://)" }).optional().or(z.literal('')),
  discord: z.string().url({ message: "Invalid Discord server URL (must include https://)" }).optional().or(z.literal('')),
});

// Schema based on AdminUpdateUserDto from backend
const editUserFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username must be at most 20 characters.").optional(),
  email: z.string().email("Invalid email address.").optional(),
  roles: z.array(z.nativeEnum(UserRoleEnum)).min(1, "User must have at least one role.").optional(),
  isEmailVerified: z.boolean().optional(),
  isWalletVerified: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
  avatarUrl: z.string().url("Invalid avatar URL.").optional().or(z.literal('')),
  coverUrl: z.string().url("Invalid cover URL.").optional().or(z.literal('')),
  bio: z.string().max(500, "Bio must be at most 500 characters.").optional().or(z.literal('')),
  socialLinks: socialLinksSchema.optional(),
});

type EditUserFormValues = z.infer<typeof editUserFormSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userToEdit: User | null;
  onUserUpdated: () => void; // Callback to refresh the user list
}

export function EditUserModal({ isOpen, onOpenChange, userToEdit, onUserUpdated }: EditUserModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    // Default values will be set by useEffect when userToEdit is available
  });

  useEffect(() => {
    if (userToEdit && isOpen) {
      form.reset({
        username: userToEdit.username || "",
        email: userToEdit.email || "",
        roles: userToEdit.roles || [],
        isEmailVerified: userToEdit.isEmailVerified || false,
        isWalletVerified: userToEdit.isWalletVerified || false,
        isSuspended: userToEdit.isSuspended || false,
        avatarUrl: userToEdit.avatarUrl || "",
        coverUrl: userToEdit.coverUrl || "",
        bio: userToEdit.bio || "",
        socialLinks: {
          twitter: userToEdit.socialLinks?.twitter || "",
          instagram: userToEdit.socialLinks?.instagram || "",
          website: userToEdit.socialLinks?.website || "",
          discord: userToEdit.socialLinks?.discord || "",
        },
      });
    }
  }, [userToEdit, isOpen, form]);

  const onSubmit = async (data: EditUserFormValues) => {
    if (!token || !userToEdit) {
      toast({ title: "Error", description: "Authentication required or user not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    const payload: Partial<EditUserFormValues> = {};
    // Only include fields that have changed or are explicitly set
    (Object.keys(data) as Array<keyof EditUserFormValues>).forEach(key => {
      if (data[key] !== undefined && data[key] !== userToEdit[key as keyof User]) { // Basic check, needs refinement for objects/arrays
         if (key === 'socialLinks') {
            const changedSocialLinks: Partial<typeof data.socialLinks> = {};
            let hasSocialChanges = false;
            (Object.keys(data.socialLinks || {}) as Array<keyof NonNullable<typeof data.socialLinks>>).forEach(socialKey => {
                if (data.socialLinks?.[socialKey] !== userToEdit.socialLinks?.[socialKey]) {
                    changedSocialLinks[socialKey] = data.socialLinks?.[socialKey] === '' ? undefined : data.socialLinks?.[socialKey]; // Send undefined to clear
                    hasSocialChanges = true;
                }
            });
            if (hasSocialChanges) payload.socialLinks = data.socialLinks; // Send the whole object if any part changed
        } else {
          (payload as any)[key] = data[key];
        }
      }
    });
    
    // If email is same as original, don't send it in payload unless necessary for backend logic
    if (data.email === userToEdit.email) delete payload.email;


    // If no actual changes were made to the specific fields the backend DTO accepts, inform user.
    // This is a simplified check. A more robust check would compare against `AdminUpdateUserDto` fields.
    const updatableKeys: (keyof EditUserFormValues)[] = ['username', 'email', 'roles', 'isEmailVerified', 'isWalletVerified', 'isSuspended', 'avatarUrl', 'coverUrl', 'bio', 'socialLinks'];
    const hasChanges = updatableKeys.some(key => {
        if (key === 'socialLinks') {
            return JSON.stringify(data.socialLinks) !== JSON.stringify(userToEdit.socialLinks);
        }
        return data[key] !== undefined && (userToEdit as any)[key] !== data[key];
    });

    if (!hasChanges) {
        toast({ title: "No Changes", description: "No changes were made to the user's profile." });
        setIsSubmitting(false);
        onOpenChange(false);
        return;
    }


    try {
      await apiService.put(`/admin/users/${userToEdit.id}`, data, token); // Send full 'data' as backend DTO expects optional fields
      toast({ title: "User Updated", description: `${userToEdit.username}'s profile has been successfully updated.` });
      onUserUpdated(); // Callback to refresh list
      onOpenChange(false); // Close modal
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to update user profile.";
      setFormError(errorMessage);
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const UserRoleOptions = Object.values(UserRoleEnum);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Edit User: {userToEdit?.username}</DialogTitle>
          <DialogDescription>Modify user details. Changes will be applied immediately.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6 pt-4">
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
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
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Roles</FormLabel>
                        <Controller
                            control={form.control}
                            name="roles"
                            render={({ field: controllerField }) => (
                                <Select
                                    onValueChange={(selectedRoleString) => {
                                        // Assuming single role selection for simplicity, backend DTO takes array
                                        // For multi-select, a different component (e.g. multi-select Checkbox group) would be needed
                                        const selectedRole = selectedRoleString as UserRoleEnum;
                                        controllerField.onChange([selectedRole]); 
                                    }}
                                    value={controllerField.value?.[0] || ''} // Display first role if array, or empty
                                    disabled={isSubmitting}
                                >
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select role(s)" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {UserRoleOptions.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormDescription>Select user roles. (UI supports single selection for now)</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="isEmailVerified" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Email Verified</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/></FormControl></FormItem> )} />
                <FormField control={form.control} name="isWalletVerified" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Wallet Verified</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/></FormControl></FormItem> )} />
            </div>
             <FormField control={form.control} name="isSuspended" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-destructive/5"><div className="space-y-0.5"><FormLabel className="text-destructive">User Suspended</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} /></FormControl></FormItem> )} />
            
            <FormField control={form.control} name="bio" render={({ field }) => ( <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea placeholder="User bio" {...field} value={field.value ?? ''} disabled={isSubmitting} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="avatarUrl" render={({ field }) => ( <FormItem><FormLabel>Avatar URL</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="coverUrl" render={({ field }) => ( <FormItem><FormLabel>Cover URL</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem> )} />

            <div className="space-y-2 pt-2">
                <h3 className="text-sm font-medium text-muted-foreground">Social Links</h3>
                 <FormField control={form.control} name="socialLinks.website" render={({ field }) => (<FormItem><FormLabel className="text-xs">Website</FormLabel><FormControl><Input type="url" placeholder="https://..." {...field} value={field.value ?? ''} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.twitter" render={({ field }) => (<FormItem><FormLabel className="text-xs">Twitter</FormLabel><FormControl><Input type="url" placeholder="https://twitter.com/..." {...field} value={field.value ?? ''} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.instagram" render={({ field }) => (<FormItem><FormLabel className="text-xs">Instagram</FormLabel><FormControl><Input type="url" placeholder="https://instagram.com/..." {...field} value={field.value ?? ''} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="socialLinks.discord" render={({ field }) => (<FormItem><FormLabel className="text-xs">Discord</FormLabel><FormControl><Input type="url" placeholder="https://discord.gg/..." {...field} value={field.value ?? ''} disabled={isSubmitting}/></FormControl><FormMessage /></FormItem>)}/>
            </div>

            <DialogFooter className="pt-6 border-t">
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
