
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import type { Nft } from "@/types/entities";
import { AdminNftReviewStatus } from "@/types/entities";

const updateNftStatusFormSchema = z.object({
  adminReviewStatus: z.nativeEnum(AdminNftReviewStatus).optional(),
  isVerifiedByAdmin: z.boolean().optional(),
  isListedForSale: z.boolean().optional(),
  adminNotes: z.string().max(1000, "Admin notes must be at most 1000 characters.").optional().or(z.literal('')),
});

type UpdateNftStatusFormValues = z.infer<typeof updateNftStatusFormSchema>;

interface UpdateNftStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nftToUpdate: Nft | null;
  onNftUpdated: () => void;
}

export function UpdateNftStatusModal({ isOpen, onOpenChange, nftToUpdate, onNftUpdated }: UpdateNftStatusModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<UpdateNftStatusFormValues>({
    resolver: zodResolver(updateNftStatusFormSchema),
  });

  useEffect(() => {
    if (nftToUpdate && isOpen) {
      form.reset({
        adminReviewStatus: nftToUpdate.adminReviewStatus || AdminNftReviewStatus.PENDING,
        isVerifiedByAdmin: nftToUpdate.isVerifiedByAdmin || false,
        isListedForSale: nftToUpdate.isListedForSale || false,
        adminNotes: nftToUpdate.adminNotes || "",
      });
    }
  }, [nftToUpdate, isOpen, form]);

  const onSubmit = async (data: UpdateNftStatusFormValues) => {
    if (!token || !nftToUpdate) {
      toast({ title: "Error", description: "Authentication required or NFT not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    try {
      await apiService.put(`/admin/nfts/${nftToUpdate.id}/status`, data, token);
      toast({ title: "NFT Status Updated", description: `Status for ${nftToUpdate.title} has been successfully updated.` });
      onNftUpdated();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to update NFT status.";
      setFormError(errorMessage);
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewStatusOptions = Object.values(AdminNftReviewStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update NFT Status: {nftToUpdate?.title}</DialogTitle>
          <DialogDescription>Modify the review and verification status of this NFT.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {formError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0"/> {formError}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="adminReviewStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Review Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select review status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {reviewStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="isVerifiedByAdmin" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Verified by Admin</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/></FormControl></FormItem> )} />
                <FormField control={form.control} name="isListedForSale" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Listed for Sale</FormLabel></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting}/></FormControl></FormItem> )} />
            </div>

            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl><Textarea placeholder="Internal notes for this NFT..." {...field} value={field.value ?? ''} disabled={isSubmitting} className="min-h-[80px]" /></FormControl>
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
