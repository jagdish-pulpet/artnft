
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ShieldAlert, MoreHorizontal, Search, Filter, Eye, CheckCircle, XCircle, AlertOctagon, UserX, Loader2, MessageSquareWarning } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

type ReportStatus = 'Pending' | 'Approved' | 'Rejected';
type ContentType = 'NFT' | 'User Profile' | 'Comment';

interface MockReportedItem {
  id: string;
  contentType: ContentType;
  itemId: string; // e.g., NFT ID, User ID
  itemTitle?: string; // e.g., NFT title
  itemThumbnailUrl?: string; // For NFT
  reportedBy: string; // Username of reporter
  reason: string;
  reportDetails?: string;
  dateReported: Date;
  status: ReportStatus;
}

const initialMockReportedItems: MockReportedItem[] = [
  { id: 'rep_001', contentType: 'NFT', itemId: 'nft_003', itemTitle: 'Synthwave Sunset', itemThumbnailUrl: 'https://placehold.co/40x40.png', reportedBy: 'UserX', reason: 'Inappropriate Content', reportDetails: 'Contains sensitive imagery not suitable for the platform.', dateReported: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'Pending' },
  { id: 'rep_002', contentType: 'NFT', itemId: 'nft_001', itemTitle: 'Cosmic Dreamscape', itemThumbnailUrl: 'https://placehold.co/40x40.png', reportedBy: 'ArtGuardian', reason: 'Copyright Infringement', reportDetails: 'This artwork is a direct copy of my original piece.', dateReported: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'Pending' },
  { id: 'rep_003', contentType: 'User Profile', itemId: 'usr_002', itemTitle: 'PixelPioneer', reportedBy: 'CommunityMod', reason: 'Spamming Comments', dateReported: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'Approved' },
  { id: 'rep_004', contentType: 'NFT', itemId: 'nft_placeholder_xyz', itemTitle: 'Mysterious Object', itemThumbnailUrl: 'https://placehold.co/40x40.png', reportedBy: 'ConcernedUser', reason: 'Misleading Information', reportDetails: 'Description does not match the artwork.', dateReported: new Date(Date.now() - 48 * 60 * 60 * 1000), status: 'Rejected' },
];

const statusVariantMap: Record<ReportStatus, "default" | "secondary" | "destructive" | "outline"> = {
  'Pending': 'destructive',
  'Approved': 'default', // 'success' if we had a green variant
  'Rejected': 'secondary',
};

const statusIconMap: Record<ReportStatus, React.ElementType> = {
    'Pending': AlertOctagon,
    'Approved': CheckCircle,
    'Rejected': XCircle,
};

export default function AdminModerationPage() {
  const { toast } = useToast();
  const [reportedItems, setReportedItems] = useState<MockReportedItem[]>(initialMockReportedItems);
  const [selectedItem, setSelectedItem] = useState<MockReportedItem | null>(null);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const handleAction = async (itemId: string, action: 'approve' | 'reject' | 'warn_user' | 'suspend_user') => {
    setIsProcessingAction(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));

    const item = reportedItems.find(it => it.id === itemId);
    if (!item) return;

    let newStatus: ReportStatus = item.status;
    let toastMessage = '';

    switch (action) {
      case 'approve':
        newStatus = 'Approved';
        toastMessage = `Report for '${item.itemTitle || item.itemId}' approved. Content remains visible.`;
        break;
      case 'reject':
        newStatus = 'Rejected';
        toastMessage = `Report for '${item.itemTitle || item.itemId}' rejected. Content (simulated) hidden/action taken.`;
        break;
      case 'warn_user':
        toastMessage = `User associated with '${item.itemTitle || item.itemId}' (simulated) warned.`;
        break;
      case 'suspend_user':
        toastMessage = `User associated with '${item.itemTitle || item.itemId}' (simulated) suspended.`;
        break;
    }
    
    if (action === 'approve' || action === 'reject') {
      setReportedItems(prevItems =>
        prevItems.map(it => it.id === itemId ? { ...it, status: newStatus } : it)
      );
    }

    toast({
      title: `Action Taken (Simulated)`,
      description: toastMessage,
    });
    setIsProcessingAction(false);
  };

  const openViewDialog = (item: MockReportedItem) => {
    setSelectedItem(item);
    setIsViewDetailsDialogOpen(true);
  };
  
  const filteredItems = reportedItems.filter(item => {
    const matchesSearch = item.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.itemTitle && item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          item.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.contentType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <ShieldAlert className="mr-3 h-7 w-7" /> Content Moderation Queue
        </h1>
        <p className="text-muted-foreground">Review and manage reported content and user conduct.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
            <div className="relative lg:col-span-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by item ID, title, reporter..." 
                className="pl-8 w-full h-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-10">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full h-10">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content Types</SelectItem>
                <SelectItem value="NFT">NFT</SelectItem>
                <SelectItem value="User Profile">User Profile</SelectItem>
                <SelectItem value="Comment">Comment (Simulated)</SelectItem>
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
            <CardTitle className="text-lg">Reported Items</CardTitle>
            <CardDescription>Showing {filteredItems.length} of {reportedItems.length} reported item(s).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Content Type</TableHead>
                  <TableHead>Item / ID</TableHead>
                  <TableHead className="hidden md:table-cell">Reported By</TableHead>
                  <TableHead className="hidden lg:table-cell">Reason</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length > 0 ? filteredItems.map((item) => {
                  const StatusBadgeIcon = statusIconMap[item.status];
                  return(
                  <TableRow key={item.id}>
                    <TableCell><Badge variant="outline">{item.contentType}</Badge></TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[150px] sm:max-w-[200px]" title={item.itemTitle || item.itemId}>
                        {item.itemTitle || item.itemId}
                      </div>
                      {item.itemTitle && <div className="text-xs text-muted-foreground sm:hidden">ID: {item.itemId}</div>}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{item.reportedBy}</TableCell>
                    <TableCell className="hidden lg:table-cell truncate max-w-[150px]">{item.reason}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs">{formatDistanceToNow(item.dateReported, { addSuffix: true })}</TableCell>
                    <TableCell>
                       <Badge 
                        variant={statusVariantMap[item.status]} 
                        className={`text-xs ${item.status === 'Approved' ? 'border-green-500 text-green-700 dark:text-green-400' : ''}
                                   ${item.status === 'Pending' ? 'border-yellow-500 text-yellow-700 dark:text-yellow-400' : ''}
                                   ${item.status === 'Rejected' ? 'border-gray-500 text-gray-700 dark:text-gray-400' : ''}
                        `}
                      >
                        <StatusBadgeIcon className="h-3 w-3 mr-1.5" />
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isProcessingAction}>
                            {isProcessingAction && reportedItems.find(i=>i.id === item.id) ? <Loader2 className="h-4 w-4 animate-spin"/> : <MoreHorizontal className="h-4 w-4" />}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Moderation Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(item)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {item.status === 'Pending' && (
                            <DropdownMenuItem onClick={() => handleAction(item.id, 'approve')} className="text-green-600 focus:text-green-700">
                                <CheckCircle className="mr-2 h-4 w-4" /> Approve Report
                            </DropdownMenuItem>
                          )}
                          {item.status === 'Pending' && (
                            <DropdownMenuItem onClick={() => handleAction(item.id, 'reject')} className="text-orange-600 focus:text-orange-700">
                                <XCircle className="mr-2 h-4 w-4" /> Reject & Hide Content
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleAction(item.id, 'warn_user')}>
                            <MessageSquareWarning className="mr-2 h-4 w-4" /> Warn User (Content Creator)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction(item.id, 'suspend_user')} className="text-destructive focus:text-destructive">
                            <UserX className="mr-2 h-4 w-4" /> Suspend User (Content Creator)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}) : (
                   <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No reported items found matching your criteria or queue is empty.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <CardFooter className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <p>{filteredItems.length} item(s) displayed.</p>
            <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>

      {/* View Report Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
             <DialogTitle className="flex items-center">
                Report Details: {selectedItem?.itemTitle || selectedItem?.itemId}
            </DialogTitle>
            <DialogDescription>Detailed information for report ID: {selectedItem?.id}.</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              {selectedItem.contentType === 'NFT' && selectedItem.itemThumbnailUrl && (
                <div className="flex justify-center mb-3">
                    <Image src={selectedItem.itemThumbnailUrl.replace('40x40', '100x100')} alt={selectedItem.itemTitle || 'NFT Image'} width={100} height={100} className="rounded-md border object-cover" data-ai-hint="nft image preview"/>
                </div>
              )}
              <p><strong>Content Type:</strong> <Badge variant="outline">{selectedItem.contentType}</Badge></p>
              <p><strong>Item ID:</strong> {selectedItem.itemId}</p>
              {selectedItem.itemTitle && <p><strong>Item Title:</strong> {selectedItem.itemTitle}</p>}
              <p><strong>Reported By:</strong> {selectedItem.reportedBy}</p>
              <p><strong>Reason:</strong> {selectedItem.reason}</p>
              <p><strong>Details:</strong> {selectedItem.reportDetails || 'No additional details provided.'}</p>
              <p><strong>Date Reported:</strong> {formatDistanceToNow(selectedItem.dateReported, { addSuffix: true })} ({selectedItem.dateReported.toLocaleString()})</p>
              <p><strong>Current Status:</strong> <Badge variant={statusVariantMap[selectedItem.status]}>{selectedItem.status}</Badge></p>
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
