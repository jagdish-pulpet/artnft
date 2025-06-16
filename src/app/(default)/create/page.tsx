'use client';

import { useState, type ChangeEvent } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { suggestNftDetails, type SuggestNftDetailsInput, type SuggestNftDetailsOutput } from '@/ai/flows/suggest-nft-details';
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Wand2, Loader2, AlertCircle, Sparkles } from 'lucide-react';

const nftFormSchema = z.object({
  artwork: z.instanceof(FileList).refine(fileList => fileList && fileList.length === 1, 'Artwork image is required.'),
  title: z.string().min(3, 'Title must be at least 3 characters.').max(100, 'Title must be 100 characters or less.'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(1000, 'Description must be 1000 characters or less.'),
  tags: z.string()
    .min(1, 'Please provide at least one tag.')
    .refine(tags => tags.split(',').every(tag => tag.trim().length > 0 && tag.trim().length <= 20), 'Tags should be comma-separated, valid, and each tag 20 characters or less.')
    .refine(tags => tags.split(',').length <= 10, 'Maximum of 10 tags allowed.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
});

type NftFormValues = z.infer<typeof nftFormSchema>;

export default function CreateNftPage() {
  const { toast } = useToast();
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const [artworkDataUri, setArtworkDataUri] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const form = useForm<NftFormValues>({
    resolver: zodResolver(nftFormSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      price: 0.1, // Default price
    },
  });

  const handleArtworkChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        form.setError('artwork', { type: 'manual', message: 'File size should not exceed 5MB.' });
        setArtworkPreview(null);
        setArtworkDataUri(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtworkPreview(reader.result as string);
        setArtworkDataUri(reader.result as string);
        form.clearErrors('artwork');
      };
      reader.readAsDataURL(file);
    } else {
      setArtworkPreview(null);
      setArtworkDataUri(null);
    }
  };

  const handleSuggestDetails = async () => {
    if (!artworkDataUri) {
      toast({
        title: "Artwork Required",
        description: "Please upload an artwork image first to get AI suggestions.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggesting(true);
    setSuggestionError(null);
    try {
      const input: SuggestNftDetailsInput = {
        artworkDataUri,
        existingDescription: form.getValues('description') || undefined,
      };
      const suggestions: SuggestNftDetailsOutput = await suggestNftDetails(input);
      
      form.setValue('title', suggestions.title, { shouldValidate: true });
      form.setValue('description', suggestions.description, { shouldValidate: true });
      form.setValue('tags', suggestions.tags.join(', '), { shouldValidate: true });

      toast({
        title: "AI Suggestions Applied!",
        description: "Title, description, and tags have been updated.",
        action: <Sparkles className="h-5 w-5 text-accent" />,
      });

    } catch (error) {
      console.error("Error suggesting NFT details:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setSuggestionError(`Failed to get suggestions. Please try again.`);
      toast({
        title: "AI Suggestion Failed",
        description: `Could not fetch suggestions. ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const onSubmit: SubmitHandler<NftFormValues> = async (data) => {
    setIsSuggesting(true); // Re-use for submission loading state
    console.log('NFT Data:', { ...data, artwork: data.artwork[0]?.name }); // Log file name
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: "NFT Listed Successfully!",
      description: `${data.title} is now up for sale.`,
    });
    form.reset();
    setArtworkPreview(null);
    setArtworkDataUri(null);
    setIsSuggesting(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground">Create Your NFT</h1>
        <p className="text-lg text-muted-foreground mt-2">Bring your digital art to life on the blockchain.</p>
      </header>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center"><UploadCloud className="mr-3 h-6 w-6 text-accent" />Artwork</CardTitle>
            <CardDescription>Upload the digital art (PNG, JPG, GIF, max 5MB).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="artwork-upload-button" className={form.formState.errors.artwork ? 'text-destructive' : ''}>Upload Image</Label>
              <Input
                id="artwork"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden" // Visually hidden, triggered by button
                {...form.register('artwork', { onChange: handleArtworkChange })}
              />
              <Button id="artwork-upload-button" type="button" variant="outline" onClick={() => document.getElementById('artwork')?.click()} className="w-full justify-start text-muted-foreground hover:text-accent hover:border-accent">
                {artworkPreview ? 'Change File' : 'Choose File'}
              </Button>
              {form.formState.errors.artwork && (
                  <p className="text-sm text-destructive mt-1.5">{form.formState.errors.artwork.message?.toString()}</p>
              )}
              {artworkPreview && (
                <div className="mt-4 border rounded-lg p-3 inline-block bg-muted/30 shadow-inner max-w-xs">
                  <Image src={artworkPreview} alt="Artwork preview" width={200} height={200} className="rounded-md object-contain max-h-48 w-auto mx-auto" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <CardTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-3 h-6 w-6 text-accent"/>Details</CardTitle>
                    <CardDescription>Describe your NFT. Use AI to get suggestions!</CardDescription>
                </div>
                <Button type="button" onClick={handleSuggestDetails} disabled={isSuggesting || !artworkPreview} variant="outline" className="shrink-0 border-accent text-accent hover:bg-accent/90 hover:text-accent-foreground w-full sm:w-auto">
                {isSuggesting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Suggest with AI
                </Button>
            </div>
             {suggestionError && (
              <div className="mt-3 text-sm text-destructive flex items-center p-3 bg-destructive/10 rounded-md border border-destructive/30">
                <AlertCircle className="mr-2 h-4 w-4 shrink-0" /> {suggestionError}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="title" className={form.formState.errors.title ? 'text-destructive' : ''}>Title</Label>
              <Input id="title" placeholder="e.g., 'Sunset Over Metaverse'" {...form.register('title')} aria-invalid={!!form.formState.errors.title} />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className={form.formState.errors.description ? 'text-destructive' : ''}>Description</Label>
              <Textarea
                id="description"
                placeholder="A detailed description of your artwork, its inspiration, style, etc."
                rows={5}
                {...form.register('description')}
                aria-invalid={!!form.formState.errors.description}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags" className={form.formState.errors.tags ? 'text-destructive' : ''}>Tags (comma-separated, max 10)</Label>
              <Input id="tags" placeholder="e.g., abstract, futuristic, vibrant, 3d" {...form.register('tags')} aria-invalid={!!form.formState.errors.tags}/>
              {form.formState.errors.tags && (
                <p className="text-sm text-destructive">{form.formState.errors.tags.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Pricing &amp; Listing</CardTitle>
            <CardDescription>Set the price for your NFT in ETH and list it on the marketplace.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label htmlFor="price" className={form.formState.errors.price ? 'text-destructive' : ''}>Price (ETH)</Label>
              <Input id="price" type="number" step="0.001" placeholder="e.g., 1.5" {...form.register('price')} aria-invalid={!!form.formState.errors.price} />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="pt-2">
            <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-3" disabled={form.formState.isSubmitting || isSuggesting}>
              {(form.formState.isSubmitting || isSuggesting) && !suggestionError ? ( // Show loader if submitting or AI is suggesting (and no error)
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              Create and List NFT
            </Button>
        </div>
      </form>
    </div>
  );
}
