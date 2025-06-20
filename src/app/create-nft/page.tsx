
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, PlusSquare, UploadCloud, Loader2, AlertTriangle, PlusCircle, Trash2, Percent, WalletCards } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, ChangeEvent, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { apiService, ApiError } from '@/lib/apiService';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import type { Collection, NftListingType as NftListingTypeEnum, NftProperty } from '@/types/entities';


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for NFT media
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

const fileSchema = z.custom<File>((val) => val instanceof File, "Please select an image file.")
  .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than ${MAX_FILE_SIZE / (1024*1024)}MB.`)
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png, .webp, .gif and .svg formats are supported.");

const propertySchema = z.object({
  trait_type: z.string().min(1, "Trait type is required.").max(50, "Trait type too long."),
  value: z.string().min(1, "Trait value is required.").max(100, "Trait value too long."),
});

const SUPPORTED_CURRENCIES = [
  { value: 'ETH', label: 'ETH (Ethereum)' },
  { value: 'MATIC', label: 'MATIC (Polygon)' },
  { value: 'USDC', label: 'USDC (USD Coin)' },
  { value: 'WETH', label: 'WETH (Wrapped Ether)' },
];

const createNftFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100, "Title must be 100 characters or less."),
  description: z.string().max(2000, "Description must be 2000 characters or less.").optional(),
  imageFile: fileSchema,
  imageUrl: z.string().url("A valid image URL is required after upload.").optional(),
  price: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : parseFloat(String(val)),
    z.number({ invalid_type_error: "Price must be a number."}).min(0, "Price cannot be negative.").optional()
  ),
  currency: z.string().optional().default("ETH"),
  collectionId: z.string().uuid("Invalid collection ID.").optional().or(z.literal("")),
  isListedForSale: z.boolean().optional().default(true),
  listingType: z.nativeEnum(NftListingTypeEnum).optional(),
  properties: z.array(propertySchema).max(10, "Maximum 10 properties allowed.").optional(),
  royaltyRecipient: z.string()
    .refine((val) => val === '' || val === undefined || /^0x[a-fA-F0-9]{40}$/.test(val), {
      message: "Invalid Ethereum address for royalty recipient or leave empty."
    })
    .optional(),
  royaltyPercentage: z.preprocess(
    (val) => (val === "" || val === undefined || val === null) ? undefined : parseFloat(String(val)),
    z.number({ invalid_type_error: "Royalty percentage must be a number."})
      .min(0, "Royalty percentage cannot be negative.")
      .max(25, "Royalty percentage cannot exceed 25%.")
      .optional()
  ),
}).refine(data => !(data.royaltyPercentage && !data.royaltyRecipient), {
  message: "Royalty recipient address is required if royalty percentage is set.",
  path: ["royaltyRecipient"],
}).refine(data => !(data.royaltyRecipient && (data.royaltyPercentage === undefined || data.royaltyPercentage === null)), {
  message: "Royalty percentage is required if royalty recipient is set.",
  path: ["royaltyPercentage"],
});


type CreateNftFormValues = z.infer<typeof createNftFormSchema>;

interface UploadResponse {
  url: string;
  originalName: string;
  size: number;
}

const nftListingTypeOptions = Object.values(NftListingTypeEnum).map(value => ({
  value,
  label: value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}));


export default function CreateNftPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { token, isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [isSubmitting, setIsSubmitting = useState(false);
  const [formError, setFormError = useState<string | null>(null);
  const [imagePreview, setImagePreview = useState<string | null>(null);
  const [availableCollections, setAvailableCollections = useState<Collection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections = useState(true);

  const form = useForm<CreateNftFormValues>({
    resolver: zodResolver(createNftFormSchema),
    defaultValues: {
      title: '',
      description: '',
      currency: 'ETH',
      isListedForSale: true,
      listingType: NftListingTypeEnum.FIXED_PRICE,
      properties: [],
      royaltyRecipient: '',
      royaltyPercentage: undefined,
      collectionId: "",
    },
  });
  
  const { fields: propertyFields, append: appendProperty, remove: removeProperty } = useFieldArray({
    control: form.control,
    name: "properties"
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const fetchUserCollections = useCallback(async () => {
    if (!token || !user?.id) return;
    setIsLoadingCollections(true);
    try {
      const response = await apiService.get<{ data: Collection[] }>(`/collections?creatorId=${user.id}`, token); 
      setAvailableCollections(response.data || []);
    } catch (error) {
      console.error("Failed to fetch user collections:", error);
      toast({ title: "Error", description: "Could not load your collections for selection.", variant: "destructive" });
    } finally {
      setIsLoadingCollections(false);
    }
  }, [token, user?.id, toast]);

  useEffect(() => {
    if(isAuthenticated && token && user?.id) {
      fetchUserCollections();
    }
  }, [isAuthenticated, token, user?.id, fetchUserCollections]);

  const handleImageFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      form.setValue('imageFile', undefined);
      setImagePreview(null);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!token) {
      setFormError("Authentication token not found. Please sign in again.");
      return null;
    }
    const formData = new FormData();
    formData.append('imageFile', file);
    try {
      const response = await apiService.post<{ data: UploadResponse }>('/upload/image', formData, token);
      return response.data.url;
    } catch (uploadError: any) {
      const errorMsg = uploadError instanceof ApiError ? uploadError.data?.message || uploadError.message : "Image upload failed.";
      setFormError(`Image Upload Error: ${errorMsg}`);
      toast({ title: "Image Upload Failed", description: errorMsg, variant: "destructive" });
      return null;
    }
  };

  const onSubmit = async (data: CreateNftFormValues) => {
    if (!isAuthenticated || !token || !user) {
      toast({ title: "Authentication Required", description: "Please sign in to create an NFT.", variant: "destructive" });
      router.push('/signin');
      return;
    }
    setIsSubmitting(true);
    setFormError(null);

    let uploadedImageUrl = data.imageUrl; // Not typically used directly unless pre-filled
    if (data.imageFile) {
      const urlFromFile = await uploadImage(data.imageFile);
      if (!urlFromFile) {
        setIsSubmitting(false);
        return;
      }
      uploadedImageUrl = urlFromFile;
    }
    if (!uploadedImageUrl) {
      setFormError("NFT image is required.");
      form.setError("imageFile", {type: "manual", message: "Image is required."});
      setIsSubmitting(false);
      return;
    }

    const royaltiesPayload = (data.royaltyRecipient && data.royaltyPercentage !== undefined)
      ? [{ recipientAddress: data.royaltyRecipient, percentagePoints: data.royaltyPercentage }]
      : undefined;

    const payload = {
      title: data.title,
      description: data.description || undefined,
      imageUrl: uploadedImageUrl,
      price: data.price,
      currency: data.currency,
      collectionId: data.collectionId === "" ? undefined : data.collectionId,
      isListedForSale: data.isListedForSale,
      listingType: data.listingType,
      properties: data.properties && data.properties.length > 0 ? data.properties : undefined,
      royalties: royaltiesPayload,
    };
    
    try {
      const response = await apiService.post<{ data: { id: string; slug?: string } }>('/nfts', payload, token);
      toast({
        title: 'NFT Created!',
        description: `Your NFT "${payload.title}" has been successfully minted.`,
      });
      router.push(`/nft/${response.data.slug || response.data.id}`);
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Failed to create NFT.';
      setFormError(errorMessage);
      toast({ title: 'Creation Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!isAuthenticated && !isAuthLoading) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/home"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
            </Button>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card className="shadow-xl rounded-xl max-w-3xl mx-auto">
                <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <PlusSquare className="h-12 w-12 sm:h-14 sm:w-14 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                    <div>
                      <CardTitle className="text-3xl sm:text-4xl font-headline text-primary tracking-tight">Create New NFT</CardTitle>
                      <CardDescription className="mt-1 text-base">Mint and list your unique digital creation.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 sm:p-8 space-y-6">
                  {formError && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2"><AlertTriangle className="h-5 w-5 flex-shrink-0"/>{formError}</div>}

                  <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Title <span className="text-destructive">*</span></FormLabel><FormControl><Input placeholder="e.g., My Amazing Artwork" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description..." {...field} value={field.value ?? ""} disabled={isSubmitting} className="min-h-[100px]" /></FormControl><FormMessage /></FormItem>)} />
                  
                  <FormField control={form.control} name="imageFile" render={() => (
                    <FormItem>
                      <FormLabel>NFT Image/Media <span className="text-destructive">*</span></FormLabel>
                      <FormControl><Input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} onChange={handleImageFileChange} disabled={isSubmitting} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/></FormControl>
                      {imagePreview && <div className="mt-2 border rounded-md p-2 inline-block max-w-xs"><NextImage src={imagePreview} alt="Image preview" width={200} height={200} className="max-h-48 w-auto object-contain rounded" data-ai-hint="NFT image artwork"/></div>}
                      <FormDescription>Max {MAX_FILE_SIZE / (1024*1024)}MB. JPG, PNG, GIF, WEBP, SVG.</FormDescription><FormMessage />
                    </FormItem>
                  )} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="price" render={({ field }) => (<FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" placeholder="e.g., 0.5" {...field} value={field.value ?? ''} disabled={isSubmitting} step="any" /></FormControl><FormDescription>Leave blank if not for sale.</FormDescription><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="currency" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || !form.watch('price')}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {SUPPORTED_CURRENCIES.map(curr => <SelectItem key={curr.value} value={curr.value}>{curr.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="collectionId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} disabled={isSubmitting || isLoadingCollections}>
                        <FormControl><SelectTrigger><SelectValue placeholder={isLoadingCollections ? "Loading your collections..." : "Select a collection (optional)"} /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {availableCollections.map(collection => <SelectItem key={collection.id} value={collection.id}>{collection.name}</SelectItem>)}
                          {availableCollections.length === 0 && !isLoadingCollections && <FormItem><FormDescription className="p-2 text-center">You haven't created any collections yet.</FormDescription></FormItem>}
                        </SelectContent>
                      </Select>
                      <FormDescription>Assign this NFT to one of your collections. <Link href="/collections/create" className="text-accent hover:underline">Create a new collection</Link>.</FormDescription><FormMessage />
                    </FormItem>
                  )} />

                  <Card className="bg-muted/30">
                    <CardHeader><CardTitle className="text-lg flex items-center"><WalletCards className="mr-2 h-5 w-5 text-primary"/> NFT Properties (Traits)</CardTitle><CardDescription>Add custom traits to your NFT.</CardDescription></CardHeader>
                    <CardContent className="space-y-3">
                      {propertyFields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end p-2 border rounded-md">
                          <FormField control={form.control} name={`properties.${index}.trait_type`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Trait Type</FormLabel><FormControl><Input placeholder="e.g., Color" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                          <FormField control={form.control} name={`properties.${index}.value`} render={({ field }) => (<FormItem><FormLabel className="text-xs">Value</FormLabel><FormControl><Input placeholder="e.g., Blue" {...field} disabled={isSubmitting} /></FormControl><FormMessage /></FormItem>)} />
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeProperty(index)} disabled={isSubmitting} aria-label="Remove property"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      ))}
                      {propertyFields.length < 10 && <Button type="button" variant="outline" size="sm" onClick={() => appendProperty({ trait_type: '', value: '' })} disabled={isSubmitting || propertyFields.length >= 10}><PlusCircle className="mr-2 h-4 w-4"/>Add Trait</Button>}
                      {propertyFields.length >= 10 && <FormDescription className="text-xs">Maximum of 10 properties reached.</FormDescription>}
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                     <CardHeader><CardTitle className="text-lg flex items-center"><Percent className="mr-2 h-5 w-5 text-primary"/>Royalties</CardTitle><CardDescription>Set a royalty percentage for secondary sales.</CardDescription></CardHeader>
                     <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="royaltyPercentage" render={({ field }) => (<FormItem><FormLabel>Percentage (%)</FormLabel><FormControl><Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} disabled={isSubmitting} step="0.1" /></FormControl><FormDescription>0-25%</FormDescription><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="royaltyRecipient" render={({ field }) => (<FormItem><FormLabel>Recipient Wallet Address</FormLabel><FormControl><Input placeholder="0x..." {...field} value={field.value ?? ""} disabled={isSubmitting} /></FormControl><FormDescription>Leave blank if no royalty.</FormDescription><FormMessage /></FormItem>)} />
                     </CardContent>
                  </Card>
                  
                  <div className="space-y-4 border-t pt-6">
                     <FormField control={form.control} name="isListedForSale" render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5"><FormLabel>List for Sale Immediately</FormLabel><FormDescription>If checked, your NFT will be listed (if price is set).</FormDescription></div>
                          <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting || !form.watch('price')} /></FormControl>
                        </FormItem>
                      )} />
                     <FormField control={form.control} name="listingType" render={({ field }) => (
                        <FormItem className={!form.watch('isListedForSale') || !form.watch('price') ? 'opacity-50' : ''}>
                          <FormLabel>Listing Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting || !form.watch('isListedForSale') || !form.watch('price')}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select listing type" /></SelectTrigger></FormControl>
                            <SelectContent>{nftListingTypeOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                  <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting || isLoadingCollections}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Creating NFT...' : 'Create NFT'}
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

    