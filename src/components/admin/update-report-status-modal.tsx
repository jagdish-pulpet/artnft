
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, UserCircle, FileTextIcon, PackageIcon, PaletteIcon, MessageSquareIcon } from "lucide-react";
import type { Report, ReportStatus as ReportStatusEnum } from "@/types/entities";
import Link from "next/link";

const updateReportStatusFormSchema = z.object({
  status: z.nativeEnum(ReportStatusEnum, {
    required_error: "Report status is required.",
  }),
  adminNotes: z.string().max(1000, "Admin notes must be at most 1000 characters.").optional().or(z.literal('')),
});

type UpdateReportStatusFormValues = z.infer<typeof updateReportStatusFormSchema>;

interface UpdateReportStatusModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reportToUpdate: Report | null;
  onReportUpdated: () => void;
}

export function UpdateReportStatusModal({ isOpen, onOpenChange, reportToUpdate, onReportUpdated }: UpdateReportStatusModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<UpdateReportStatusFormValues>({
    resolver: zodResolver(updateReportStatusFormSchema),
  });

  useEffect(() => {
    if (reportToUpdate && isOpen) {
      form.reset({
        status: reportToUpdate.status || ReportStatusEnum.PENDING_REVIEW,
        adminNotes: reportToUpdate.adminNotes || "",
      });
    }
  }, [reportToUpdate, isOpen, form]);

  const onSubmit = async (data: UpdateReportStatusFormValues) => {
    if (!token || !reportToUpdate) {
      toast({ title: "Error", description: "Authentication required or Report not found.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    try {
      await apiService.put(`/admin/reports/${reportToUpdate.id}/status`, data, token);
      toast({ title: "Report Status Updated", description: `Status for report ${reportToUpdate.id} has been successfully updated.` });
      onReportUpdated();
      onOpenChange(false);
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to update report status.";
      setFormError(errorMessage);
      toast({ title: "Update Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reportStatusOptions = Object.values(ReportStatusEnum);
  
  const getItemTypeIcon = (itemType: string) => {
    switch(itemType) {
        case 'NFT': return <PackageIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case 'COLLECTION': return <PaletteIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case 'USER': return <UserCircle className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case 'COMMENT': return <MessageSquareIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        default: return <FileTextIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Report Details & Update Status</DialogTitle>
          <DialogDescription>Review the report details and update its status.</DialogDescription>
        </DialogHeader>
        
        {reportToUpdate && (
            <div className="px-6 py-4 space-y-3 text-sm border-b">
                <h3 className="font-semibold text-base text-primary mb-2">Report Information</h3>
                <div className="grid grid-cols-3 gap-x-2 gap-y-1.5">
                    <span className="font-medium text-muted-foreground col-span-1">Report ID:</span>
                    <span className="col-span-2 break-words">{reportToUpdate.id}</span>

                    <span className="font-medium text-muted-foreground col-span-1">Reported By:</span>
                    <span className="col-span-2">
                        {reportToUpdate.reporter ? (
                             <Link href={`/profile/${reportToUpdate.reporter.id}`} target="_blank" className="text-accent hover:underline">{reportToUpdate.reporter.username}</Link>
                        ) : 'N/A'}
                         (ID: {reportToUpdate.reporterId})
                    </span>
                    
                    <span className="font-medium text-muted-foreground col-span-1">Reported Item Type:</span>
                    <span className="col-span-2 flex items-center">{getItemTypeIcon(reportToUpdate.reportedItemType)} {reportToUpdate.reportedItemType}</span>

                    <span className="font-medium text-muted-foreground col-span-1">Reported Item ID:</span>
                    <span className="col-span-2 break-words">{reportToUpdate.reportedItemId}</span>
                    
                    <span className="font-medium text-muted-foreground col-span-1">Reason:</span>
                    <span className="col-span-2">{reportToUpdate.reason}</span>

                    <span className="font-medium text-muted-foreground col-span-1">Details:</span>
                    <p className="col-span-2 whitespace-pre-wrap break-words">{reportToUpdate.details || 'No additional details provided.'}</p>

                     <span className="font-medium text-muted-foreground col-span-1">Reported At:</span>
                     <span className="col-span-2">{new Date(reportToUpdate.createdAt).toLocaleString()}</span>

                    {reportToUpdate.resolvedByUser && (
                        <>
                        <span className="font-medium text-muted-foreground col-span-1">Resolved By:</span>
                        <span className="col-span-2">{reportToUpdate.resolvedByUser.username} (ID: {reportToUpdate.resolvedByUserId})</span>
                        <span className="font-medium text-muted-foreground col-span-1">Resolved At:</span>
                        <span className="col-span-2">{reportToUpdate.resolvedAt ? new Date(reportToUpdate.resolvedAt).toLocaleString() : 'N/A'}</span>
                        </>
                    )}
                </div>
            </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pb-6 pt-4">
            {formError && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0"/> {formError}
              </div>
            )}
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select new status" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {reportStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="adminNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Notes</FormLabel>
                  <FormControl><Textarea placeholder="Internal notes regarding this report and actions taken..." {...field} value={field.value ?? ''} disabled={isSubmitting} className="min-h-[100px]" /></FormControl>
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

