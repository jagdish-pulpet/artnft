
'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Palette, MoreHorizontal, Search, Filter, PlusCircle, Edit, Eye, Star, EyeOff, CheckSquare, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

type NftStatus = 'Listed' | 'Hidden' | 'Featured' | 'Pending';
type NftCategory = 'Digital Art' | 'Collectible' | 'Music' | 'Photography' | 'Virtual World' | 'Utility' | 'Other';


interface MockNft {
  id: string;
  thumbnailUrl: string;
  title: string;
  artistName: string;
  category: NftCategory;
  priceEth: number;
  status: NftStatus;
  dateListed: string; // YYYY-MM-DD
  description?: string;
  owner?: string; // Simulated
}

const ITEMS_PER_PAGE = 20;

// --- Mock Data Generation ---
const nftTitlesPrefix = ["Cosmic", "Pixel", "Synthwave", "AI Generated", "Virtual", "Abstract", "Neon", "Galactic", "Mystic", "Quantum", "Ancient", "Future", "Dream", "Lost", "Found", "Sacred", "Silent", "Forgotten", "Eternal", "Chromatic", "Glitch", "Ethereal", "Surreal", "Geometric", "Minimal"];
const nftTitlesSuffix = ["Dreamscape", "Knight", "Sunset", "Landscape", "Parcel", "Flow", "Relic", "Genesis", "Echoes", "Voyage", "Odyssey", "Bloom", "Whisper", "Artifact", "Portrait", "Beats", "Token", "Figure", "Portal", "Monolith", "Fragment", "Key", "Orb", "Construct", "Vision"];
const artistNames = ["Galactic Voyager", "8BitKing", "RetroVibes", "ArtBot", "MetaBuilder", "VisionaryArtist", "DigitalSculptor", "StarPainter", "CosmicArtist", "TokenMaestro", "PixelPioneer", "AI Alchemist", "SynthwaveSurfer", "CryptoCreator", "DAO Master", "ArtByCode", "GlitchWizard", "NeonNinja", "SurrealSage", "GeometricGenius"];
const nftCategories: NftCategory[] = ['Digital Art', 'Collectible', 'Music', 'Photography', 'Virtual World', 'Utility', 'Other'];
const nftStatuses: NftStatus[] = ['Listed', 'Hidden', 'Featured', 'Pending'];
const nftOwners = ["CollectorX", "PixelFan", "MusicLover", "ArtInvestor", "MetaverseExplorer", "User123", "TopBidder", null, "WhaleWallet", "DAOVault", "ArtistReserve"];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(startYear = 2022, endYear = 2024): string {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Keep it simple for days
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function generateMockNfts(count: number): MockNft[] {
  const nfts: MockNft[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    let title = "";
    let attempts = 0;
    do {
      title = `${getRandomElement(nftTitlesPrefix)} ${getRandomElement(nftTitlesSuffix)} ${Math.random() > 0.7 ? `#${Math.floor(Math.random()*1000)}` : ''}`.trim();
      attempts++;
    } while (usedTitles.has(title) && attempts < 20); // Limit attempts to avoid infinite loop if combinations run out
    usedTitles.add(title);

    const price = parseFloat((Math.random() * 10 + 0.01).toFixed(2));
    const owner = getRandomElement(nftOwners);
    const dataAiHints = ["abstract art", "pixel character", "retro music", "landscape photo", "metaverse asset", "utility token", "fantasy creature", "sci-fi concept", "geometric pattern", "nature illustration"];


    const nft: MockNft = {
      id: `nft_gen_${String(i + 1).padStart(3, '0')}_${Math.random().toString(36).substring(2, 7)}`,
      thumbnailUrl: `https://placehold.co/40x40.png`, // Generic placeholder
      title: title,
      artistName: getRandomElement(artistNames),
      category: getRandomElement(nftCategories),
      priceEth: price,
      status: getRandomElement(nftStatuses),
      dateListed: getRandomDate(),
      description: Math.random() > 0.3 ? `This is a unique piece: ${title}. A fine example of ${getRandomElement(nftCategories).toLowerCase()} by ${getRandomElement(artistNames)}.` : undefined,
      owner: owner || undefined,
      // @ts-ignore - MockNft does not have dataAiHint but NFTCardProps expects it.
      // This is acceptable for mock data where the card will use a default if not provided.
      // If strict typing is needed, add dataAiHint to MockNft interface
      dataAiHint: getRandomElement(dataAiHints),
    };
    nfts.push(nft);
  }
  return nfts;
}
// --- End Mock Data Generation ---


const nftStatusVariantMap: Record<NftStatus, "default" | "secondary" | "destructive" | "outline"> = {
  'Listed': 'default',
  'Hidden': 'secondary',
  'Featured': 'outline', 
  'Pending': 'destructive',
};

const nftStatusIconMap: Record<NftStatus, React.ElementType> = {
    'Listed': CheckSquare,
    'Hidden': EyeOff,
    'Featured': Star,
    'Pending': Palette, 
};


export default function AdminNFTsPage() {
  const { toast } = useToast();
  const [allMockNfts, setAllMockNfts] = useState<MockNft[]>([]);
  
  const [selectedNftForView, setSelectedNftForView] = useState<MockNft | null>(null);
  const [isViewNftDialogOpen, setIsViewNftDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    setAllMockNfts(generateMockNfts(100)); // Generate 100 NFTs
  }, []);

  // Reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchTerm, statusFilter, categoryFilter]);


  const handleToggleStatus = (nftId: string, newStatus: NftStatus, currentStatus: NftStatus) => {
    if (newStatus === currentStatus) return; 
    setAllMockNfts(prevNfts =>
      prevNfts.map(nft => {
        if (nft.id === nftId) {
          toast({
            title: `NFT Status Updated (Simulated)`,
            description: `NFT '${nft.title}' status changed to ${newStatus}.`,
          });
          return { ...nft, status: newStatus };
        }
        return nft;
      })
    );
  };

  const openViewDialog = (nft: MockNft) => {
    setSelectedNftForView(nft);
    setIsViewNftDialogOpen(true);
  };
  
  const processedAllNfts = useMemo(() => {
    return allMockNfts.filter(nft => {
        const matchesSearch = nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              nft.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              nft.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || nft.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || nft.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
      });
  }, [allMockNfts, searchTerm, statusFilter, categoryFilter]);

  const nftsToDisplay = useMemo(() => {
    return processedAllNfts.slice(0, displayCount);
  }, [processedAllNfts, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + ITEMS_PER_PAGE, processedAllNfts.length));
  };
  
  const uniqueCategories = useMemo(() => {
    const categoriesSet = new Set(allMockNfts.map(nft => nft.category));
    return ['all', ...Array.from(categoriesSet).sort()];
  }, [allMockNfts]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <Palette className="mr-3 h-7 w-7" /> NFT Management
            </h1>
            <p className="text-muted-foreground">Oversee NFTs on the platform, manage listings, and moderate content.</p>
        </div>
         <Button size="sm" asChild> 
            <Link href="/admin/nfts/add">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New NFT (Manual)
            </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg">All NFTs</CardTitle>
          <CardDescription>
            Search, filter, and manage NFTs. Showing {nftsToDisplay.length} of {processedAllNfts.length} matching NFTs (Total: {allMockNfts.length}).
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center border-b">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, artist, ID..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {nftStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] hidden sm:table-cell"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Artist</TableHead>
                  <TableHead className="hidden lg:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Price (ETH)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden xl:table-cell">Date Listed</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nftsToDisplay.length > 0 ? nftsToDisplay.map((nft) => {
                  const StatusIcon = nftStatusIconMap[nft.status];
                  return(
                  <TableRow key={nft.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image src={nft.thumbnailUrl} alt={nft.title} width={32} height={32} className="rounded-sm object-cover" data-ai-hint="nft thumbnail" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[150px] sm:max-w-[200px]" title={nft.title}>{nft.title}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{nft.artistName}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{nft.artistName}</TableCell>
                    <TableCell className="hidden lg:table-cell">{nft.category}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right">{nft.priceEth.toFixed(2)}</TableCell>
                    <TableCell>
                       <Badge 
                        variant={nftStatusVariantMap[nft.status]} 
                        className={`text-xs ${nft.status === 'Featured' ? 'border-primary text-primary' : ''}`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1.5" />
                        {nft.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">{nft.dateListed}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(nft)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/nfts/${nft.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit NFT
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(nft.id, nft.status === 'Featured' ? 'Listed' : 'Featured', nft.status)} className={nft.status === 'Featured' ? '' : 'text-amber-600 focus:text-amber-700'}>
                            <Star className="mr-2 h-4 w-4" /> {nft.status === 'Featured' ? 'Unfeature' : 'Feature'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(nft.id, nft.status === 'Hidden' ? 'Listed' : 'Hidden', nft.status)} className={nft.status === 'Hidden' ? 'text-green-600 focus:text-green-700' : 'text-destructive focus:text-destructive'}>
                           {nft.status === 'Hidden' ?  <CheckSquare className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                           {nft.status === 'Hidden' ? 'Unhide' : 'Hide'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}) : (
                   <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      No NFTs found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <CardFooter className="p-4 border-t flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>Showing {nftsToDisplay.length} of {processedAllNfts.length} NFT(s).</p>
            {nftsToDisplay.length < processedAllNfts.length && (
                <Button variant="outline" size="sm" onClick={handleLoadMore}>
                    Load More ({processedAllNfts.length - nftsToDisplay.length} remaining)
                </Button>
            )}
          </CardFooter>
        </CardContent>
      </Card>

      {/* View NFT Dialog */}
      <Dialog open={isViewNftDialogOpen} onOpenChange={setIsViewNftDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
             <DialogTitle className="flex items-center">
                <Image src={selectedNftForView?.thumbnailUrl || 'https://placehold.co/24x24.png'} alt={selectedNftForView?.title || 'NFT image'} width={24} height={24} className="rounded-sm mr-2 object-cover" data-ai-hint="nft image small"/>
                {selectedNftForView?.title}
            </DialogTitle>
            <DialogDescription>Detailed information for NFT ID: {selectedNftForView?.id}.</DialogDescription>
          </DialogHeader>
          {selectedNftForView && (
            <div className="space-y-2 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              <div className="flex justify-center mb-4">
                <Image src={selectedNftForView.thumbnailUrl.replace('40x40', '200x200')} alt={selectedNftForView.title} width={200} height={200} className="rounded-md border object-cover" data-ai-hint="nft image large"/>
              </div>
              <p><strong>Artist:</strong> {selectedNftForView.artistName}</p>
              <p><strong>Category:</strong> {selectedNftForView.category}</p>
              <p><strong>Price:</strong> {selectedNftForView.priceEth.toFixed(2)} ETH</p>
              <p><strong>Status:</strong> <Badge variant={nftStatusVariantMap[selectedNftForView.status]} className={`${selectedNftForView.status === 'Featured' ? 'border-primary text-primary' : ''}`}>{selectedNftForView.status}</Badge></p>
              <p><strong>Date Listed:</strong> {selectedNftForView.dateListed}</p>
              <p><strong>Simulated Owner:</strong> {selectedNftForView.owner || 'N/A'}</p>
              <p><strong>Description:</strong> {selectedNftForView.description || 'No description available.'}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
    

    
