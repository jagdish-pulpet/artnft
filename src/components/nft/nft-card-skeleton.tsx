
'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function NftCardSkeleton() {
  return (
    <Card className="overflow-hidden shadow-lg rounded-xl flex flex-col h-full bg-card border-transparent border">
      <Skeleton className="aspect-square w-full rounded-t-xl" />
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-4 w-3/4 mb-1" /> {/* For collection name or title part 1 */}
        <Skeleton className="h-5 w-1/2 mb-2" /> {/* For title part 2 or creator */}
        <Skeleton className="h-4 w-1/3" /> {/* For creator or other small text */}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex justify-between items-center w-full">
          <div className="w-1/2">
            <Skeleton className="h-3 w-1/3 mb-1" /> {/* For "Price" label */}
            <Skeleton className="h-5 w-2/3" /> {/* For price value */}
          </div>
          <Skeleton className="h-9 w-20" /> {/* For Buy button */}
        </div>
      </CardFooter>
    </Card>
  );
}
