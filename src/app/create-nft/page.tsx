
'use client';
import React, { useState, type ChangeEvent, type FormEvent, useEffect, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadCloud, Eye, Loader2, Wand2, TagsIcon, Palette, PlusCircle, Trash2, Percent, Lock, Unlock, Info, X, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Corrected import for generateNftDescription
import { generateNftDescription } from '@/ai/flows/generate-nft-description';
import type { GenerateNftDescriptionInput, GenerateNftDescriptionOutput } from '@/ai/flows/generate-nft-description';

// Commented out imports for missing AI flows
// import { suggestNftTitles } from '@/ai/flows/suggest-nft-titles-flow';
// import type { SuggestNftTitlesInput, SuggestNftTitlesOutput } from '@/ai/flows/suggest-nft-titles-flow';
// import { suggestNftTags } from '@/ai/flows/suggest-nft-tags-flow';
// import type { SuggestNftTagsInput, SuggestNftTagsOutput } from '@/ai/flows/suggest-nft-tags-flow';

import { cn } from '@/lib/utils';
import Link from 'next/link';


interface Trait {
  id: string;
  type: string;
  name: string;
}

const initialCollections = [
  { id: 'col1', name: 'My Artworks' },
  { id: 'col2', name: 'Generative Series Vol. 1' },
  { id: 'col3', name: 'Pixel Dreams Collection' },
];

const previewBackgrounds = [
  { name: 'Light', value: 'bg-white' },
  { name: 'Dark', value: 'bg-gray-800' },
  { name: 'Muted', value: 'bg-muted' },
];

const STEPS = [
    { id: 1, name: 'Upload Artwork' },
    { id: 2, name: 'NFT Details' },
    { id: 3, name: 'Pricing & Extras' },
    { id: 4, name: 'Review & Mint' },
];


export default function CreateNFTPage() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Core NFT Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState('');

  // AI States
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  // const [isSuggestingTitles, setIsSuggestingTitles] = useState(false);
  // const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  // const [isSuggestingTags, setIsSuggestingTags] = useState(false);

  // Enhanced Preview
  const [previewBg, setPreviewBg] = useState(previewBackgrounds[0].value);

  // Collection Management
  const [collections, setCollections] = useState(initialCollections);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isCreateCollectionDialogOpen, setIsCreateCollectionDialogOpen] = useState(false);

  // Traits/Properties
  const [traits, setTraits] = useState<Trait[]>([]);

  // Royalty
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>('10');

  // Unlockable Content
  const [unlockableContentEnabled, setUnlockableContentEnabled] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState('');

  // Minting State
  const [isMinting, setIsMinting] = useState(false);

  const allDataForReview = useMemo(() => ({
    title,
    artStyle,
    description,
    price,
    royaltyPercentage,
    imagePreviewUrl,
    imageName: imageFile?.name,
    tags,
    category,
    collection: collections.find(c => c.id === selectedCollection)?.name,
    traits: traits.filter(t => t.name && t.type),
    unlockableContentEnabled,
    unlockableContentText: unlockableContentEnabled ? unlockableContent : undefined,
  }), [title, artStyle, description, price, royaltyPercentage, imagePreviewUrl, imageFile, tags, category, selectedCollection, collections, traits, unlockableContentEnabled, unlockableContent]);


  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Please upload an image under 10MB.' });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif'].includes(file.type)) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload a PNG, JPG, or GIF.'});
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleGenerateDescription = async () => {
    if (!imagePreviewUrl || !title) {
      toast({ variant: 'destructive', title: 'Image & Title Needed', description: 'Please upload an image and enter a title to generate a description.' });
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const input: GenerateNftDescriptionInput = {
        nftTitle: title,
        artistName: "The Creator", // Placeholder, can be dynamic
        artStyle: artStyle || "Unknown",
        creationDate: new Date().toISOString().split('T')[0],
        materialsUsed: "Digital",
        additionalDetails: tags,
      };
      const result: GenerateNftDescriptionOutput = await generateNftDescription(input);
      setDescription(result.description);
      toast({ title: 'Description Generated!', description: 'The AI has crafted a description for your NFT.' });
    } catch (error) {
      console.error("Error generating description:", error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'Could not generate description.' });
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleSuggestTitles = async () => {
    toast({ title: 'Title Suggestion (Coming Soon)', description: 'This feature will be available once the AI flow is ready.'});
  };

  const applySuggestedTitle = (suggestedTitle: string) => {
    // setTitle(suggestedTitle);
    // setSuggestedTitles([]);
  };


  const handleSuggestTags = async () => {
    toast({ title: 'Tag Suggestion (Coming Soon)', description: 'This feature will be available once the AI flow is ready.'});
  };

  const handleAddTrait = () => {
    setTraits([...traits, { id: Date.now().toString(), type: '', name: '' }]);
  };

  const handleRemoveTrait = (id: string) => {
    setTraits(traits.filter(trait => trait.id !== id));
  };

  const handleTraitChange = (id: string, field: 'type' | 'name', value: string) => {
    setTraits(traits.map(trait => trait.id === id ? { ...trait, [field]: value } : trait));
  };

  const handleCreateNewCollection = () => {
    if (!newCollectionName.trim()) {
      toast({ variant: 'destructive', title: 'Collection Name Required', description: 'Please enter a name for your new collection.' });
      return;
    }
    const newCollection = { id: `col-${Date.now()}`, name: newCollectionName.trim() };
    setCollections([...collections, newCollection]);
    setSelectedCollection(newCollection.id);
    toast({ title: 'Collection Created!', description: `Successfully created and selected "${newCollection.name}".`});
    setNewCollectionName('');
    setIsCreateCollectionDialogOpen(false);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!imageFile) {
          toast({ variant: "destructive", title: "Image Required", description: "Please upload an image for your NFT." });
          return false;
        }
        return true;
      case 2:
        if (!title.trim()) {
          toast({ variant: "destructive", title: "Title Required", description: "Please enter a title for your NFT." });
          return false;
        }
        if (!description.trim()) {
          toast({ variant: "destructive", title: "Description Required", description: "Please provide a description for your NFT." });
          return false;
        }
         if (!artStyle.trim()) {
          toast({ variant: "destructive", title: "Art Style Required", description: "Please specify the art style." });
          return false;
        }
        return true;
      case 3:
        if (!price.trim() || parseFloat(price) <= 0) {
          toast({ variant: "destructive", title: "Valid Price Required", description: "Please enter a valid price (ETH > 0)." });
          return false;
        }
        const royalty = parseFloat(royaltyPercentage);
        if (isNaN(royalty) || royalty < 0 || royalty > 50) {
            toast({ variant: "destructive", title: "Invalid Royalty", description: "Royalty must be between 0% and 50%." });
            return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
        toast({ variant: "destructive", title: "Incomplete Information", description: "Please ensure all previous steps are correctly filled." });
        return;
    }

    setIsMinting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Simulated Minting Data:', allDataForReview);

    toast({
      title: 'NFT Minted (Simulated)!',
      description: `${title} has been successfully minted.`,
    });
    setIsMinting(false);
     // Optionally reset form or redirect:
    // router.push('/profile'); // Example redirect
    // resetFormFields(); // You'd need to implement this
  };

  const estimatedGasFee = "0.015 ETH";

  const renderStepIndicator = () => {
    return (
        <div className="mb-8 px-2 sm:px-0">
            <div className="flex items-center justify-between">
                {STEPS.map((step, index) => {
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center text-center">
                                <div
                                    className={cn(
                                        "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isActive ? "bg-primary border-primary text-primary-foreground scale-110 ring-2 ring-primary/30 ring-offset-background" :
                                        isCompleted ? "bg-primary/80 border-primary/80 text-primary-foreground" :
                                        "bg-card border-border text-muted-foreground"
                                    )}
                                >
                                    {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <span className="text-sm sm:text-base">{step.id}</span>}
                                </div>
                                <p className={cn(
                                    "text-xs sm:text-sm mt-1.5 sm:mt-2 max-w-[60px] sm:max-w-[80px] truncate leading-tight",
                                    isActive ? "font-semibold text-primary" :
                                    isCompleted ? "text-foreground" :
                                    "text-muted-foreground"
                                )}>
                                    {step.name}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-1 mx-1 sm:mx-2 transition-colors duration-300",
                                    currentStep > step.id ? "bg-primary/80" : "bg-border"
                                )} style={{ transform: 'translateY(calc(-50% - 10px))' }}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


  return (
    <AppLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto">
          <Card className="shadow-xl border-border">
            <CardHeader className="border-b p-6">
              <CardTitle className="text-3xl font-bold font-headline text-center md:text-left">Create Your NFT</CardTitle>
              <CardDescription className="text-center md:text-left">
                Follow the steps below to bring your digital art to life on the blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {renderStepIndicator()}

              <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 1 && (
                  <section className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-foreground">Step 1: Upload Artwork</h2>
                    <div>
                      <Label htmlFor="image-upload-input" className="block text-sm font-medium text-foreground mb-1">Upload Image*</Label>
                      <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary transition-colors min-h-[200px]">
                        {imagePreviewUrl ? (
                            <div className="relative w-full max-w-xs aspect-square mx-auto">
                                <Image src={imagePreviewUrl} alt="NFT Preview" layout="fill" objectFit="contain" className="rounded-md" data-ai-hint="nft preview" />
                                <Button variant="destructive" size="icon" onClick={() => { setImageFile(null); setImagePreviewUrl(null); }} className="absolute -top-2 -right-2 h-7 w-7 rounded-full shadow-md" aria-label="Remove image">
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                <div className="flex text-sm text-muted-foreground">
                                    <Label
                                    htmlFor="image-upload-input"
                                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring"
                                    >
                                    <span>Upload a file</span>
                                    <Input id="image-upload-input" name="image-upload-input" type="file" className="sr-only" onChange={handleImageUpload} accept="image/png, image/jpeg, image/gif" disabled={isMinting}/>
                                    </Label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}
                      </div>
                      {imageFile && <p className="text-xs text-green-600 mt-1">Image selected: {imageFile?.name}</p>}
                    </div>
                  </section>
                )}

                {currentStep === 2 && (
                  <section className="space-y-6 animate-fadeIn">
                    <h2 className="text-xl font-semibold text-foreground">Step 2: NFT Details</h2>
                    <div>
                        <Label htmlFor="title">Title*</Label>
                        <div className="flex items-center gap-2">
                            <Input id="title" type="text" placeholder="e.g., Sunset Over Metropolis" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isMinting} className="flex-grow"/>
                             <Button type="button" variant="outline" size="icon" onClick={handleSuggestTitles} disabled={isMinting || !imagePreviewUrl} aria-label="Suggest titles">
                                <Wand2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="description">Description*</Label>
                        <Textarea id="description" placeholder="Tell us about your artwork..." required value={description} onChange={(e) => setDescription(e.target.value)} disabled={isMinting || isGeneratingDesc} className="min-h-[100px]" />
                        <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isMinting || !imagePreviewUrl || !title || isGeneratingDesc} className="mt-2">
                            {isGeneratingDesc ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                            Generate with AI
                        </Button>
                    </div>
                     <div>
                        <Label htmlFor="art-style">Art Style*</Label>
                        <Input id="art-style" type="text" placeholder="e.g., Abstract, Pixel Art, Surrealism" required value={artStyle} onChange={(e) => setArtStyle(e.target.value)} disabled={isMinting} />
                    </div>
                     <div>
                        <Label htmlFor="category">Category*</Label>
                        <Select required onValueChange={setCategory} value={category} disabled={isMinting}>
                            <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                            <SelectContent>
                            <SelectItem value="digital-art">Digital Art</SelectItem>
                            <SelectItem value="photography">Photography</SelectItem>
                            <SelectItem value="music">Music</SelectItem>
                            <SelectItem value="collectible">Collectible</SelectItem>
                            <SelectItem value="virtual-world">Virtual World</SelectItem>
                            <SelectItem value="utility">Utility</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Textarea id="tags" placeholder="e.g., abstract, futuristic, vibrant" value={tags} onChange={(e) => setTags(e.target.value)} disabled={isMinting} />
                        <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isMinting || !imagePreviewUrl || !title || !description} className="mt-2">
                             <TagsIcon className="h-4 w-4 mr-2" /> Suggest Tags
                        </Button>
                    </div>
                  </section>
                )}

                {currentStep === 3 && (
                    <section className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-foreground">Step 3: Pricing & Extras</h2>
                        <div>
                            <Label htmlFor="price">Price (ETH)*</Label>
                            <Input id="price" type="number" step="0.01" placeholder="e.g., 1.5" required value={price} onChange={(e) => setPrice(e.target.value)} disabled={isMinting} />
                        </div>
                        <div>
                            <Label htmlFor="royalty">Royalty Percentage</Label>
                            <div className="relative">
                                <Input id="royalty" type="number" min="0" max="50" step="0.1" placeholder="e.g., 10" value={royaltyPercentage} onChange={(e) => setRoyaltyPercentage(e.target.value)} disabled={isMinting} className="pr-8"/>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center"><Info size={14} className="mr-1"/>Simulated. Set a percentage for secondary sales (0-50%).</p>
                        </div>
                        <Separator />
                        <div>
                            <Label htmlFor="collection">Collection</Label>
                            <div className="flex items-center gap-2">
                                <Select onValueChange={setSelectedCollection} value={selectedCollection} disabled={isMinting}>
                                <SelectTrigger id="collection"><SelectValue placeholder="Select a collection (optional)" /></SelectTrigger>
                                <SelectContent>
                                    {collections.map(col => <SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>)}
                                </SelectContent>
                                </Select>
                                <Dialog open={isCreateCollectionDialogOpen} onOpenChange={setIsCreateCollectionDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="outline" size="icon" aria-label="Create new collection" disabled={isMinting}><PlusCircle className="h-4 w-4"/></Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader><DialogTitle>Create New Collection</DialogTitle></DialogHeader>
                                    <Input placeholder="Enter collection name" value={newCollectionName} onChange={(e) => setNewCollectionName(e.target.value)} />
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                                        <Button type="button" onClick={handleCreateNewCollection}>Create & Select</Button>
                                    </DialogFooter>
                                </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="traits">
                            <AccordionTrigger>
                                <Label className="text-base hover:no-underline">Properties / Traits</Label>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <Button type="button" variant="outline" size="sm" onClick={handleAddTrait} disabled={isMinting} className="mb-3">
                                    <PlusCircle className="h-4 w-4 mr-2"/>Add Trait
                                </Button>
                                {traits.length === 0 && <p className="text-xs text-muted-foreground mb-3">Add custom properties like "Background: Red" or "Eyes: Laser".</p>}
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                    {traits.map((trait) => (
                                    <div key={trait.id} className="flex items-center gap-2 p-2 border rounded-md">
                                        <Input placeholder="Trait Type (e.g., Color)" value={trait.type} onChange={(e) => handleTraitChange(trait.id, 'type', e.target.value)} disabled={isMinting} className="flex-1"/>
                                        <Input placeholder="Name (e.g., Blue)" value={trait.name} onChange={(e) => handleTraitChange(trait.id, 'name', e.target.value)} disabled={isMinting} className="flex-1"/>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTrait(trait.id)} disabled={isMinting} aria-label="Remove trait"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                    </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="unlockable">
                             <AccordionTrigger>
                                <Label className="text-base hover:no-underline">Unlockable Content</Label>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Switch id="unlockable-switch" checked={unlockableContentEnabled} onCheckedChange={setUnlockableContentEnabled} disabled={isMinting}/>
                                    <Label htmlFor="unlockable-switch" className="cursor-pointer">Enable Unlockable Content</Label>
                                </div>
                                {unlockableContentEnabled && (
                                    <Textarea id="unlockableContent" placeholder="Enter hidden content for the owner..." value={unlockableContent} onChange={(e) => setUnlockableContent(e.target.value)} disabled={isMinting} />
                                )}
                                <p className="text-xs text-muted-foreground flex items-center"><Info size={14} className="mr-1"/>Simulated. Add content only visible to the owner.</p>
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </section>
                )}

                {currentStep === 4 && (
                    <section className="space-y-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold text-foreground">Step 4: Review & Mint</h2>

                        {imagePreviewUrl && (
                            <div className="mb-4">
                                <Label className="block text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Artwork Preview</Label>
                                <Image src={imagePreviewUrl} alt="NFT Preview" width={150} height={150} className="rounded-lg border shadow-md mx-auto sm:mx-0" data-ai-hint="nft preview"/>
                            </div>
                        )}
                        <Separator />

                        <div className="space-y-3">
                            {Object.entries(allDataForReview).map(([key, value]) => {
                                if (key === 'imagePreviewUrl' || key === 'imageName' || key === 'unlockableContentEnabled') return null;
                                if (key === 'unlockableContentText' && !allDataForReview.unlockableContentEnabled) return null;
                                if (key === 'traits' && (!value || (Array.isArray(value) && value.length === 0))) return null;
                                if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return null;

                                let displayValue = String(value);
                                if (key === 'price') displayValue = `${value} ETH`;
                                if (key === 'royaltyPercentage') displayValue = `${value}%`;
                                if (key === 'traits' && Array.isArray(value)) {
                                    displayValue = value.map(t => `${t.type}: ${t.name}`).join('; ');
                                }
                                if (key === 'category' && value) {
                                    displayValue = (value as string).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                                }

                                return (
                                    <React.Fragment key={key}>
                                        <div className="py-2">
                                            <Label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </Label>
                                            <p className="text-sm text-foreground mt-0.5 break-words">{displayValue}</p>
                                        </div>
                                        {key !== Object.keys(allDataForReview).filter(k => {
                                            const v = allDataForReview[k as keyof typeof allDataForReview];
                                            if (k === 'imagePreviewUrl' || k === 'imageName' || k === 'unlockableContentEnabled') return false;
                                            if (k === 'unlockableContentText' && !allDataForReview.unlockableContentEnabled) return false;
                                            if (k === 'traits' && (!v || (Array.isArray(v) && v.length === 0))) return false;
                                            return !(v === undefined || v === null || (typeof v === 'string' && v.trim() === ''));
                                        }).pop() && <Separator className="my-1"/>}
                                    </React.Fragment>
                                );
                            })}
                        </div>

                        <div className="p-3 bg-muted/50 rounded-md space-y-1 text-sm border mt-4">
                            <p className="font-medium text-foreground">Estimated Minting Fee (Simulated)</p>
                            <p className="text-accent font-semibold">{estimatedGasFee}</p>
                        </div>

                        <div className="flex items-start space-x-2 mt-4">
                            <Checkbox id="terms" required />
                            <Label htmlFor="terms" className="text-xs text-muted-foreground">
                                I agree to the <Link href="/terms" className="underline text-primary hover:text-primary/80">Terms and Conditions</Link> and acknowledge that minting fees are non-refundable.
                            </Label>
                        </div>

                         <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground mt-6" disabled={isMinting}>
                            {isMinting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                            {isMinting ? 'Minting NFT...' : 'Create and List NFT'}
                        </Button>
                    </section>
                )}

                <div className="flex justify-between items-center pt-6 mt-6 border-t">
                    <Button type="button" variant="outline" onClick={handlePrevStep} disabled={currentStep === 1 || isMinting}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    {currentStep < STEPS.length && (
                        <Button type="button" onClick={handleNextStep} disabled={isMinting}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
                 <p className="text-xs text-muted-foreground text-center mt-2">*Required fields in current step</p>
              </form>
            </CardContent>
          </Card>
      </div>
       <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </AppLayout>
  );
}
