
'use client';

import { Navbar } from '@/components/common/navbar';
import { StatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Users, Package, Library, AlertTriangle, Settings, FileText, UserCog, ArrowLeft, LineChart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/auth-provider';
import { apiService, ApiError } from '@/lib/apiService';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PlatformStats {
  totalUsers: number;
  totalNfts: number;
  totalCollections: number;
  activeReports: number;
}

export default function AdminDashboardPage() {
  const { token, isAdmin, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return; 

    if (!isAuthenticated || !isAdmin) {
      router.replace('/signin'); 
      return;
    }

    const fetchStats = async () => {
      if (!token) {
        setStatsError('Authentication token not found. Please log in as admin.');
        setIsLoadingStats(false);
        setStats(null);
        return;
      }

      setIsLoadingStats(true);
      setStatsError(null);
      try {
        const result = await apiService.get<{ data: PlatformStats; message?: string }>('/admin/stats/overview', token);
        setStats(result.data);
      } catch (error: any) {
        const errorMessage = error instanceof ApiError ? error.data?.message || error.message : 'Could not load platform statistics.';
        setStatsError(errorMessage);
        console.error("Stats fetch error:", error);
        setStats(null);
      } finally {
        setIsLoadingStats(false);
      }
    };
    fetchStats();
  }, [token, isAdmin, isAuthLoading, isAuthenticated, router]);
  
  if (isAuthLoading || (!isAuthenticated && !isAuthLoading) || (!isAdmin && !isAuthLoading) ) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const statCardsData = [
    { title: 'Total Users', value: stats?.totalUsers, icon: <Users className="h-6 w-6 text-primary" />, description: 'Registered platform users', loading: isLoadingStats },
    { title: 'Total NFTs', value: stats?.totalNfts, icon: <Package className="h-6 w-6 text-primary" />, description: 'NFTs minted on platform', loading: isLoadingStats },
    { title: 'Total Collections', value: stats?.totalCollections, icon: <Library className="h-6 w-6 text-primary" />, description: 'Collections created', loading: isLoadingStats },
    { title: 'Active Reports', value: stats?.activeReports, icon: <AlertTriangle className="h-6 w-6 text-destructive" />, description: 'Pending review', loading: isLoadingStats },
  ];

  const recentActivities: { id: string; type: string; details: string; timestamp: string }[] = [
    { id: '1', type: 'New User Signup', details: 'user@example.com', timestamp: '2024-07-28 10:00 AM' },
    { id: '2', type: 'NFT Minted', details: 'CryptoPunk #1234 by ArtVandelay', timestamp: '2024-07-28 09:30 AM' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">
              Admin Dashboard
            </h1>
            <Button variant="outline" asChild className="self-start sm:self-center">
                <Link href="/home">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Marketplace
                </Link>
            </Button>
          </div>

          <section className="mb-8">
            {statsError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {statsError}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
              {statCardsData.map((stat) => (
                stat.loading ? (
                  <Card key={stat.title} className="shadow-lg rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-2/3" /> 
                      <Skeleton className="h-6 w-6 rounded-sm" /> 
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-7 w-1/3 mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ) : (
                  <StatCard
                    key={stat.title}
                    title={stat.title}
                    value={stat.value?.toLocaleString() ?? 'N/A'}
                    icon={stat.icon}
                    description={stat.description}
                  />
                )
              ))}
            </div>
          </section>

          <section className="mb-8">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Management Sections</CardTitle>
                <CardDescription>Oversee various aspects of the platform.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                  <Link href="/admin/manage-users">
                    <UserCog className="mr-3 h-5 w-5" /> Manage Users
                  </Link>
                </Button>
                 <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                  <Link href="/admin/manage-nfts">
                    <Package className="mr-3 h-5 w-5" /> Manage NFTs
                  </Link>
                </Button>
                 <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                  <Link href="/admin/manage-collections">
                    <Library className="mr-3 h-5 w-5" /> Manage Collections
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                  <Link href="/admin/view-reports">
                    <FileText className="mr-3 h-5 w-5" /> View Reports
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                   <Link href="/admin/platform-settings">
                    <Settings className="mr-3 h-5 w-5" /> Platform Settings
                   </Link>
                </Button>
                 <Button variant="outline" className="w-full justify-start text-left py-6" asChild>
                   <Link href="/stats"> 
                    <LineChart className="mr-3 h-5 w-5" /> View Public Stats
                   </Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Recent Admin Activity (Placeholder)</CardTitle>
                <CardDescription>Overview of the latest administrative actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of recent admin activities.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] hidden sm:table-cell">ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell className="font-medium hidden sm:table-cell">{activity.id}</TableCell>
                          <TableCell>{activity.type}</TableCell>
                          <TableCell>{activity.details}</TableCell>
                          <TableCell className="text-right">{activity.timestamp}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8 h-40">
                                No recent admin activity to display.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </>
  );
}
