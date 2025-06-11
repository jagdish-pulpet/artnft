
'use client';

import type { NotificationItem } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellRing, CheckCheck, AlertTriangle, Tag, TrendingUp, MessageSquare, Settings2, Zap } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet'; // Added SheetDescription
import { Separator } from '@/components/ui/separator';

interface NotificationsPanelProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'new_bid': return <TrendingUp className="w-5 h-5 text-blue-500" />;
    case 'price_drop': return <Tag className="w-5 h-5 text-green-500" />;
    case 'new_listing': return <Zap className="w-5 h-5 text-purple-500" />;
    case 'sale': return <BellRing className="w-5 h-5 text-yellow-500" />;
    case 'mention': return <MessageSquare className="w-5 h-5 text-pink-500" />;
    case 'system': return <Settings2 className="w-5 h-5 text-gray-500" />;
    default: return <AlertTriangle className="w-5 h-5 text-red-500" />;
  }
};

export default function NotificationsPanel({ notifications, onMarkAllAsRead }: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-4 border-b">
        <SheetTitle className="text-lg font-medium">Notifications</SheetTitle>
        {unreadCount > 0 && (
             <SheetDescription className="text-xs text-muted-foreground">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}.
            </SheetDescription>
        )}
      </SheetHeader>

      <ScrollArea className="flex-grow">
        <div className="p-1">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <BellRing className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No new notifications.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </ScrollArea>

      {notifications.length > 0 && (
        <SheetFooter className="p-4 border-t flex-col sm:flex-row gap-2">
          <Button variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground" onClick={onMarkAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all as read
          </Button>
          <Link href="/notifications" passHref className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full">View all</Button>
          </Link>
        </SheetFooter>
      )}
    </div>
  );
}

interface NotificationCardProps {
  notification: NotificationItem;
}

function NotificationCard({ notification }: NotificationCardProps) {
  const timeAgo = formatDistanceToNowStrict(new Date(notification.timestamp), { addSuffix: true });

  const cardContent = (
    <div className={`flex items-start gap-3 p-3 hover:bg-muted/50 rounded-md transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}>
      {notification.avatarUrl ? (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={notification.avatarUrl} alt={notification.title.substring(0,10)} />
          <AvatarFallback>{notification.title.substring(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="mt-1 text-accent">
          {getNotificationIcon(notification.type)}
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</h4>
            {!notification.read && (
                <span className="ml-2 flex-shrink-0 h-2 w-2 mt-1.5 rounded-full bg-accent" aria-label="Unread"></span>
            )}
        </div>
        <p className={`text-xs ${!notification.read ? 'text-foreground/80' : 'text-muted-foreground/80'}`}>{notification.message}</p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">{timeAgo}</p>
      </div>
    </div>
  );

  return notification.link ? (
    <Link href={notification.link} passHref>
      <a className="block cursor-pointer">{cardContent}</a>
    </Link>
  ) : (
    <div className="block">{cardContent}</div>
  );
}

