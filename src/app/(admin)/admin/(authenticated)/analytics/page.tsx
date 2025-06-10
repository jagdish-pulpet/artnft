
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChartBig as AnalyticsIcon, Users, Palette, DollarSign, TrendingUp, ShoppingCart } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

const salesData = [
  { month: 'Jan', sales: Math.floor(Math.random() * 50) + 10 },
  { month: 'Feb', sales: Math.floor(Math.random() * 50) + 20 },
  { month: 'Mar', sales: Math.floor(Math.random() * 50) + 15 },
  { month: 'Apr', sales: Math.floor(Math.random() * 50) + 30 },
  { month: 'May', sales: Math.floor(Math.random() * 50) + 25 },
  { month: 'Jun', sales: Math.floor(Math.random() * 50) + 40 },
];

const userSignupsData = [
  { month: 'Jan', users: Math.floor(Math.random() * 100) + 50 },
  { month: 'Feb', users: Math.floor(Math.random() * 100) + 60 },
  { month: 'Mar', users: Math.floor(Math.random() * 100) + 70 },
  { month: 'Apr', users: Math.floor(Math.random() * 100) + 80 },
  { month: 'May', users: Math.floor(Math.random() * 100) + 90 },
  { month: 'Jun', users: Math.floor(Math.random() * 100) + 100 },
];

const nftCategoryData = [
  { name: 'Digital Art', value: 400, fill: "hsl(var(--chart-1))" },
  { name: 'Photography', value: 300, fill: "hsl(var(--chart-2))" },
  { name: 'Music', value: 150, fill: "hsl(var(--chart-3))" },
  { name: 'Collectibles', value: 250, fill: "hsl(var(--chart-4))" },
  { name: 'Virtual Worlds', value: 100, fill: "hsl(var(--chart-5))" },
];

const chartConfig: ChartConfig = {
  sales: { label: "Sales (ETH)", color: "hsl(var(--chart-1))" },
  users: { label: "New Users", color: "hsl(var(--chart-2))" },
  digitalArt: { label: "Digital Art", color: "hsl(var(--chart-1))" },
  photography: { label: "Photography", color: "hsl(var(--chart-2))" },
  music: { label: "Music", color: "hsl(var(--chart-3))" },
  collectibles: { label: "Collectibles", color: "hsl(var(--chart-4))" },
  virtualWorlds: { label: "Virtual Worlds", color: "hsl(var(--chart-5))" },
};

const mockKeyMetrics = {
    totalSalesVolume: "125.5 ETH",
    totalUsers: "1,350",
    activeListings: "420 NFTs",
    avgSalePrice: "0.85 ETH",
};


export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <AnalyticsIcon className="mr-3 h-7 w-7" /> Platform Analytics
        </h1>
        <p className="text-muted-foreground">Visualize platform performance and trends (Simulated Data).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockKeyMetrics.totalSalesVolume}</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockKeyMetrics.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+120 this month</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockKeyMetrics.activeListings}</div>
                <p className="text-xs text-muted-foreground">+30 since last week</p>
            </CardContent>
        </Card>
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Sale Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{mockKeyMetrics.avgSalePrice}</div>
                <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sales Over Time (Simulated ETH)</CardTitle>
            <CardDescription>Monthly sales volume trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart data={salesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value} ETH`} />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>New User Sign-ups</CardTitle>
            <CardDescription>Monthly new user registrations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={userSignupsData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8}/>
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="users" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>NFT Distribution by Category</CardTitle>
            <CardDescription>Breakdown of NFTs across various categories.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={chartConfig} className="h-[300px] w-full max-w-md">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={nftCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                    {nftCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}
