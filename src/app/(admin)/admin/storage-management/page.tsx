
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, HardDrive, Settings, AlertCircle, Database, ImageIcon, ListFilter, Loader2, Search, Trash2, ExternalLink, ArrowRight, InfoIcon, FileArchive, Sigma } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { apiService, ApiError } from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import type { StorageFile, StorageBucketMetadata, PaginatedStorageFilesResponse } from '@/types/entities';
import { format } from 'date-fns';
import { ConfirmationDialog } from '@/components/common/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

interface PlatformSettingsData {
  maxFileSizeMb?: number;
}

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}


export default function StorageManagementPage() {
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [platformSettings, setPlatformSettings] = useState<PlatformSettingsData | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined);
  const [allPageTokens, setAllPageTokens] = useState<Array<string | undefined>>([undefined]); 
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const [bucketMetadata, setBucketMetadata] = useState<StorageBucketMetadata | null>(null);
  const [isLoadingBucketMeta, setIsLoadingBucketMeta] = useState(true);
  const [bucketMetaError, setBucketMetaError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [fileToDelete, setFileToDelete] = useState<StorageFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPlatformSettings = useCallback(async () => {
    if (!token) return;
    setIsLoadingSettings(true);
    setSettingsError(null);
    try {
      const response = await apiService.get<{ data: Record<string, any> }>('/admin/settings', token);
      setPlatformSettings({
          maxFileSizeMb: response.data.maxFileSizeMb
      });
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load platform settings.';
      setSettingsError(errorMessage);
    } finally {
      setIsLoadingSettings(false);
    }
  }, [token]);

  const fetchStorageBucketMeta = useCallback(async () => {
    if (!token) return;
    setIsLoadingBucketMeta(true);
    setBucketMetaError(null);
    try {
      const response = await apiService.get<{ data: StorageBucketMetadata }>('/admin/storage/stats', token);
      setBucketMetadata(response.data);
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load storage metadata.';
      setBucketMetaError(errorMessage);
    } finally {
      setIsLoadingBucketMeta(false);
    }
  }, [token]);
  
  const fetchStorageFiles = useCallback(async (pageToken?: string, prefix?: string) => {
    if (!token) return;
    setIsLoadingFiles(true);
    setFilesError(null);
    
    if (pageToken === undefined || (prefix !== activeSearchTerm && prefix !== undefined) || (prefix === activeSearchTerm && pageToken !== allPageTokens[currentPageIndex])) {
       setFiles([]); 
    }

    try {
      const params = new URLSearchParams({
        limit: String(ITEMS_PER_PAGE),
      });
      if (pageToken) params.append('pageToken', pageToken);
      if (prefix) params.append('prefix', prefix);

      const response = await apiService.get<{ data: PaginatedStorageFilesResponse }>(`/admin/storage/files?${params.toString()}`, token);
      setFiles(response.data.files || []);
      setNextPageToken(response.data.nextPageToken);
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load files from storage.';
      setFilesError(errorMessage);
      setFiles([]);
    } finally {
      setIsLoadingFiles(false);
    }
  }, [token, activeSearchTerm, allPageTokens, currentPageIndex]);

  const debouncedFetchFiles = useMemo(
    () => debounce((term: string) => {
      setActiveSearchTerm(term);
      setCurrentPageIndex(0);
      setAllPageTokens([undefined]); 
      fetchStorageFiles(undefined, term);
    }, 500),
    [fetchStorageFiles] 
  );

  useEffect(() => {
    debouncedFetchFiles(searchTerm);
  }, [searchTerm, debouncedFetchFiles]);


  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }
    fetchPlatformSettings();
    fetchStorageBucketMeta();
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router, fetchPlatformSettings, fetchStorageBucketMeta]);

   useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchStorageFiles(allPageTokens[currentPageIndex], activeSearchTerm);
    }
  }, [isAuthenticated, isAdmin, fetchStorageFiles, currentPageIndex, allPageTokens, activeSearchTerm]);


  const handleNextPage = () => {
    if (nextPageToken) {
      const newTokens = [...allPageTokens.slice(0, currentPageIndex + 1), nextPageToken];
      setAllPageTokens(newTokens);
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };


  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDeleteFile = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await apiService.del(`/admin/storage/files?path=${encodeURIComponent(fileToDelete.path)}`, token);
      toast({ title: "File Deleted", description: `${fileToDelete.name} has been deleted.` });
      fetchStorageFiles(allPageTokens[currentPageIndex], activeSearchTerm); 
    } catch (error: any) {
      const errorMessage = error instanceof ApiError ? error.data?.message || error.message : "Failed to delete file.";
      toast({ title: "Deletion Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setFileToDelete(null);
    }
  };


  if (isAuthLoading || (!isAuthenticated && !isAuthLoading && !isAdmin)) {
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-xl rounded-xl">
                <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <HardDrive className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-headline text-primary tracking-tight">Storage Configuration</CardTitle>
                      <CardDescription className="mt-1 text-sm">Current storage provider and settings.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    {bucketMetaError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{bucketMetaError}</AlertDescription></Alert>}
                    {isLoadingBucketMeta ? <Skeleton className="h-6 w-3/4 mb-1" /> :
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Storage Provider:</p>
                            <p className="text-lg font-semibold text-foreground">{bucketMetadata?.bucketName ? "Firebase Cloud Storage" : "Unknown / Not Configured"}</p>
                        </div>
                    }
                    {isLoadingBucketMeta ? <Skeleton className="h-6 w-1/2" /> :
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Bucket Name:</p>
                            <p className="text-lg font-semibold text-foreground break-all">{bucketMetadata?.bucketName || 'N/A'}</p>
                        </div>
                    }

                    {settingsError && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{settingsError}</AlertDescription></Alert>}
                    {isLoadingSettings ? <Skeleton className="h-6 w-2/3" /> : platformSettings?.maxFileSizeMb !== undefined &&
                         <div>
                            <p className="text-sm font-medium text-muted-foreground">Max Upload File Size (Platform Setting):</p>
                            <p className="text-lg font-semibold text-foreground">{platformSettings.maxFileSizeMb} MB</p>
                        </div>
                    }
                    <Alert variant="default" className="bg-muted/50">
                        <Settings className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Configuration Note</AlertTitle>
                        <AlertDescription className="text-xs">
                            The storage provider (Firebase Cloud Storage) and its core settings (bucket name, credentials) are configured on the backend via environment variables. They are not modifiable through this admin UI.
                        </AlertDescription>
                    </Alert>
                     <Button variant="outline" className="w-full" asChild>
                        <Link href="/admin/platform-settings"><Settings className="mr-2 h-4 w-4"/>Manage General Platform Settings</Link>
                     </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl rounded-xl">
                <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Sigma className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                    <div>
                      <CardTitle className="text-xl sm:text-2xl font-headline text-primary tracking-tight">Storage Statistics</CardTitle>
                       <CardDescription className="mt-1 text-sm">Overview of storage usage.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-3">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Files on Current Page:</p>
                        <p className="text-lg font-semibold text-foreground">{isLoadingFiles ? <Skeleton className="h-5 w-8 inline-block" /> : files.length.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Files in Bucket:</p>
                        <p className="text-lg font-semibold text-foreground">N/A (Requires Advanced Query)</p>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Storage Used:</p>
                        <p className="text-lg font-semibold text-foreground">N/A (Requires Advanced Query)</p>
                    </div>
                     <Alert variant="default" className="bg-muted/50">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle className="font-semibold">Statistics Note</AlertTitle>
                        <AlertDescription className="text-xs">
                           Obtaining real-time total file count and total storage size for the entire bucket (especially large ones) via the Admin SDK is complex and can be resource-intensive. For comprehensive storage analytics, please refer to your cloud provider's console (e.g., Firebase Console).
                        </AlertDescription>
                    </Alert>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-xl rounded-xl">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-headline text-primary tracking-tight flex items-center"><ImageIcon className="mr-2 h-6 w-6"/>Uploaded Files</CardTitle>
                    <CardDescription>Browse and manage files in the storage bucket. Search by path prefix (e.g., "uploads/images/").</CardDescription>
                </CardHeader>
                <CardContent>
                    {filesError && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{filesError}</AlertDescription></Alert>}
                    
                    <div className="mb-4 flex items-center gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Search by path prefix (e.g., uploads/images/)..." 
                                className="pl-10 h-10" 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto border rounded-md">
                        <Table>
                        <TableCaption>
                            {isLoadingFiles && files.length === 0 && !activeSearchTerm ? "Loading files..." 
                            : isLoadingFiles && files.length === 0 && activeSearchTerm ? `Loading files matching prefix: "${activeSearchTerm}"...`
                            : !isLoadingFiles && files.length === 0 && activeSearchTerm 
                                ? `No files found matching prefix: "${activeSearchTerm}"`
                                : !isLoadingFiles && files.length === 0 
                                ? "No files found in this location or current page."
                                : `Displaying ${files.length} files on current page.`
                            }
                        </TableCaption>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead className="hidden sm:table-cell">Size</TableHead><TableHead className="hidden md:table-cell">Type</TableHead><TableHead>Last Modified</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {isLoadingFiles ? (
                                Array.from({length: 5}).map((_, i) => (
                                    <TableRow key={`skel-file-${i}`}>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell className="text-right space-x-1">
                                          <Skeleton className="h-7 w-7 inline-block rounded" />
                                          <Skeleton className="h-7 w-7 inline-block rounded" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : files.length > 0 ? (
                                files.map((file) => (
                                    <TableRow key={file.name}>
                                        <TableCell className="font-medium truncate max-w-[150px] sm:max-w-xs md:max-w-sm" title={file.name}>{file.name.split('/').pop()}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{formatFileSize(file.size)}</TableCell>
                                        <TableCell className="hidden md:table-cell truncate max-w-[100px]">{file.contentType || 'N/A'}</TableCell>
                                        <TableCell>{format(new Date(file.updated), "PPp")}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                                                <Link href={file.publicUrl} target="_blank" rel="noopener noreferrer" aria-label="View file">
                                                    <ExternalLink className="h-4 w-4"/>
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setFileToDelete(file)} aria-label="Delete file">
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    {activeSearchTerm ? `No files found matching prefix: "${activeSearchTerm}"` : "No files to display."}
                                </TableCell></TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </div>
                    {!isLoadingFiles && (files.length > 0 || currentPageIndex > 0 || nextPageToken) && (
                        <div className="mt-6 flex justify-center items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPageIndex === 0 || isLoadingFiles}>
                            <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">Page {currentPageIndex + 1}</span>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!nextPageToken || isLoadingFiles}>
                            Next <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                        </div>
                    )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {fileToDelete && <ConfirmationDialog isOpen={!!fileToDelete} onOpenChange={() => setFileToDelete(null)} onConfirm={handleDeleteFile} title={`Delete File: ${fileToDelete.name.split('/').pop()}`} description={`Are you sure you want to delete this file? Path: ${fileToDelete.path}. This action cannot be undone.`} confirmButtonText="Delete" isDestructive isConfirming={isDeleting}/>}
      <Toaster />
    </>
  );
}
