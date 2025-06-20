
'use client';

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CollectionCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg rounded-xl flex flex-col h-full bg-card border-transparent border">
      <CardHeader className="p-0 relative aspect-[16/9] sm:aspect-video">
         <Skeleton className="w-full h-full rounded-t-xl" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center space-x-2 mb-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
