
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Palette, BarChartBig, PackageSearch, Activity, UserPlus, DollarSign, ShieldAlert, TrendingUpIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data - in a real app, this would come from an API
const mockStats = {
  totalUsers: 1250,
  totalNfts: 789,
  totalSalesEth: 450.75,
  activeListings: 320,
  pendingModeration: 12,
};

const mockRecentActivities = [
  { id: 'act1', icon: UserPlus, text: "New user 'CryptoCollector' signed up.", time: "5m ago", color: "text-green-500" },
  { id: 'act2', icon: DollarSign, text: "NFT 'Cosmic Dream #12' sold for 2.5 ETH.", time: "15m ago", color: "text-primary" },
  { id: 'act3', icon: Palette, text: "New NFT 'Abstract Dimensions' minted by @ArtCreator.", time: "1h ago", color: "text-accent" },
  { id: 'act4', icon: ShieldAlert, text: "Content report received for NFT ID #456.", time: "2h ago", color: "text-destructive" },
  { id: 'act5', icon: Users, text: "User 'NFTFanatic' updated their profile.", time: "3h ago", color: "text-muted-foreground" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of ArtNFT marketplace activity.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% (simulated)</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total NFTs</CardTitle>
            <Palette className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalNfts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+150 this week (simulated)</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales (ETH)</CardTitle>
            <DollarSign className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalSalesEth.toFixed(2)} ETH</div>
            <p className="text-xs text-muted-foreground">+12.5% (simulated)</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <PackageSearch className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeListings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Managed by platform</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-destructive/10 border-destructive">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Pending Moderation</CardTitle>
            <ShieldAlert className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{mockStats.pendingModeration.toLocaleString()}</div>
            <p className="text-xs text-destructive/80">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5 text-primary"/>Recent Platform Activity</CardTitle>
            <CardDescription>A quick look at recent events on the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            {mockRecentActivities.length > 0 ? (
              <ul className="space-y-3">
                {mockRecentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                    <activity.icon className={`h-5 w-5 mt-0.5 shrink-0 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.text}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
               <p className="text-muted-foreground text-sm">No recent activity to display.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center"><TrendingUpIcon className="mr-2 h-5 w-5 text-primary"/>Platform Analytics</CardTitle>
            <CardDescription>Visual insights into platform performance and trends.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
            <BarChartBig className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-medium">Charts & Graphs Coming Soon</p>
            <p className="text-sm text-muted-foreground">Detailed analytics will be displayed here.</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="#">Learn More (Placeholder)</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
