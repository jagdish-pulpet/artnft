
'use client';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Eye, Loader2, Wand2, TagsIcon, Palette, PlusCircle, Trash2, Percent, Lock, Unlock, Info, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateNftDescription } from '@/ai/flows/generate-nft-description-flow';
import type { GenerateNftDescriptionInput, GenerateNftDescriptionOutput } from '@/ai/flows/generate-nft-description-flow';
import { suggestNftTitles } from '@/ai/flows/suggest-nft-titles-flow';
import type { SuggestNftTitlesInput, SuggestNftTitlesOutput } from '@/ai/flows/suggest-nft-titles-flow';
import { suggestNftTags } from '@/ai/flows/suggest-nft-tags-flow';
import type { SuggestNftTagsInput, SuggestNftTagsOutput } from '@/ai/flows/suggest-nft-tags-flow';

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

export default function CreateNFTPage() {
  const { toast } = useToast();

  // Core NFT Info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [tags, setTags] = useState('');

  // AI States
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isSuggestingTitles, setIsSuggestingTitles] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);

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
  const [royaltyPercentage, setRoyaltyPercentage] = useState<string>('10'); // Default to 10%

  // Unlockable Content
  const [unlockableContentEnabled, setUnlockableContentEnabled] = useState(false);
  const [unlockableContent, setUnlockableContent] = useState('');

  // Minting State
  const [isMinting, setIsMinting] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
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
      const input: GenerateNftDescriptionInput = { photoDataUri: imagePreviewUrl, title, keywords: tags };
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
    if (!imagePreviewUrl) {
      toast({ variant: 'destructive', title: 'Image Needed', description: 'Please upload an image to suggest titles.' });
      return;
    }
    setIsSuggestingTitles(true);
    setSuggestedTitles([]);
    try {
      const input: SuggestNftTitlesInput = { photoDataUri: imagePreviewUrl, concept: description }; // Pass description as concept
      const result: SuggestNftTitlesOutput = await suggestNftTitles(input);
      setSuggestedTitles(result.titles);
      if (result.titles.length === 0) {
        toast({ title: 'No Titles Suggested', description: 'The AI couldn\'t come up with titles this time. Try adding a concept.' });
      }
    } catch (error) {
      console.error("Error suggesting titles:", error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'Could not suggest titles.' });
    } finally {
      setIsSuggestingTitles(false);
    }
  };
  
  const applySuggestedTitle = (suggestedTitle: string) => {
    setTitle(suggestedTitle);
    setSuggestedTitles([]); 
  };


  const handleSuggestTags = async () => {
    if (!imagePreviewUrl || !title || !description) {
      toast({ variant: 'destructive', title: 'Image, Title & Description Needed', description: 'Ensure an image is uploaded and title/description are filled to suggest tags.' });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const input: SuggestNftTagsInput = { photoDataUri: imagePreviewUrl, title, description };
      const result: SuggestNftTagsOutput = await suggestNftTags(input);
      setTags(result.tags.join(', '));
      toast({ title: 'Tags Suggested!', description: 'AI has suggested tags for your NFT.' });
    } catch (error) {
      console.error("Error suggesting tags:", error);
      toast({ variant: 'destructive', title: 'AI Error', description: 'Could not suggest tags.' });
    } finally {
      setIsSuggestingTags(false);
    }
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
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title || !description || !price || !category) {
      toast({ variant: 'destructive', title: 'Missing Information', description: 'Please fill all required fields and upload an image.' });
      return;
    }
    
    setIsMinting(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Simulated Minting Data:', {
        title, description, price, category, imageName: imageFile.name, tags,
        collection: selectedCollection, traits, royaltyPercentage,
        unlockableContentEnabled, unlockableContent: unlockableContentEnabled ? unlockableContent : ''
    });

    toast({
      title: 'NFT Minted (Simulated)!',
      description: `${title} has been successfully minted.`,
    });
    // Reset form (optional)
    // setTitle(''); setDescription(''); setPrice(''); setCategory(''); setImageFile(null); setImagePreviewUrl(null); setTags(''); setSelectedCollection(''); setTraits([]); setRoyaltyPercentage('10'); setUnlockableContentEnabled(false); setUnlockableContent('');
    setIsMinting(false);
  };

  const estimatedGasFee = "0.015 ETH"; // Simulated

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-xl sticky top-24 "> {/* Form Card */}
            <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline text-center md:text-left">Create Your NFT</CardTitle>
              <CardDescription className="text-center md:text-left">
                Bring your digital art to life on the blockchain. Fill in the details below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image-upload-input" className="block text-sm font-medium text-foreground mb-1">Upload Image*</Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-md hover:border-primary transition-colors">
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
                  </div>
                  {imagePreviewUrl && <p className="text-xs text-green-600 mt-1">Image selected: {imageFile?.name}</p>}
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Title*</Label>
                  <div className="flex items-center gap-2">
                    <Input id="title" type="text" placeholder="e.g., Sunset Over Metropolis" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={isMinting || isSuggestingTitles} className="flex-grow"/>
                     <Popover open={isSuggestingTitles && suggestedTitles.length > 0} onOpenChange={(open) => !open && setSuggestedTitles([])}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" size="icon" onClick={handleSuggestTitles} disabled={isMinting || !imagePreviewUrl || isSuggestingTitles} aria-label="Suggest titles">
                                {isSuggestingTitles ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                            <p className="text-sm font-medium mb-1">Suggested Titles:</p>
                            {suggestedTitles.length > 0 ? (
                                <ul className="space-y-1">
                                {suggestedTitles.map((st, idx) => (
                                    <li key={idx}>
                                    <Button variant="ghost" size="sm" className="w-full justify-start text-left h-auto py-1 px-2" onClick={() => applySuggestedTitle(st)}>
                                        {st}
                                    </Button>
                                    </li>
                                ))}
                                </ul>
                            ) : <p className="text-xs text-muted-foreground">No suggestions available.</p>}
                        </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description*</Label>
                   <Textarea id="description" placeholder="Tell us about your artwork..." required value={description} onChange={(e) => setDescription(e.target.value)} disabled={isMinting || isGeneratingDesc} className="min-h-[100px]" />
                  <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={isMinting || !imagePreviewUrl || !title || isGeneratingDesc} className="mt-2">
                    {isGeneratingDesc ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                    Generate with AI
                  </Button>
                </div>
                
                <Separator />

                {/* Core Details: Price, Category, Tags */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="price">Price (ETH)*</Label>
                        <Input id="price" type="number" step="0.01" placeholder="e.g., 1.5" required value={price} onChange={(e) => setPrice(e.target.value)} disabled={isMinting} />
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
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Textarea id="tags" placeholder="e.g., abstract, futuristic, vibrant" value={tags} onChange={(e) => setTags(e.target.value)} disabled={isMinting || isSuggestingTags} />
                   <Button type="button" variant="outline" size="sm" onClick={handleSuggestTags} disabled={isMinting || !imagePreviewUrl || !title || !description || isSuggestingTags} className="mt-2">
                    {isSuggestingTags ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <TagsIcon className="h-4 w-4 mr-2" />}
                    Suggest Tags
                  </Button>
                </div>

                <Separator />

                {/* Collection */}
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
                
                {/* Traits/Properties as Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="traits">
                    <AccordionTrigger>
                        <div className="flex justify-between items-center w-full">
                            <Label className="text-base">Properties / Traits</Label>
                            {/* The Add Trait button can be inside or outside the trigger, moved to content for better UX */}
                        </div>
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
                </Accordion>

                <Separator />
                
                {/* Royalties & Unlockable Content */}
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <Label htmlFor="royalty">Royalty Percentage</Label>
                        <div className="relative">
                            <Input id="royalty" type="number" min="0" max="50" step="0.1" placeholder="e.g., 10" value={royaltyPercentage} onChange={(e) => setRoyaltyPercentage(e.target.value)} disabled={isMinting} className="pr-8"/>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                        </div>
                         <p className="text-xs text-muted-foreground mt-1 flex items-center"><Info size={14} className="mr-1"/>Simulated. Set a percentage for secondary sales.</p>
                    </div>
                     <div>
                        <div className="flex items-center justify-between mb-1">
                            <Label htmlFor="unlockable-switch">Unlockable Content</Label>
                            <Switch id="unlockable-switch" checked={unlockableContentEnabled} onCheckedChange={setUnlockableContentEnabled} disabled={isMinting}/>
                        </div>
                        {unlockableContentEnabled && (
                            <Textarea id="unlockableContent" placeholder="Enter hidden content for the owner..." value={unlockableContent} onChange={(e) => setUnlockableContent(e.target.value)} disabled={isMinting} />
                        )}
                        <p className="text-xs text-muted-foreground mt-1 flex items-center"><Info size={14} className="mr-1"/>Simulated. Add content only visible to the owner.</p>
                    </div>
                </div>
                
                <Separator />

                {/* Minting Summary & Action */}
                <div className="p-3 bg-muted/50 rounded-md space-y-1 text-sm">
                    <p className="font-medium">Minting Summary (Simulated)</p>
                    <p>Title: <span className="text-foreground">{title || "N/A"}</span></p>
                    <p>Price: <span className="text-foreground">{price ? `${price} ETH` : "N/A"}</span></p>
                    <p>Estimated Gas Fee: <span className="text-foreground">{estimatedGasFee}</span></p>
                </div>

                <p className="text-xs text-muted-foreground">*Required fields</p>
                <Button type="submit" size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isMinting}>
                  {isMinting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
                  {isMinting ? 'Minting NFT...' : 'Mint NFT'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card className="shadow-xl sticky top-24 hidden lg:block">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-headline flex items-center">
                <Eye className="mr-2 h-6 w-6 text-primary" /> Live Preview
              </CardTitle>
              <CardDescription>See how your NFT will appear.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                {previewBackgrounds.map(bg => (
                  <Button key={bg.name} variant={previewBg === bg.value ? 'default' : 'outline'} size="sm" onClick={() => setPreviewBg(bg.value)}>
                    {bg.name}
                  </Button>
                ))}
              </div>
              <div className={`aspect-square w-full rounded-md flex items-center justify-center overflow-hidden border ${previewBg} transition-colors`}>
                {imagePreviewUrl ? (
                  <Image 
                    src={imagePreviewUrl} 
                    alt="NFT Preview" 
                    width={400} 
                    height={400} 
                    style={{ objectFit: 'contain' }}
                    className="max-w-full max-h-full"
                    data-ai-hint="nft preview"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-2"/>
                    <p className="text-muted-foreground text-sm">Upload an image to see preview</p>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-xl font-semibold truncate">{title || 'Untitled NFT'}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  Category: {category ? (category.charAt(0).toUpperCase() + category.slice(1)).replace('-', ' ') : 'Not selected'}
                </p>
                <p className="text-lg font-bold text-primary mt-1">{price ? `${price} ETH` : 'Price not set'}</p>
                {description && (
                  <div className="mt-2 p-3 bg-muted/50 rounded-md max-h-24 overflow-y-auto">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {description}
                    </p>
                  </div>
                )}
                {!description && <p className="text-sm text-muted-foreground mt-2">No description yet.</p>}
                
                {tags && (
                    <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground">Tags:</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                        {tags.split(',').map(t => t.trim()).filter(t => t).map((tag, i) => (
                            <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                        </div>
                    </div>
                )}

                {traits.length > 0 && (
                    <div className="mt-2">
                        <p className="text-xs font-medium text-muted-foreground">Properties:</p>
                         <div className="grid grid-cols-2 gap-1 mt-0.5">
                            {traits.filter(t => t.type && t.name).map(trait => (
                            <div key={trait.id} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                                <span className="font-medium block truncate">{trait.type}</span>
                                <span className="block truncate">{trait.name}</span>
                            </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedCollection && collections.find(c => c.id === selectedCollection) && (
                     <p className="text-xs text-muted-foreground">Collection: <span className="font-medium text-foreground">{collections.find(c => c.id === selectedCollection)?.name}</span></p>
                )}
                <p className="text-xs text-muted-foreground">Royalty: <span className="font-medium text-foreground">{royaltyPercentage || 0}%</span></p>
                {unlockableContentEnabled && <p className="text-xs text-green-600 flex items-center"><Unlock size={14} className="mr-1"/> Unlockable content included</p>}

              </div>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">This is a preview. Minting is simulated.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

