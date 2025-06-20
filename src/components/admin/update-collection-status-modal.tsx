
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Collection } from "@/types/entities";

const updateCollectionStatusFormSchema = z.object({
  isVerified: z.boolean().optional(),
  adminNotes: z.string().max(1000, "Admin notes must be at most 1000 characters.").optional().or(z.literal('')),
});

type UpdateCollectionStatusFormValues = z.infer<typeof updateCollectionStatusFormSchema>;

interface UpdateCollectionStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  collectionToUpdate: Collection | null;
  onCollectionUpdated: () => void;
}

export function UpdateCollectionStatusModal({ isOpen, onOpenChange, collectionToUpdate, onCollectionUpdated }: UpdateCollectionStatusModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<UpdateCollectionStatusFormValues>({
    resolver: zodResolver(updateCollectionStatusFormSchema),
  });

  useEffect(() => {
    if (collectionToUpdate && isOpen) {
      form.reset({
        isVerified: collectionToUpdate.isVerified || false,
        adminNotes: collectionToUpdate.adminNotes || "",
      });
    }
  }, [collectionToUpdate, isOpen, form]);

  const onSubmit = async (data: UpdateCollectionStatusFormValues) => {
    if (!token || !collectionToUpdate) {
      toast({ title: "Error", description: "Authentication required or Collection not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    try {
      await apiService.put(`/admin/collections/${collectionToUpdate.id}/status`, data, token);
      toast({ title: "Collection Status Updated", description: `Status for ${collectionToUpdate.name} has been successfully updated.` });
      onCollectionUpdated();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to update collection status.";
      setFormError(errorMessage);
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Collection Status: {collectionToUpdate?.name}</DialogTitle>
          <DialogDescription>Modify the verification status of this collection.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {formError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0"/> {formError}
              </div>
            )}
            
            <FormField control={form.control} name="isVerified" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Verified Collection</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/></FormControl></FormItem> )} />
            
            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl><Textarea placeholder="Internal notes for this collection..." {...field} value={field.value ?? ''} disabled={isSubmitting} className="min-h-[80px]" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
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
