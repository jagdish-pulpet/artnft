'use client';

import type { ContentItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { MoreHorizontal, Edit3, Trash2, Eye } from 'lucide-react';
import { deleteContentItemAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import React from 'react';

interface AdminContentTableProps {
  items: ContentItem[];
}

export function AdminContentTable({ items }: AdminContentTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async (id: string, title: string) => {
    setIsDeleting(true);
    try {
      await deleteContentItemAction(id);
      toast({
        title: "Content Deleted",
        description: `Content "${title}" has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error Deleting Content",
        description: (error as Error).message || "Could not delete the content item.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (items.length === 0) {
    return <p className="text-center text-muted-foreground mt-10">No content items to manage.</p>;
  }

  return (
    <div className="rounded-md border shadow-sm animate-subtle-appear">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/content/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" /> View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/edit/${item.id}`} className="flex items-center gap-2 cursor-pointer">
                          <Edit3 className="h-4 w-4" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer" disabled={isDeleting}>
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the content titled "{item.title}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDelete(item.id, item.title)} 
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
