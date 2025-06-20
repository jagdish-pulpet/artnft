
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Library, Search, Edit, Trash2, CheckCircle, XCircle, MoreHorizontal, Eye, Loader2, AlertCircle, ArrowRight, SquarePen } from 'lucide-react';
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
import type { Collection, PaginatedResponse } from '@/types/entities';
import { UpdateCollectionStatusModal } from '@/components/admin/update-collection-status-modal';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_PAGE = 10;

export default function ManageCollectionsPage() {
  const { toast } = useToast();
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerification, setFilterVerification] = useState<'all' | 'true' | 'false'>('all');

  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchCollections = useCallback(async (pageToFetch: number) => {
    if (!token) return;
    setIsLoadingPage(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        limit: String(ITEMS_PER_PAGE),
      });
      if (searchTerm) params.append('search', searchTerm);
      if (filterVerification !== 'all') params.append('isVerified', filterVerification);
      
      const response = await apiService.get<PaginatedResponse<Collection>>(`/admin/collections?${params.toString()}`, token);
      setCollections(response.data || []);
      setCurrentPage(response.meta?.page || 1);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load collections.';
      setError(errorMessage);
      setCollections([]);
    } finally {
      setIsLoadingPage(false);
    }
  }, [token, searchTerm, filterVerification]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }
    fetchCollections(currentPage);
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router, fetchCollections, currentPage]);

  useEffect(() => { 
    if (currentPage !== 1) setCurrentPage(1);
    else fetchCollections(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterVerification]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOpenStatusModal = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsStatusModalOpen(true);
  };

  const handleCollectionUpdated = () => {
    fetchCollections(currentPage);
  };
  
  const handleOpenDeleteDialog = (collection: Collection) => {
    setCollectionToDelete(collection);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteCollection = async () => {
    if (!token || !collectionToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.del(`/admin/collections/${collectionToDelete.id}`, token);
      toast({ title: "Collection Deleted", description: `${collectionToDelete.name} has been deleted.` });
      if (collections.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchCollections(currentPage);
      }
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to delete collection.";
      toast({ title: "Deletion Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsConfirmDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };
  
  if (isAuthLoading || (!isAuthenticated && !isAuthLoading)) {
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild><Link href="/admin/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin Dashboard</Link></Button>
          </div>

          <Card className="shadow-xl rounded-xl">
            <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Library className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-headline text-primary tracking-tight">Manage Collections</CardTitle>
                  <CardDescription className="mt-1 text-base">Review, verify, and organize NFT collections.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Input type="search" placeholder="Search by name, ID, creator..." className="w-full pl-10 pr-4 h-10 text-base focus:bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select value={filterVerification} onValueChange={(value) => setFilterVerification(value as 'all' | 'true' | 'false')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Verification" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Verification</SelectItem>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Not Verified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (<Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}

              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{isLoadingPage && collections.length === 0 ? "Loading collections..." : !isLoadingPage && collections.length === 0 ? "No collections found matching your criteria. Try adjusting your search or filters." : "A list of NFT collections."}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Logo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Creator</TableHead>
                      <TableHead className="text-center hidden md:table-cell">Items</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead className="hidden lg:table-cell">Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPage && collections.length === 0 ? (
                        Array.from({length: ITEMS_PER_PAGE}).map((_, i) => (
                            <TableRow key={`skel-col-${i}`}>
                                <TableCell><div className="h-10 w-10 bg-muted rounded-md animate-pulse"></div></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                                <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                                <TableCell className="text-center hidden md:table-cell"><div className="h-4 bg-muted rounded w-10 animate-pulse mx-auto"></div></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded-full w-16 animate-pulse"></div></TableCell>
                                <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                                <TableCell className="text-right"><div className="h-8 bg-muted rounded w-8 animate-pulse"></div></TableCell>
                            </TableRow>
                        ))
                    ): collections.length > 0 ? (
                      collections.map((collection) => (
                        <TableRow key={collection.id}>
                           <TableCell><NextImage src={collection.logoImageUrl || 'https://placehold.co/40x40.png'} alt={collection.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint="collection logo symbol"/></TableCell>
                          <TableCell className="font-semibold text-primary truncate max-w-[150px]">{collection.name}</TableCell>
                          <TableCell className="truncate max-w-[150px] hidden sm:table-cell">{collection.creator?.username || 'N/A'}</TableCell>
                          <TableCell className="text-center hidden md:table-cell">{collection.itemCount}</TableCell>
                          <TableCell><Badge variant={collection.isVerified ? 'outline' : 'secondary'} className={collection.isVerified ? "border-green-500 text-green-600" : ""}>{collection.isVerified ? 'Yes' : 'No'}</Badge></TableCell>
                          <TableCell className="hidden lg:table-cell">{new Date(collection.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Collection Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenStatusModal(collection)}><SquarePen className="mr-2 h-4 w-4" /> Edit Status</DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={`/collections/${collection.slug || collection.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" /> View Public Page</Link></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleOpenDeleteDialog(collection)}><Trash2 className="mr-2 h-4 w-4" /> Delete Collection</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8 h-40">No collections found matching your criteria. Try adjusting your search or filters.</TableCell></TableRow>
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
      {selectedCollection && <UpdateCollectionStatusModal isOpen={isStatusModalOpen} onOpenChange={setIsStatusModalOpen} collectionToUpdate={selectedCollection} onCollectionUpdated={handleCollectionUpdated} />}
      {collectionToDelete && <ConfirmationDialog isOpen={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen} onConfirm={confirmDeleteCollection} title={`Delete Collection: ${collectionToDelete.name}`} description="Are you sure you want to delete this collection? This action cannot be undone." confirmButtonText="Delete" isDestructive isConfirming={isDeleting}/>}
      <Toaster />
    </>
  );
}
