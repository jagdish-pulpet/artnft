
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, FileTextIcon, Search, Eye, MoreHorizontal, Loader2, AlertCircle, ArrowRight, SquarePen, UserCircle, PackageIcon, PaletteIcon, MessageSquareIcon } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { apiService, ApiError } from '@/lib/apiService';
import type { Report, ReportStatus as ReportStatusEnum, ReportedItemType as ReportedItemTypeEnum, PaginatedResponse } from '@/types/entities';
import { UpdateReportStatusModal } from '@/components/admin/update-report-status-modal';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_PAGE = 10;

export default function ViewReportsPage() {
  const { toast } = useToast();
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReportStatusEnum | 'all'>('all');
  const [filterItemType, setFilterItemType] = useState<ReportedItemTypeEnum | 'all'>('all');

  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchReports = useCallback(async (pageToFetch: number) => {
    if (!token) return;
    setIsLoadingPage(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        limit: String(ITEMS_PER_PAGE),
      });
      if (searchTerm) params.append('search', searchTerm); 
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterItemType !== 'all') params.append('reportedItemType', filterItemType);
      
      const response = await apiService.get<PaginatedResponse<Report>>(`/admin/reports?${params.toString()}`, token);
      setReports(response.data || []);
      setCurrentPage(response.meta?.page || 1);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load reports.';
      setError(errorMessage);
      setReports([]);
    } finally {
      setIsLoadingPage(false);
    }
  }, [token, searchTerm, filterStatus, filterItemType]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }
    fetchReports(currentPage);
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router, fetchReports, currentPage]);

  useEffect(() => { 
    if (currentPage !== 1) setCurrentPage(1);
    else fetchReports(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, filterItemType]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOpenUpdateModal = (report: Report) => {
    setSelectedReport(report);
    setIsUpdateModalOpen(true);
  };
  
  const handleReportUpdated = () => {
    fetchReports(currentPage); 
  };
  
  const getStatusBadgeVariant = (status: ReportStatusEnum) => {
    switch (status) {
      case ReportStatusEnum.PENDING_REVIEW: return 'secondary';
      case ReportStatusEnum.ACTION_TAKEN: return 'default';
      case ReportStatusEnum.RESOLVED: return 'outline'; 
      case ReportStatusEnum.DISMISSED: return 'destructive';
      default: return 'default';
    }
  };

  const getItemTypeIcon = (itemType: ReportedItemTypeEnum) => {
    switch(itemType) {
        case ReportedItemTypeEnum.NFT: return <PackageIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case ReportedItemTypeEnum.COLLECTION: return <PaletteIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case ReportedItemTypeEnum.USER: return <UserCircle className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        case ReportedItemTypeEnum.COMMENT: return <MessageSquareIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
        default: return <FileTextIcon className="h-4 w-4 mr-1.5 text-muted-foreground"/>;
    }
  };

  const getReportedItemLink = (report: Report): string => {
    switch(report.reportedItemType) {
        case ReportedItemTypeEnum.NFT: return `/nft/${report.reportedItemId}`;
        case ReportedItemTypeEnum.COLLECTION: return `/collections/${report.reportedItemId}`; 
        case ReportedItemTypeEnum.USER: return `/profile/${report.reportedItemId}`;
        default: return '#';
    }
  }

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
                <FileTextIcon className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-headline text-primary tracking-tight">Manage Reports</CardTitle>
                  <CardDescription className="mt-1 text-base">Review and manage user-submitted reports.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative sm:col-span-2 lg:col-span-1">
                  <Input type="search" placeholder="Search by ID, Reporter, Reason..." className="w-full pl-10 pr-4 h-10 text-base focus:bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as ReportStatusEnum | 'all')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.values(ReportStatusEnum).map(status => <SelectItem key={status} value={status}>{status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={filterItemType} onValueChange={(value) => setFilterItemType(value as ReportedItemTypeEnum | 'all')}>
                  <SelectTrigger className="h-10 text-base"><SelectValue placeholder="Filter by Item Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Item Types</SelectItem>
                     {Object.values(ReportedItemTypeEnum).map(type => <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {error && (<Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>)}

              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{isLoadingPage && reports.length === 0 ? "Loading reports..." : !isLoadingPage && reports.length === 0 ? "No reports found matching your criteria. Try adjusting your search or filters." : "A list of user-submitted reports."}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden lg:table-cell">Report ID</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead className="hidden sm:table-cell">Reporter</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPage && reports.length === 0 ? (
                        Array.from({length: ITEMS_PER_PAGE}).map((_, i) => (
                            <TableRow key={`skel-report-${i}`}>
                                <TableCell className="font-medium hidden lg:table-cell"><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded w-28 animate-pulse"></div></TableCell>
                                <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                                <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded-full w-24 animate-pulse"></div></TableCell>
                                <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                                <TableCell className="text-right"><div className="h-8 bg-muted rounded w-8 animate-pulse"></div></TableCell>
                            </TableRow>
                        ))
                    ): reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium truncate max-w-[80px] hidden lg:table-cell">{report.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                                {getItemTypeIcon(report.reportedItemType)}
                                <Link href={getReportedItemLink(report)} target="_blank" className="hover:underline text-primary truncate max-w-[100px]" title={`View ${report.reportedItemType.toLowerCase()} ${report.reportedItemId}`}>
                                {report.reportedItemType.charAt(0).toUpperCase() + report.reportedItemType.slice(1).toLowerCase()}: {report.reportedItemId.substring(0,8)}...
                                </Link>
                            </div>
                          </TableCell>
                          <TableCell className="truncate max-w-[200px] hidden md:table-cell">{report.reason}</TableCell>
                          <TableCell className="truncate max-w-[100px] hidden sm:table-cell">
                            {report.reporter ? (
                                <Link href={`/profile/${report.reporter.id}`} target="_blank" className="hover:underline">{report.reporter.username}</Link>
                            ) : 'N/A'}
                          </TableCell>
                           <TableCell>
                            <Badge variant={getStatusBadgeVariant(report.status)} className={report.status === ReportStatusEnum.RESOLVED ? 'border-green-500 text-green-600' : ''}>
                              {report.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Report Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenUpdateModal(report)}><SquarePen className="mr-2 h-4 w-4" /> View/Update Status</DropdownMenuItem>
                                <DropdownMenuItem asChild><Link href={getReportedItemLink(report)} target="_blank"><Eye className="mr-2 h-4 w-4" /> View Reported Item</Link></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                         <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8 h-40">No reports found matching your criteria. Try adjusting your search or filters.</TableCell></TableRow>
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
      {selectedReport && <UpdateReportStatusModal isOpen={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen} reportToUpdate={selectedReport} onReportUpdated={handleReportUpdated} />}
      <Toaster />
    </>
  );
}
