
'use client';

import { Navbar } from '@/components/common/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, Users, Search, Edit, ShieldAlert, ShieldCheck, MoreHorizontal, UserCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { apiService, ApiError } from '@/lib/apiService';
import type { User, UserRole, PaginatedResponse } from '@/types/entities';
import { EditUserModal } from '@/components/admin/edit-user-modal'; 
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaginationControls } from '@/components/common/pagination-controls';


const ITEMS_PER_PAGE = 10;

export default function ManageUsersPage() {
  const { toast } = useToast();
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Note: Backend search/filter for admin/users is not yet implemented.
  // These filters are client-side for now.
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended'>('all');

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchUsers = useCallback(async (pageToFetch: number) => {
    if (!token) return;
    setIsLoadingPage(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(pageToFetch),
        limit: String(ITEMS_PER_PAGE),
        // Add search/filter params here if backend supports them
      });
      const response = await apiService.get<PaginatedResponse<User>>(`/admin/users?${params.toString()}`, token);
      setUsers(response.data || []);
      setCurrentPage(response.meta?.page || 1);
      setTotalPages(Math.ceil((response.meta?.total || 0) / ITEMS_PER_PAGE));
    } catch (err: any) {
      const errorMessage = err instanceof ApiError ? err.data?.message || err.message : 'Could not load users.';
      setError(errorMessage);
      setUsers([]);
    } finally {
      setIsLoadingPage(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin');
      return;
    }
    fetchUsers(currentPage);
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router, fetchUsers, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const handleUserUpdated = () => {
    fetchUsers(currentPage); 
  };

  const handleSuspendUser = async (userToSuspend: User, suspend: boolean) => {
     if (!token) {
      toast({ title: "Error", description: "Authentication required.", variant: "destructive" });
      return;
    }
    try {
      await apiService.put(`/admin/users/${userToSuspend.id}`, { isSuspended: suspend }, token);
      toast({ title: `User ${suspend ? 'Suspended' : 'Unsuspended'}`, description: `${userToSuspend.username} has been ${suspend ? 'suspended' : 'unsuspended'}.` });
      fetchUsers(currentPage);
    } catch (error: any) {
       const errorMessage = error instanceof ApiError ? error.data?.message || error.message : `Failed to ${suspend ? 'suspend' : 'unsuspend'} user.`;
       toast({ title: "Action Failed", description: errorMessage, variant: "destructive" });
    }
  };

  const filteredUsers = useMemo(() => {
    // Client-side filtering - ideally this would be on the backend
    return users.filter(user => {
      const searchMatch = searchTerm === '' ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
      
      const roleMatch = filterRole === 'all' || user.roles.includes(filterRole);
      
      const statusMatch = filterStatus === 'all' ||
        (filterStatus === 'active' && !user.isSuspended) ||
        (filterStatus === 'suspended' && !!user.isSuspended);
        
      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, searchTerm, filterRole, filterStatus]);


  if (isAuthLoading || (!isAuthenticated && !isAuthLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Dashboard
              </Link>
            </Button>
          </div>

          <Card className="shadow-xl rounded-xl">
            <CardHeader className="items-center text-center sm:text-left sm:items-start border-b pb-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2 sm:mb-0" strokeWidth={1.5} />
                <div>
                  <CardTitle className="text-2xl sm:text-3xl font-headline text-primary tracking-tight">
                    Manage Users
                  </CardTitle>
                  <CardDescription className="mt-1 text-base">
                    Oversee and administer platform user accounts.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="relative sm:col-span-2 md:col-span-1">
                  <Input
                    type="search"
                    placeholder="Search by username, email, wallet..."
                    className="w-full pl-10 pr-4 h-10 text-base focus:bg-background"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
                <Select value={filterRole} onValueChange={(value) => setFilterRole(value as UserRole | 'all')}>
                  <SelectTrigger className="h-10 text-base">
                    <SelectValue placeholder="Filter by Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {Object.values(UserRole).map(role => (
                      <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'suspended')}>
                  <SelectTrigger className="h-10 text-base">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{isLoadingPage && users.length === 0 ? "Loading users..." : !isLoadingPage && users.length === 0 ? "No users found." : (isLoadingPage && filteredUsers.length === 0 ? "Loading filtered users..." : !isLoadingPage && filteredUsers.length === 0 ? "No users match current filters. Try adjusting your search." : "A list of platform users.")}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px] hidden md:table-cell">User ID</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Wallet Address</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingPage && users.length === 0 ? (
                        Array.from({length: 5}).map((_, i) => (
                            <TableRow key={`skel-user-${i}`}>
                                <TableCell className="font-medium hidden md:table-cell"><div className="h-4 bg-muted rounded w-24 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded w-32 animate-pulse"></div></TableCell>
                                <TableCell className="hidden sm:table-cell"><div className="h-4 bg-muted rounded w-40 animate-pulse"></div></TableCell>
                                <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded w-20 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-4 bg-muted rounded w-16 animate-pulse"></div></TableCell>
                                <TableCell><div className="h-6 bg-muted rounded-full w-20 animate-pulse"></div></TableCell>
                                <TableCell className="text-right"><div className="h-8 bg-muted rounded w-8 animate-pulse"></div></TableCell>
                            </TableRow>
                        ))
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium truncate max-w-[100px] hidden md:table-cell">{user.id}</TableCell>
                          <TableCell className="font-semibold text-primary truncate max-w-[150px]">
                            <Link href={`/profile/${user.id}`} className="hover:underline">{user.username}</Link>
                          </TableCell>
                          <TableCell className="truncate max-w-[180px] hidden sm:table-cell">{user.email}</TableCell>
                          <TableCell className="truncate max-w-[120px] hidden lg:table-cell">{user.walletAddress.substring(0,6)}...{user.walletAddress.slice(-4)}</TableCell>
                          <TableCell className="space-x-1">
                            {user.roles.map(role => <Badge key={role} variant={role === UserRole.ADMIN ? 'default' : 'secondary'}>{role.toUpperCase()}</Badge>)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.isSuspended ? 'destructive' : 'outline'} className={!user.isSuspended ? "border-green-500 text-green-600" : ""}>
                              {user.isSuspended ? 'Suspended' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">User Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit User
                                </DropdownMenuItem>
                                {user.isSuspended ? (
                                    <DropdownMenuItem onClick={() => handleSuspendUser(user, false)}>
                                        <ShieldCheck className="mr-2 h-4 w-4 text-green-500" /> Unsuspend
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem onClick={() => handleSuspendUser(user, true)}>
                                        <ShieldAlert className="mr-2 h-4 w-4 text-orange-500" /> Suspend
                                    </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8 h-40">
                                No users found matching your criteria. Try adjusting your search or filters.
                            </TableCell>
                        </TableRow>
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
      {selectedUser && (
        <EditUserModal
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          userToEdit={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <Toaster />
    </>
  );
}
