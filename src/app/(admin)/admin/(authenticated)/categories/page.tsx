
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Package, MoreHorizontal, Search, PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  nftCount: number; // Simulated
  icon?: string; // Placeholder for icon name or URL
}

const initialMockCategories: MockCategory[] = [
  { id: 'cat_001', name: 'Digital Art', slug: 'digital-art', description: 'Creations made with digital technologies.', nftCount: 152, icon: 'Palette' },
  { id: 'cat_002', name: 'Photography', slug: 'photography', description: 'Art captured through the lens.', nftCount: 88, icon: 'Camera' },
  { id: 'cat_003', name: 'Music', slug: 'music', description: 'Audio NFTs and music-related collectibles.', nftCount: 45, icon: 'Music2' },
  { id: 'cat_004', name: 'Collectibles', slug: 'collectibles', description: 'Unique digital items and memorabilia.', nftCount: 230, icon: 'ToyBrick' },
];

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<MockCategory[]>(initialMockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<MockCategory> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<MockCategory | null>(null);


  const handleAddNew = () => {
    setCurrentCategory({ name: '', slug: '', description: '', nftCount: 0 });
    setIsFormDialogOpen(true);
  };

  const handleEdit = (category: MockCategory) => {
    setCurrentCategory(category);
    setIsFormDialogOpen(true);
  };
  
  const handleDeleteConfirmation = (category: MockCategory) => {
    setCategoryToDelete(category);
    setIsConfirmDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!categoryToDelete) return;
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));
    toast({
      title: 'Category Deleted (Simulated)',
      description: `Category "${categoryToDelete.name}" has been removed.`,
    });
    setIsProcessing(false);
    setIsConfirmDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentCategory || !currentCategory.name || !currentCategory.slug) {
        toast({ variant: "destructive", title: "Validation Error", description: "Name and Slug are required."});
        return;
    }
    setIsProcessing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentCategory.id) { // Editing
      setCategories(prev => prev.map(cat => cat.id === currentCategory!.id ? currentCategory as MockCategory : cat));
      toast({ title: 'Category Updated (Simulated)', description: `Category "${currentCategory.name}" updated.` });
    } else { // Adding new
      const newCategory: MockCategory = {
        ...currentCategory,
        id: `cat_${Date.now()}`,
        nftCount: currentCategory.nftCount || 0,
      } as MockCategory;
      setCategories(prev => [newCategory, ...prev]);
      toast({ title: 'Category Added (Simulated)', description: `Category "${newCategory.name}" created.` });
    }
    setIsProcessing(false);
    setIsFormDialogOpen(false);
    setCurrentCategory(null);
  };


  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <Package className="mr-3 h-7 w-7" /> Categories Management
            </h1>
            <p className="text-muted-foreground">Organize and manage NFT categories on the platform.</p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg">All Categories</CardTitle>
          <CardDescription>Browse and manage all available categories.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or slug..." 
                className="pl-8 w-full sm:w-auto" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Slug</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">NFT Count</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground sm:hidden">{category.slug}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{category.slug}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-xs">{category.description}</TableCell>
                    <TableCell className="text-right">{category.nftCount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(category)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteConfirmation(category)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <CardFooter className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <p>{filteredCategories.length} of {categories.length} categor(y/ies) displayed.</p>
            {/* Placeholder Pagination */}
            <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={(isOpen) => { setIsFormDialogOpen(isOpen); if (!isOpen) setCurrentCategory(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{currentCategory?.id ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {currentCategory?.id ? `Modify details for "${currentCategory.name}".` : 'Create a new category for NFTs.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div>
              <Label htmlFor="category-name">Name*</Label>
              <Input 
                id="category-name" 
                value={currentCategory?.name || ''} 
                onChange={(e) => setCurrentCategory(prev => ({...prev, name: e.target.value}))}
                placeholder="e.g., Digital Art"
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="category-slug">Slug*</Label>
              <Input 
                id="category-slug" 
                value={currentCategory?.slug || ''} 
                onChange={(e) => setCurrentCategory(prev => ({...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))}
                placeholder="e.g., digital-art"
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea 
                id="category-description" 
                value={currentCategory?.description || ''} 
                onChange={(e) => setCurrentCategory(prev => ({...prev, description: e.target.value}))}
                placeholder="A brief description of the category."
                disabled={isProcessing}
              />
            </div>
            <div>
              <Label htmlFor="category-icon">Icon (Placeholder)</Label>
              <Input 
                id="category-icon" 
                value={currentCategory?.icon || ''} 
                onChange={(e) => setCurrentCategory(prev => ({...prev, icon: e.target.value}))}
                placeholder="e.g., Palette (Lucide icon name)"
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground mt-1">For simulation, enter a Lucide icon name.</p>
            </div>
            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={isProcessing}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentCategory?.id ? 'Save Changes' : 'Create Category'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone (simulation).
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
                <DialogClose asChild><Button variant="outline" disabled={isProcessing}>Cancel</Button></DialogClose>
                <Button variant="destructive" onClick={handleDelete} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
