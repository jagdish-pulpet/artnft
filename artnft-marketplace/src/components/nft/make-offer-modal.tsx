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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/providers/auth-provider";
import { apiService, ApiError } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, AlertTriangle, Tag, CalendarDays } from "lucide-react";
import type { Nft } from "@/types/entities"; 
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SUPPORTED_CURRENCIES = [
  { value: 'ETH', label: 'ETH (Ethereum)' },
  { value: 'MATIC', label: 'MATIC (Polygon)' },
  { value: 'USDC', label: 'USDC (USD Coin)' },
  { value: 'WETH', label: 'WETH (Wrapped Ether)' },
];

const makeOfferFormSchema = z.object({
  offerAmount: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number({ required_error: "Offer amount is required.", invalid_type_error: "Offer amount must be a number." })
     .positive("Offer amount must be positive.")
     .min(0.000001, "Offer amount is too small.")
  ),
  currency: z.string().min(1, "Currency is required."),
  expiresAt: z.date().optional().refine(date => !date || date > new Date(), {
    message: "Expiration date must be in the future.",
  }),
});

type MakeOfferFormValues = z.infer<typeof makeOfferFormSchema>;

interface MakeOfferModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nft: Nft; 
  onOfferMade: () => void; 
}

export function MakeOfferModal({ isOpen, onOpenChange, nft, onOfferMade }: MakeOfferModalProps) {
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<MakeOfferFormValues>({
    resolver: zodResolver(makeOfferFormSchema),
    defaultValues: {
      currency: nft?.currency || "ETH",
      offerAmount: undefined,
      expiresAt: undefined,
    },
  });

  useEffect(() => {
    if (nft && isOpen) {
      form.reset({
        currency: nft.currency || "ETH",
        offerAmount: undefined,
        expiresAt: undefined,
      });
      setFormError(null);
    }
  }, [nft, isOpen, form]);

  const onSubmit = async (data: MakeOfferFormValues) => {
    if (!isAuthenticated || !token) {
      toast({ title: "Authentication Required", description: "Please sign in to make an offer.", variant: "destructive" });
      return;
    }
    if (!nft) {
        toast({ title: "Error", description: "NFT data not available.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    setFormError(null);

    const payload = {
      offerAmount: data.offerAmount,
      currency: data.currency,
      expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
    };

    try {
      await apiService.post(`/nfts/${nft.id}/offers`, payload, token);
      toast({ title: "Offer Submitted Successfully!", description: `Your offer for ${nft.title} has been placed.` });
      onOfferMade(); 
      onOpenChange(false); 
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to submit offer. Please try again.";
      setFormError(errorMessage);
      toast({ title: "Offer Submission Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if(!isSubmitting) onOpenChange(open);}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Tag className="mr-2 h-5 w-5 text-primary"/> Make an Offer for {nft?.title}
          </DialogTitle>
          <DialogDescription>
            Enter your offer details below. Offers are binding if accepted by the owner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {formError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <FormField
              control={form.control}
              name="offerAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Amount</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g., 0.5" {...field} disabled={isSubmitting} step="any" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={isSubmitting}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {SUPPORTED_CURRENCIES.map(curr => <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="expiresAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Offer Expiration (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm") 
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                          <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                            if (date) {
                                const currentHours = field.value?.getHours() || new Date().getHours();
                                const currentMinutes = field.value?.getMinutes() || new Date().getMinutes();
                                date.setHours(currentHours, currentMinutes);
                            }
                            field.onChange(date);
                        }}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <FormLabel className="text-xs">Time (24h)</FormLabel>
                        <div className="flex gap-2">
                        <Input type="time" 
                            defaultValue={field.value ? format(field.value, "HH:mm") : format(new Date().setHours(23,59), "HH:mm")}
                            onChange={(e) => {
                                const time = e.target.value;
                                if (field.value && time) {
                                    const [hours, minutes] = time.split(':').map(Number);
                                    const newDate = new Date(field.value);
                                    newDate.setHours(hours, minutes);
                                    field.onChange(newDate);
                                } else if (time) { 
                                    const [hours, minutes] = time.split(':').map(Number);
                                    const newDate = new Date(); // Defaults to today if no date was picked
                                    newDate.setHours(hours, minutes, 0, 0);
                                    field.onChange(newDate);
                                }
                            }}
                            className="w-full"
                            disabled={isSubmitting}
                        />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When your offer will automatically expire. Defaults to 7 days if not set.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Submitting Offer...' : 'Submit Offer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

