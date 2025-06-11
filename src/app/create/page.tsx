
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

const nftSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  artStyle: z.string().min(2, 'Art style is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  royaltyPercentage: z.coerce.number().min(0).max(50, 'Royalty must be between 0% and 50%'),
  image: z.any().refine(files => files?.length === 1, 'Image is required.'), // Basic check, can be enhanced
  // metadata: z.string().optional(), // For simplicity, can be expanded later
});

type NftFormValues = z.infer<typeof nftSchema>;

export default function CreateNftPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<NftFormValues>({
    resolver: zodResolver(nftSchema),
    defaultValues: {
      title: '',
      description: '',
      artStyle: '',
      price: 0,
      royaltyPercentage: 5,
      image: undefined,
    },
  });

  function onSubmit(data: NftFormValues) {
    console.log('NFT data:', data);
    // Here you would typically handle file upload and minting process
    toast({
      title: 'NFT Submitted!',
      description: `${data.title} has been submitted for listing.`,
      variant: 'default',
    });
    form.reset();
    setImagePreview(null);
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', event.target.files);
    } else {
      setImagePreview(null);
      form.setValue('image', undefined);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl sm:text-3xl text-center">Create & List Your NFT</CardTitle>
          <CardDescription className="text-center">
            Fill in the details below to mint your unique digital artwork.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cosmic Dreamscape" {...field} />
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
                      <Textarea placeholder="Tell us about your artwork..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Art Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Abstract, Pop Art" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Artwork Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted transition-colors">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                          )}
                           <input id="dropzone-file" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (ETH)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="e.g., 1.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="royaltyPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Royalty Percentage</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormDescription>Percentage for secondary sales (0-50%).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* 
              <FormField
                control={form.control}
                name="metadata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Metadata (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder='e.g., {"trait_type": "Background", "value": "Blue"}' rows={3} {...field} />
                    </FormControl>
                    <FormDescription>JSON format for custom traits.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              */}
              
              <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Create and List NFT
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
