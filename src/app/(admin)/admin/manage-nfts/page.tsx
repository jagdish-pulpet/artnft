
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Package, Search, Edit, Trash2, CheckCircle, XCircle, Eye, MoreHorizontal, Loader2, AlertCircle, ArrowRight, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { apiService, ApiError } from '@/lib/apiService';
import type { Nft, AdminNftReviewStatus as AdminNftReviewStatusEnum, PaginatedResponse } from '@/types/entities';
import { UpdateNftStatusModal } from '@/components/admin/update-nft-status-modal';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_PAGE = 10;

export default function ManageNftsPage() {
  const { toast } = useToast();
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [nfts, setNfts] = useState<Nft[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReviewStatus, setFilterReviewStatus] = useState<AdminNftReviewStatusEnum | 'all'>('all');
  const [filterVerification, setFilterVerification] = useState<'all' | 'true' | 'false'>('all');
  const [filterListingStatus, setFilterListingStatus] = useState<'all' | 'true' | 'false'>('all');

  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [nftToDelete, setNftToDelete] = useState<Nft | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNfts = useCallback(async (pageToFetch: number) => {
    if (!token) return;
    setIsLoadingPage(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        limit: String(ITEMS_PER_PAGE),
      });
      if (searchTerm) params.append('search', searchTerm);
      if (filterReviewStatus !== 'all') params.append('adminReviewStatus', filterReviewStatus);
      if (filterVerification !== 'all') params.append('isVerifiedByAdmin', filterVerification);
      if (filterListingStatus !== 'all') params.append('isListedForSale', filterListingStatus);

      const response = await apiService.get<PaginatedResponse<Nft>>(`/admin/nfts?${params.toString()}`, token);
      setNfts(response.data || []);
      setCurrentPage(response.meta?.page || 1);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load NFTs.';
      setError(errorMessage);
      setNfts([]);
    } finally {
      setIsLoadingPage(false);
    }
  }, [token, searchTerm, filterReviewStatus, filterVerification, filterListingStatus]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }
    fetchNfts(currentPage);
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router, fetchNfts, currentPage]);
  
  useEffect(() => { 
    if (currentPage !== 1) setCurrentPage(1);
    else fetchNfts(1); // Fetch if already on page 1 but filters changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterReviewStatus, filterVerification, filterListingStatus]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOpenStatusModal = (nft: Nft) => {
    setSelectedNft(nft);
    setIsStatusModalOpen(true);
  };
  
  const handleNftUpdated = () => {
    fetchNfts(currentPage); 
  };

  const handleOpenDeleteDialog = (nft: Nft) => {
    setNftToDelete(nft);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteNft = async () => {
    if (!token || !nftToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.del(`/admin/nfts/${nftToDelete.id}`, token);
      toast({ title: "NFT Deleted", description: `${nftToDelete.title} has been deleted.` });
      // Fetch current page, or page 1 if current page becomes empty
      if (nfts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchNfts(currentPage); 
      }
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to delete NFT.";
      toast({ title: "Deletion Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteDialogOpen(false);
      setNftToDelete(null);
    }
  };

  const getReviewStatusBadgeVariant = (status?: AdminNftReviewStatusEnum) => {
    switch (status) {
      case AdminNftReviewStatusEnum.APPROVED: return 'default'; 
      case AdminNftReviewStatusEnum.PENDING: return 'secondary';
      case AdminNftReviewStatusEnum.REJECTED: return 'destructive';
      default: return 'outline';
    }
  };
  
  const reviewStatusOptions = Object.values(AdminNftReviewStatusEnum);


  if (isAuthLoading || (!isAuthenticated && !isAuthLoading)) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin Dashboard</Link>
            </Button>
          </div>

          <Card className="shadow-xl rounded-xl">
            <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Package className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-headline text-primary tracking-tight">Manage NFTs</CardTitle>
                  <CardDescription className="mt-1 text-base">Review, verify, and manage all NFTs on the platform.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Input type="search" placeholder="Search by title, ID, creator..." className="w-full pl-10 pr-4 h-10 text-base focus:bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select value={filterReviewStatus} onValueChange={(value) => setFilterReviewStatus(value as AdminNftReviewStatusEnum | 'all')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Review Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Review Statuses</SelectItem>
                    {reviewStatusOptions.map(status => <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterVerification} onValueChange={(value) => setFilterVerification(value as 'all' | 'true' | 'false')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Verification" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Not Verified</SelectItem>
                  </SelectContent>
                </Select>
                 <Select value={filterListingStatus} onValueChange={(value) => setFilterListingStatus(value as 'all' | 'true' | 'false')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Listing Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Listing Statuses</SelectItem>
                    <SelectItem value="true">Listed for Sale</SelectItem>
                    <SelectItem value="false">Not Listed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (<Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}

              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{isLoadingPage && nfts.length === 0 ? "Loading NFTs..." : !isLoadingPage && nfts.length === 0 ? "No NFTs found matching your criteria. Try adjusting your search or filters." : "A list of NFTs."}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Collection</TableHead>
                      <TableHead className="hidden sm:table-cell">Creator</TableHead>
                      <TableHead>Review Status</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead className="hidden lg:table-cell">Listed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPage && nfts.length === 0 ? (
                        Array.from({length: ITEMS_PER_PAGE}).map((_, i) => (
                            <TableRow key={`skel-nft-${i}`}>
                                <TableCell><div className="h-10 w-10 bg-muted rounded animate-pulse"></div></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                                <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                                <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded-full w-24 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded-full w-16 animate-pulse"></div></TableCell>
                                <TableCell className="hidden lg:table-cell"><div className="h-6 bg-muted rounded-full w-12 animate-pulse"></div></TableCell>
                                <TableCell className="text-right"><div className="h-8 bg-muted rounded w-8 animate-pulse"></div></TableCell>
                            </TableRow>
                        ))
                    ) : nfts.length > 0 ? (
                      nfts.map((nft) => (
                        <TableRow key={nft.id}>
                          <TableCell><NextImage src={nft.imageUrl || 'https://placehold.co/40x40.png'} alt={nft.title} width={40} height={40} className="rounded-md object-cover" data-ai-hint="nft artwork small"/></TableCell>
                          <TableCell className="font-semibold text-primary truncate max-w-[150px]">{nft.title}</TableCell>
                          <TableCell className="truncate max-w-[150px] hidden md:table-cell">{nft.collection?.name || 'N/A'}</TableCell>
                          <TableCell className="truncate max-w-[100px] hidden sm:table-cell">{nft.creator?.username || 'N/A'}</TableCell>
                          <TableCell><Badge variant={getReviewStatusBadgeVariant(nft.adminReviewStatus)}>{nft.adminReviewStatus ? nft.adminReviewStatus.charAt(0).toUpperCase() + nft.adminReviewStatus.slice(1) : 'N/A'}</Badge></TableCell>
                          <TableCell><Badge variant={nft.isVerifiedByAdmin ? 'outline' : 'secondary'} className={nft.isVerifiedByAdmin ? "border-green-500 text-green-600" : ""}>{nft.isVerifiedByAdmin ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell className="hidden lg:table-cell"><Badge variant={nft.isListedForSale ? 'default' : 'outline'}>{nft.isListedForSale ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>NFT Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenStatusModal(nft)}><SquarePen className="mr-2 h-4 w-4" /> Edit Status</DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/nft/${nft.slug || nft.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" /> View Public Page</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleOpenDeleteDialog(nft)}><Trash2 className="mr-2 h-4 w-4" /> Delete NFT</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                         <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8 h-40">No NFTs found matching your criteria. Try adjusting your search or filters.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
               {!isLoadingPage && totalPages > 0 && (
                 <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="py-6"
                  />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      {selectedNft && <UpdateNftStatusModal isOpen={isStatusModalOpen} onOpenChange={setIsStatusModalOpen} nftToUpdate={selectedNft} onNftUpdated={handleNftUpdated} />}
      {nftToDelete && <ConfirmationDialog isOpen={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen} onConfirm={confirmDeleteNft} title={`Delete NFT: ${nftToDelete.title}`} description="Are you sure you want to delete this NFT? This action cannot be undone." confirmButtonText="Delete" isDestructive isConfirming={isDeleting}/>}
      <Toaster />
    </>
  );
}
