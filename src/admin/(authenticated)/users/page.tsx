
'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, MoreHorizontal, Search, Filter, PlusCircle, Edit, Eye, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

type UserStatus = 'Active' | 'Suspended' | 'Pending';

interface MockUser {
  id: string;
  avatarUrl: string;
  username: string;
  email: string;
  joinDate: string; // YYYY-MM-DD
  status: UserStatus;
  bio?: string;
  walletAddress?: string;
  nftCount?: number;
}

const ITEMS_PER_PAGE = 20;

// --- Mock Data Generation ---
const firstNames = ["Alex", "Jamie", "Casey", "Morgan", "Riley", "Taylor", "Jordan", "Cameron", "Drew", "Skyler", "Kai", "Devin", "Rowan", "Avery", "Quinn", "Charlie", "Emerson", "Hayden", "River", "Sage", "Phoenix", "Dakota", "Reese", "Alexis", "Sawyer"];
const lastNames = ["Smith", "Jones", "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall"];
const userStatuses: UserStatus[] = ['Active', 'Suspended', 'Pending'];
const domains = ["example.com", "email.net", "webmail.org", "test.io", "artmail.dev", "nftspace.io"];
const bios = [
  "Collector of fine digital arts.", "Creating pixel masterpieces.", "Loves all things NFT.", "New to the space!", "Exploring virtual worlds.",
  "Blockchain enthusiast and art aficionado.", "Digital native exploring new horizons.", "Tech meets art.", "Curating the future of digital ownership.",
  "Always on the lookout for the next big thing.", "Aspiring generative artist and collector.", "Passionate about NFTs and the metaverse.",
  "Here to support artists and innovate.", "Believer in the power of NFTs.", "Just here for the art. And the tech."
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(startYear = 2022, endYear = 2024): string {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // Keep it simple for days
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function generateMockUsers(count: number): MockUser[] {
  const users: MockUser[] = [];
  const usedUsernames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let username = "";
    let attempts = 0;
    do {
      const firstName = getRandomElement(firstNames);
      const lastName = getRandomElement(lastNames);
      const randomNumber = Math.floor(Math.random() * 900) + 100; // 100-999
      username = `${firstName}${lastName.substring(0, Math.max(1, Math.floor(Math.random() * (lastName.length / 2))))}${randomNumber}`;
      attempts++;
    } while (usedUsernames.has(username) && attempts < 20); 
    usedUsernames.add(username);


    const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@${getRandomElement(domains)}`;
    const user: MockUser = {
      id: `usr_gen_${String(i + 1).padStart(3, '0')}_${Math.random().toString(36).substring(2, 7)}`,
      avatarUrl: `https://placehold.co/40x40.png`,
      username: username,
      email: email,
      joinDate: getRandomDate(),
      status: getRandomElement(userStatuses),
      bio: Math.random() > 0.3 ? getRandomElement(bios) : undefined,
      walletAddress: Math.random() > 0.5 ? `0x${[...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...${[...Array(4)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}` : 'N/A',
      nftCount: Math.random() > 0.2 ? Math.floor(Math.random() * 100) : 0,
    };
    users.push(user);
  }
  return users;
}
// --- End Mock Data Generation ---


const statusIconMap: Record<UserStatus, React.ElementType> = {
    'Active': ShieldCheck,
    'Suspended': ShieldAlert,
    'Pending': Users,
};
const statusVariantMap: Record<UserStatus, "default" | "secondary" | "destructive"> = {
  'Active': 'default',
  'Suspended': 'destructive',
  'Pending': 'secondary',
};


export default function AdminUsersPage() {
  const { toast } = useToast();
  const [allMockUsers, setAllMockUsers] = useState<MockUser[]>([]);
  
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false); 
  const [currentUserForEdit, setCurrentUserForEdit] = useState<Partial<MockUser>>({});
  const [newUserForm, setNewUserForm] = useState({username: '', email: '', status: 'Pending' as UserStatus});

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    // Generate users only once on mount
    setAllMockUsers(generateMockUsers(100));
  }, []);

  // Reset displayCount when filters change
  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [searchTerm, statusFilter]);

  const processedAllUsers = useMemo(() => {
    return allMockUsers.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allMockUsers, searchTerm, statusFilter]);

  const usersToDisplay = useMemo(() => {
    return processedAllUsers.slice(0, displayCount);
  }, [processedAllUsers, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => Math.min(prevCount + ITEMS_PER_PAGE, processedAllUsers.length));
  };

  const handleToggleSuspension = (userId: string) => {
    setAllMockUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
          toast({
            title: `User ${newStatus === 'Active' ? 'Activated' : 'Suspended'}`,
            description: `${user.username}'s status changed to ${newStatus}. (Simulated)`,
          });
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };
  
  const openViewDialog = (user: MockUser) => {
    setSelectedUser(user);
    setIsViewUserDialogOpen(true);
  };
  const openEditDialog = (user: MockUser) => {
    setCurrentUserForEdit({...user}); 
    setIsEditUserDialogOpen(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 

    setAllMockUsers(prev => prev.map(u => u.id === currentUserForEdit.id ? {...u, ...currentUserForEdit} as MockUser : u));
    toast({ title: "Changes Saved (Simulated)", description: `User "${currentUserForEdit.username}" details updated.` });
    
    setIsProcessing(false);
    setIsEditUserDialogOpen(false);
    setCurrentUserForEdit({});
  };
  
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newUserForm.username || !newUserForm.email) {
        toast({variant: "destructive", title: "Missing Fields", description: "Username and Email are required."});
        return;
    }
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 700)); 
    
    const newCompleteUser: MockUser = {
      id: `usr_new_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      avatarUrl: 'https://placehold.co/40x40.png',
      username: newUserForm.username,
      email: newUserForm.email,
      joinDate: new Date().toISOString().split('T')[0],
      status: newUserForm.status,
      bio: "Newly added user via admin panel.",
      nftCount: 0
    };
    setAllMockUsers(prev => [newCompleteUser, ...prev]); // Add to the beginning to see it easily
    toast({title: "User Added (Simulated)", description: `User "${newUserForm.username}" created successfully.`});

    setIsProcessing(false);
    setIsAddUserDialogOpen(false);
    setNewUserForm({username: '', email: '', status: 'Pending' as UserStatus});
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <Users className="mr-3 h-7 w-7" /> User Management
            </h1>
            <p className="text-muted-foreground">Manage platform users, view details, and perform actions.</p>
        </div>
        <Button size="sm" onClick={() => setIsAddUserDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg">All Users</CardTitle>
           <CardDescription>Search, filter, and manage registered users. Currently showing {usersToDisplay.length} of {processedAllUsers.length} matching users (Total: {allMockUsers.length}).</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3 sm:space-y-0 sm:flex sm:gap-3 items-center border-b">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by username or email..." 
                className="pl-8 w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] hidden sm:table-cell"></TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersToDisplay.length > 0 ? usersToDisplay.map((user) => {
                  const StatusIcon = statusIconMap[user.status];
                  return (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image src={user.avatarUrl} alt={user.username} width={32} height={32} className="rounded-full object-cover" data-ai-hint="user avatar" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{user.email}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[user.status]} className="text-xs">
                        <StatusIcon className="h-3 w-3 mr-1.5" />
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openViewDialog(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleSuspension(user.id)} className={user.status === 'Suspended' ? 'text-green-600 focus:text-green-700' : 'text-destructive focus:text-destructive'}>
                            {user.status === 'Suspended' ? <ShieldCheck className="mr-2 h-4 w-4" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
                            {user.status === 'Suspended' ? 'Activate' : 'Suspend'} User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )}) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <CardFooter className="p-4 border-t flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
            <p>Showing {usersToDisplay.length} of {processedAllUsers.length} user(s).</p>
            {usersToDisplay.length < processedAllUsers.length && (
                <Button variant="outline" size="sm" onClick={handleLoadMore}>
                    Load More ({processedAllUsers.length - usersToDisplay.length} remaining)
                </Button>
            )}
          </CardFooter>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Image src={selectedUser?.avatarUrl || 'https://placehold.co/32x32.png'} alt={selectedUser?.username || 'User Avatar'} width={32} height={32} className="rounded-full mr-2 object-cover" data-ai-hint="user avatar"/>
              {selectedUser?.username}
            </DialogTitle>
            <DialogDescription>Detailed information for {selectedUser?.username}.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-3 py-4 text-sm max-h-[60vh] overflow-y-auto pr-2">
              <p><strong>User ID:</strong> {selectedUser.id}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Join Date:</strong> {selectedUser.joinDate}</p>
              <p><strong>Status:</strong> <Badge variant={statusVariantMap[selectedUser.status]}>{selectedUser.status}</Badge></p>
              <p><strong>Bio:</strong> {selectedUser.bio || 'N/A'}</p>
              <p><strong>Simulated Wallet:</strong> {selectedUser.walletAddress || 'N/A'}</p>
              <p><strong>Simulated NFTs Owned:</strong> {selectedUser.nftCount?.toString() || '0'}</p>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
       <Dialog open={isEditUserDialogOpen} onOpenChange={(isOpen) => { setIsEditUserDialogOpen(isOpen); if (!isOpen) setCurrentUserForEdit({}); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User: {currentUserForEdit?.username}</DialogTitle>
            <DialogDescription>Modify user details. (Simulated).</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUserSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input id="edit-username" value={currentUserForEdit?.username || ''} onChange={(e) => setCurrentUserForEdit(prev => ({...prev, username: e.target.value}))} disabled={isProcessing}/>
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={currentUserForEdit?.email || ''} onChange={(e) => setCurrentUserForEdit(prev => ({...prev, email: e.target.value}))} disabled={isProcessing}/>
            </div>
             <div>
              <Label htmlFor="edit-bio">Bio</Label>
              <Input id="edit-bio" value={currentUserForEdit?.bio || ''} onChange={(e) => setCurrentUserForEdit(prev => ({...prev, bio: e.target.value}))} disabled={isProcessing}/>
            </div>
            <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={currentUserForEdit?.status || ''} onValueChange={(value) => setCurrentUserForEdit(prev => ({...prev, status: value as UserStatus}))} disabled={isProcessing}>
                    <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild><Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button></DialogClose>
            <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

       {/* Add New User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={(isOpen) => { setIsAddUserDialogOpen(isOpen); if (!isOpen) setNewUserForm({username: '', email: '', status: 'Pending' as UserStatus}); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account. (Simulated)</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddUserSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="new-username">Username*</Label>
              <Input id="new-username" value={newUserForm.username} onChange={(e) => setNewUserForm(prev => ({...prev, username: e.target.value}))} required disabled={isProcessing}/>
            </div>
            <div>
              <Label htmlFor="new-email">Email*</Label>
              <Input id="new-email" type="email" value={newUserForm.email} onChange={(e) => setNewUserForm(prev => ({...prev, email: e.target.value}))} required disabled={isProcessing}/>
            </div>
            <div>
                <Label htmlFor="new-status">Initial Status</Label>
                <Select value={newUserForm.status} onValueChange={(value) => setNewUserForm(prev => ({...prev, status: value as UserStatus}))} disabled={isProcessing}>
                    <SelectTrigger id="new-status">
                        <SelectValue placeholder="Select initial status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild><Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button></DialogClose>
            <Button type="submit" disabled={isProcessing}>
                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
            </Button>
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}

