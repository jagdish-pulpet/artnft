
'use client';

import { Navbar } from '@/components/common/navbar';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BarChart3, Shapes, Library, TrendingUp, Users, ShoppingBag, Crown, Activity, Loader2, AlertCircle, Landmark, LineChartIcon, Gem, UsersRound } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { StatCard } from '@/components/admin/stat-card';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { apiService, ApiError } from '@/lib/apiService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { TradingVolumeDataPoint, TopCollectionStat, LeaderboardItem, TopNftStat, LeaderboardType, LeaderboardPeriod } from '@/types/stats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, subDays } from 'date-fns';

interface PlatformStatsData {
  totalUsers: number;
  totalNfts: number;
  totalCollections: number;
  totalSales?: number;
  totalVolume?: number;
  totalVolume24h?: number;
}

const periodOptions: {value: LeaderboardPeriod, label: string}[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' },
];


export default function StatsPage() {
  const [overviewStats, setOverviewStats] = useState<PlatformStatsData | null>(null);
  const [isLoadingOverview, setIsLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const [tradingVolumeData, setTradingVolumeData] = useState<TradingVolumeDataPoint[]>([]);
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(true);
  const [tradingVolumeError, setTradingVolumeError] = useState<string | null>(null);
  const [tradingVolumePeriod, setTradingVolumePeriod] = useState<string>('30d');

  const [topCollections, setTopCollections] = useState<TopCollectionStat[]>([]);
  const [isLoadingTopCollections, setIsLoadingTopCollections] = useState(true);
  const [topCollectionsError, setTopCollectionsError] = useState<string | null>(null);
  const [topCollectionsPeriod, setTopCollectionsPeriod] = useState<string>('all');
  
  const [topNftsData, setTopNftsData] = useState<TopNftStat[]>([]);
  const [isLoadingTopNfts, setIsLoadingTopNfts] = useState(true);
  const [topNftsError, setTopNftsError] = useState<string | null>(null);
  const [topNftsPeriod, setTopNftsPeriod] = useState<LeaderboardPeriod>('7d');

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('collectors');
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('30d');


  useEffect(() => {
    const fetchOverviewStats = async () => {
      setIsLoadingOverview(true);
      setOverviewError(null);
      try {
        const response = await apiService.get<{data: PlatformStatsData}>('/stats/overview'); 
        setOverviewStats(response.data);
      } catch (err: any) {
        setOverviewError(err instanceof ApiError ? err.data?.message || err.message : 'Could not load overview statistics.');
        setOverviewStats(null);
      } finally {
        setIsLoadingOverview(false);
      }
    };
    fetchOverviewStats();
  }, []);

  useEffect(() => {
    const fetchTradingVolume = async () => {
      setIsLoadingTradingVolume(true);
      setTradingVolumeError(null);
      try {
        const periodMap: Record<string, number> = {'7d': 7, '30d': 30, '90d': 90};
        const days = periodMap[tradingVolumePeriod] || 30;
        const response = await apiService.get<{data: TradingVolumeDataPoint[]}>(`/stats/trading-volume?periodDays=${days}`);
        setTradingVolumeData(response.data);
      } catch (err:any) {
        setTradingVolumeError(err instanceof ApiError ? err.data?.message || err.message : 'Could not load trading volume.');
        setTradingVolumeData([]);
      } finally {
        setIsLoadingTradingVolume(false);
      }
    };
    fetchTradingVolume();
  }, [tradingVolumePeriod]);

  useEffect(() => {
    const fetchTopCollections = async () => {
      setIsLoadingTopCollections(true);
      setTopCollectionsError(null);
      try {
        const periodDays = topCollectionsPeriod === 'all' ? undefined : parseInt(topCollectionsPeriod.replace('d',''));
        const params = new URLSearchParams({ limit: '5', sortBy: 'volume' });
        if (periodDays) params.append('periodDays', String(periodDays));
        
        const response = await apiService.get<{data: TopCollectionStat[]}>(`/stats/top-collections?${params.toString()}`);
        setTopCollections(response.data);
      } catch (err:any) {
        setTopCollectionsError(err instanceof ApiError ? err.data?.message || err.message : 'Could not load top collections.');
        setTopCollections([]);
      } finally {
        setIsLoadingTopCollections(false);
      }
    };
    fetchTopCollections();
  }, [topCollectionsPeriod]);

  const fetchTopNfts = useCallback(async () => {
    setIsLoadingTopNfts(true);
    setTopNftsError(null);
    try {
        const periodValue = topNftsPeriod === 'all' ? undefined : parseInt(topNftsPeriod.replace('d', ''));
        const params = new URLSearchParams({ limit: '5', sortBy: 'volume' });
        if (periodValue) params.append('periodDays', String(periodValue));
        
        const response = await apiService.get<{data: TopNftStat[]}>(`/stats/top-nfts?${params.toString()}`);
        setTopNftsData(response.data || []);
    } catch (err: any) {
        setTopNftsError(err instanceof ApiError ? err.data?.message || err.message : 'Could not load top NFTs.');
        setTopNftsData([]);
    } finally {
        setIsLoadingTopNfts(false);
    }
  }, [topNftsPeriod]);

  useEffect(() => {
      fetchTopNfts();
  }, [fetchTopNfts]);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true);
    setLeaderboardError(null);
    try {
        const periodValue = leaderboardPeriod === 'all' ? undefined : parseInt(leaderboardPeriod.replace('d', ''));
        // Backend uses 'volume' or 'count'. For collectors, 'volume' = totalSpent, 'count' = itemsBought.
        // For creators, 'volume' = totalSalesVolume, 'count' = itemsSold.
        const sortBy = 'volume'; // Default to volume for now, can add selector later
        const params = new URLSearchParams({ limit: '5', sortBy });
        if (periodValue) params.append('periodDays', String(periodValue));

        const response = await apiService.get<{data: LeaderboardItem[]}>(`/stats/leaderboard/${leaderboardType}?${params.toString()}`);
        setLeaderboardData(response.data || []);
    } catch (err: any) {
        setLeaderboardError(err instanceof ApiError ? err.data?.message || err.message : `Could not load ${leaderboardType} leaderboard.`);
        setLeaderboardData([]);
    } finally {
        setIsLoadingLeaderboard(false);
    }
  }, [leaderboardType, leaderboardPeriod]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const formatVolume = (volume?: number) => {
    if (volume === undefined || volume === null) return 'N/A';
    return `${volume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH`;
  };
  
  const formattedTradingVolumeData = useMemo(() => {
    return tradingVolumeData.map(item => ({
        ...item,
        date: format(new Date(item.date), 'MMM d'), 
        volume: Number(item.volume) 
    }));
  }, [tradingVolumeData]);


  const displayedStats = [
    { title: 'Total Users', value: overviewStats?.totalUsers?.toLocaleString() ?? 'N/A', icon: <Users className="h-6 w-6 text-primary" />, description: 'Registered platform users' },
    { title: 'Total NFTs', value: overviewStats?.totalNfts?.toLocaleString() ?? 'N/A', icon: <Shapes className="h-6 w-6 text-primary" />, description: 'NFTs on the platform' },
    { title: 'Total Collections', value: overviewStats?.totalCollections?.toLocaleString() ?? 'N/A', icon: <Library className="h-6 w-6 text-primary" />, description: 'Collections created' },
    { title: 'Total Sales', value: overviewStats?.totalSales?.toLocaleString() ?? 'N/A', icon: <Landmark className="h-6 w-6 text-primary" />, description: 'Completed sales transactions' },
    { title: 'Total Volume', value: formatVolume(overviewStats?.totalVolume), icon: <TrendingUp className="h-6 w-6 text-primary" />, description: 'All-time trading volume' },
    { title: '24h Volume', value: formatVolume(overviewStats?.totalVolume24h), icon: <Activity className="h-6 w-6 text-primary" />, description: 'Trading volume in last 24h' },
  ];

  const renderChartError = (message: string) => (
    <div className="h-64 w-full flex items-center justify-center bg-muted/50 rounded-md p-4">
        <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    </div>
  );
  
  const getLeaderboardValueLabel = (type: LeaderboardType, value: number) => {
    if (type === 'collectors') return `${formatVolume(value)} Spent`;
    return `${formatVolume(value)} Earned`; // For creators
  };


  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8 selection:bg-accent/30 selection:text-accent-foreground">
        <div className="container mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
                <BarChart3 className="h-10 w-10 text-primary" strokeWidth={1.5}/>
                <h1 className="text-3xl sm:text-4xl font-headline font-bold text-primary tracking-tight">Marketplace Statistics</h1>
            </div>
            <Button variant="outline" asChild className="self-start sm:self-center">
              <Link href="/home"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
            </Button>
          </div>

          {overviewError && ( <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>{overviewError}</AlertDescription></Alert> )}
          <section className="mb-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoadingOverview ? Array.from({ length: 6 }).map((_, index) => (<Card key={`stat-skeleton-${index}`} className="shadow-lg rounded-xl"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-6 w-6 rounded-sm" /></CardHeader><CardContent><Skeleton className="h-7 w-1/3 mb-1" /><Skeleton className="h-3 w-1/2" /></CardContent></Card>))
              : displayedStats.map((stat) => (<StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} description={stat.description}/>)) }
            </div>
          </section>

          <section className="mb-8 grid grid-cols-1 lg:grid-cols-1 gap-6"> 
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center"><LineChartIcon className="mr-2 h-5 w-5"/>Trading Volume</CardTitle>
                    <Select value={tradingVolumePeriod} onValueChange={setTradingVolumePeriod}>
                        <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription>Daily trading volume (ETH) over the selected period.</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] pr-0 sm:pr-2">
                {isLoadingTradingVolume ? <Skeleton className="h-full w-full rounded-md" /> 
                : tradingVolumeError ? renderChartError(tradingVolumeError)
                : formattedTradingVolumeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedTradingVolumeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))"/>
                            <YAxis tickFormatter={(value) => `${value} ETH`} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))"/>
                            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}} itemStyle={{ color: 'hsl(var(--foreground))' }} labelStyle={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }} formatter={(value: number) => [`${value.toFixed(2)} ETH`, "Volume"]}/>
                            <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : <div className="h-full w-full flex items-center justify-center"><p className="text-muted-foreground">No trading volume data available for this period.</p></div>}
              </CardContent>
            </Card>
            
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-primary flex items-center"><Library className="mr-2 h-5 w-5"/>Top Collections</CardTitle>
                  <Select value={topCollectionsPeriod} onValueChange={setTopCollectionsPeriod}>
                        <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {periodOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription>Highest performing collections by sales volume.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTopCollections ? <Skeleton className="h-64 w-full rounded-md" />
                : topCollectionsError ? renderChartError(topCollectionsError) 
                : topCollections.length > 0 ? (
                    <div className="space-y-3">
                    {topCollections.map((col, index) => (
                      <Link href={`/collections/${col.slug || col.id}`} key={col.id} className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-sm w-5 text-center text-muted-foreground">{index + 1}.</span>
                            <Image src={col.logoImageUrl || 'https://placehold.co/40x40.png'} alt={col.name} width={40} height={40} className="h-10 w-10 rounded-md object-cover border" data-ai-hint="collection logo symbol"/>
                            <div>
                              <p className="text-sm font-medium text-foreground truncate max-w-[150px] sm:max-w-xs">{col.name}</p>
                              <p className="text-xs text-muted-foreground">{col.itemCount.toLocaleString()} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-accent">{formatVolume(col.totalVolume)}</p>
                            <p className="text-xs text-muted-foreground">{col.salesCount.toLocaleString()} sales</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : <p className="text-muted-foreground text-center py-4">No top collections data available for this period.</p>}
              </CardContent>
            </Card>
          </section>

          <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center"><Gem className="mr-2 h-6 w-6 text-teal-500"/>Top Selling NFTs</CardTitle>
                    <Select value={topNftsPeriod} onValueChange={(v) => setTopNftsPeriod(v as LeaderboardPeriod)}>
                        <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {periodOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <CardDescription>Most popular NFTs based on sales volume.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingTopNfts ? <Skeleton className="h-64 w-full rounded-md" />
                : topNftsError ? renderChartError(topNftsError)
                : topNftsData.length > 0 ? (
                  topNftsData.map((item, index) => (
                    <Link href={`/nft/${item.slug || item.id}`} key={item.id} className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold text-sm w-5 text-center text-muted-foreground">{index + 1}.</span>
                            <Image src={item.imageUrl || 'https://placehold.co/40x40.png'} alt={item.title} width={40} height={40} className="h-10 w-10 rounded-md object-cover border" data-ai-hint="nft artwork"/>
                            <div>
                              <p className="text-sm font-medium text-foreground hover:text-primary hover:underline block truncate max-w-[150px] sm:max-w-[180px]">{item.title}</p>
                              {item.collectionName && <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[180px]">{item.collectionName}</p>}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-accent">{formatVolume(item.totalVolume)}</p>
                            <p className="text-xs text-muted-foreground">{item.salesCount.toLocaleString()} sales</p>
                          </div>
                        </div>
                      </Link>
                  ))
                ) : <p className="text-muted-foreground text-center py-4">No top NFTs data available for this period.</p>}
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="text-xl font-semibold text-primary flex items-center"><UsersRound className="mr-2 h-6 w-6 text-indigo-500"/>Leaderboard</CardTitle>
                    <div className="flex gap-2 self-start sm:self-center">
                        <Select value={leaderboardType} onValueChange={(v) => setLeaderboardType(v as LeaderboardType)}>
                            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="collectors">Collectors</SelectItem>
                                <SelectItem value="creators">Creators</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={leaderboardPeriod} onValueChange={(v) => setLeaderboardPeriod(v as LeaderboardPeriod)}>
                            <SelectTrigger className="w-[120px] h-9 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {periodOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CardDescription>{leaderboardType === 'collectors' ? 'Top users by total purchase volume.' : 'Top creators by total sales volume of their NFTs.'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoadingLeaderboard ? <Skeleton className="h-64 w-full rounded-md" />
                : leaderboardError ? renderChartError(leaderboardError)
                : leaderboardData.length > 0 ? (
                  leaderboardData.map((item, index) => (
                    <Link href={`/profile/${item.userId}`} key={item.userId} className="block p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className="font-semibold text-sm w-5 text-center text-muted-foreground">{index + 1}.</span>
                                <Image src={item.avatarUrl || 'https://placehold.co/40x40.png'} alt={item.username} width={40} height={40} className="h-10 w-10 rounded-full object-cover border" data-ai-hint="profile avatar"/>
                                <div>
                                    <p className="text-sm font-medium text-foreground hover:text-primary hover:underline block truncate max-w-[150px] sm:max-w-xs">{item.username}</p>
                                    <p className="text-xs text-muted-foreground">{getLeaderboardValueLabel(leaderboardType, item.value)}</p>
                                </div>
                            </div>
                             <Button variant="ghost" size="sm" asChild><Link href={`/profile/${item.userId}`}>View</Link></Button>
                        </div>
                    </Link>
                  ))
                ) : <p className="text-muted-foreground text-center py-4">No leaderboard data available for this period/type.</p>}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Toaster />
    </>
  );
}
