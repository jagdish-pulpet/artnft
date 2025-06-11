
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
import { UploadCloud, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useState, Fragment } from 'react';

const nftSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  artStyle: z.string().min(2, 'Art style is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  royaltyPercentage: z.coerce.number().min(0).max(50, 'Royalty must be between 0% and 50%'),
  image: z.any().refine(files => files?.length === 1, 'Image is required.'),
});

type NftFormValues = z.infer<typeof nftSchema>;

const STEPS = [
  { id: 1, name: 'Upload Artwork', fields: ['image'] },
  { id: 2, name: 'NFT Details', fields: ['title', 'description', 'artStyle'] },
  { id: 3, name: 'Pricing & Royalties', fields: ['price', 'royaltyPercentage'] },
  { id: 4, name: 'Review & Mint' },
];

export default function CreateNftPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

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
    mode: 'onChange', // Show errors as user types
  });

  const onSubmit = (data: NftFormValues) => {
    console.log('NFT data:', data);
    // Here you would typically handle file upload and minting process
    toast({
      title: 'NFT Submitted!',
      description: `${data.title} has been submitted for listing.`,
      variant: 'default',
    });
    form.reset();
    setImagePreview(null);
    setCurrentStep(1);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      form.setValue('image', event.target.files as any, { shouldValidate: true });
    } else {
      setImagePreview(null);
      form.setValue('image', undefined, { shouldValidate: true });
    }
  };

  const handleNextStep = async () => {
    const currentStepConfig = STEPS.find(step => step.id === currentStep);
    if (currentStepConfig && currentStepConfig.fields) {
      const isValid = await form.trigger(currentStepConfig.fields as (keyof NftFormValues)[]);
      if (!isValid) {
        toast({
          title: 'Incomplete Step',
          description: 'Please fill in all required fields for this step.',
          variant: 'destructive',
        });
        return;
      }
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="mb-8 flex w-full items-start justify-between px-2 sm:px-4">
        {STEPS.map((step, index) => (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center text-center sm:min-w-[80px] md:min-w-[100px]">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300
                  ${currentStep > step.id ? 'bg-accent border-accent text-accent-foreground' : ''}
                  ${currentStep === step.id ? 'bg-primary border-primary text-primary-foreground scale-110 ring-2 ring-primary/70 ring-offset-1 ring-offset-background' : 'border-border bg-muted text-muted-foreground'}
                `}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base font-medium">{step.id}</span>}
              </div>
              <p className={`mt-1.5 text-xs sm:text-sm leading-tight transition-colors ${currentStep === step.id ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {step.name}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`mt-4 sm:mt-[18px] flex-1 h-[2px] mx-1 sm:mx-2 rounded-full transition-colors duration-300 ${currentStep > step.id ? 'bg-accent' : 'bg-border'}`}></div>
            )}
          </Fragment>
        ))}
      </div>
    );
  };


  const Step1Upload = () => (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">Upload Your Artwork</FormLabel>
          <FormControl>
            <div className="flex flex-col items-center justify-center w-full">
              <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                ${form.formState.errors.image ? 'border-destructive' : 'border-border'}
                ${imagePreview ? 'bg-muted/50' : 'bg-secondary hover:bg-muted'}`}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
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
  );

  const Step2Details = () => (
    <div className="space-y-6">
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
    </div>
  );

  const Step3Pricing = () => (
    <div className="space-y-6">
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
  );

  const Step4Review = () => {
    const values = form.getValues();
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-center mb-4">Review Your NFT Details</h3>
        {imagePreview && (
          <div className="mb-4 border rounded-lg overflow-hidden shadow-sm">
            <img src={imagePreview} alt="NFT Preview" className="w-full max-h-80 object-contain bg-muted p-2" />
          </div>
        )}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="font-medium text-muted-foreground">Title:</span> <span className="text-right">{values.title}</span></div>
          <div className="flex justify-between"><span className="font-medium text-muted-foreground">Art Style:</span> <span className="text-right">{values.artStyle}</span></div>
          <div className="flex justify-between"><span className="font-medium text-muted-foreground">Price:</span> <span className="text-right">{values.price} ETH</span></div>
          <div className="flex justify-between"><span className="font-medium text-muted-foreground">Royalty:</span> <span className="text-right">{values.royaltyPercentage}%</span></div>
          <div><span className="font-medium text-muted-foreground">Description:</span> <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{values.description}</p></div>
        </div>
        <Card className="bg-secondary/50 p-4">
            <p className="text-xs text-secondary-foreground">
                Estimated Minting Fee: <span className="font-semibold">~0.0X ETH</span> (This is a placeholder and actual fees may vary based on network conditions.)
            </p>
        </Card>
        <p className="text-xs text-muted-foreground text-center">
          By clicking "Mint and List NFT", you agree to ArtNFT's terms and conditions for minting.
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl sm:text-3xl">Create & List Your NFT</CardTitle>
          <CardDescription>
            {STEPS.find(step => step.id === currentStep)?.name || 'Complete the steps to mint your NFT'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 1 && <Step1Upload />}
              {currentStep === 2 && <Step2Details />}
              {currentStep === 3 && <Step3Pricing />}
              {currentStep === 4 && <Step4Review />}

              <div className="flex justify-between items-center pt-6 border-t">
                <Button type="button" variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {currentStep < STEPS.length ? (
                  <Button type="button" onClick={handleNextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Mint and List NFT
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    