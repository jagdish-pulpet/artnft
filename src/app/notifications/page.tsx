
'use client';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, Tag, ShoppingCart, CheckCircle, Filter, AlertCircle, Sparkles, SearchIcon, Frown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'new_listing' | 'price_drop' | 'transaction' | 'update' | 'auction_ending';
  title: string;
  message: string;
  date: string;
  icon: LucideIcon;
  read: boolean;
  href?: string;
}

const notifications: Notification[] = [
  { id: '1', type: 'new_listing', title: 'New Art from @GalaxyPainter!', message: 'Cosmic Explorer II just dropped. Check it out!', date: '2 hours ago', icon: Sparkles, read: false, href: '/nft/1' },
  { id: '2', type: 'price_drop', title: 'Price Drop Alert!', message: 'Pixelated Serenity is now 0.7 ETH.', date: '1 day ago', icon: Tag, read: false, href: '/nft/3' },
  { id: '3', type: 'transaction', title: 'Purchase Successful', message: 'You bought Abstract Flow for 1.5 ETH.', date: '3 days ago', icon: ShoppingCart, read: true },
  { id: '4', type: 'update', title: 'Welcome to ArtNFT!', message: 'Explore unique digital art and start your collection.', date: '5 days ago', icon: CheckCircle, read: true },
  { id: '5', type: 'auction_ending', title: 'Auction Ending Soon!', message: 'The auction for "Cyber Dreams" ends in 1 hour.', date: '55 mins ago', icon: AlertCircle, read: false, href: '/nft/2' },
];

const notificationFilters = ['All', 'Unread', 'Mentions', 'Offers'];


export default function NotificationsPage() {
  // const [currentNotifications, setCurrentNotifications] = useState(notifications); // For future state management

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold font-headline">Notifications</CardTitle>
            <CardDescription>
              Stay updated with important activities and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {notificationFilters.map(filter => (
                <Button key={filter} variant={filter === 'All' ? 'default' : 'outline'} size="sm">
                  <Filter className="h-4 w-4 mr-2" /> {filter}
                </Button>
              ))}
            </div>

            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map(notif => {
                  const NotificationWrapper = notif.href ? Link : 'div';
                  return (
                    <NotificationWrapper
                      key={notif.id}
                      {...(notif.href ? { href: notif.href } : {})}
                      className={`rounded-lg border flex items-start transition-colors p-3 space-x-3 sm:p-4 sm:space-x-4 ${
                        notif.read
                          ? 'bg-muted/30 opacity-70 hover:bg-muted/40'
                          : 'bg-card hover:bg-muted/20'
                      } ${notif.href ? 'cursor-pointer block' : 'block'}`}
                    >
                      <div className={`p-2.5 rounded-full mt-0.5 ${notif.read ? 'bg-muted' : 'bg-primary/10'}`}>
                        <notif.icon className={`h-5 w-5 ${notif.read ? 'text-muted-foreground' : 'text-primary'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className={`font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</p>
                          {!notif.read && <Badge variant="default" className="h-5 text-xs bg-accent text-accent-foreground">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1.5">{notif.date}</p>
                      </div>
                      {!notif.read && !notif.href && <div className="h-2.5 w-2.5 rounded-full bg-accent self-center shrink-0" aria-label="Unread"></div>}
                    </NotificationWrapper>
                  );
                })}
                 <Button variant="outline" className="w-full mt-8">Mark all as read</Button>
              </div>
            ) : (
              <Card className="text-center py-12 shadow-md border-dashed">
                <CardContent className="flex flex-col items-center">
                    <BellRing className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">No New Notifications</h3>
                    <p className="text-muted-foreground mt-1">You're all caught up! Check back later for updates.</p>
                    <Button className="mt-6" asChild variant="outline">
                        <Link href="/home">Explore Marketplace</Link>
                    </Button>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
