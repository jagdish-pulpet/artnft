
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ClipboardList, Search, User, FileText, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge"; // Added this import
import type { DateRange } from "react-day-picker";
import { cn } from '@/lib/utils';

type AuditActionType = 'USER_UPDATE' | 'NFT_STATUS_CHANGE' | 'CATEGORY_CREATED' | 'SETTINGS_CHANGED' | 'LOGIN_ATTEMPT';

interface MockAuditLogEntry {
  id: string;
  timestamp: Date;
  adminUsername: string;
  actionType: AuditActionType;
  targetId?: string; // e.g., User ID, NFT ID
  description: string;
}

const initialMockAuditLogs: MockAuditLogEntry[] = [
  { id: 'log_001', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), adminUsername: 'admin_user1', actionType: 'USER_UPDATE', targetId: 'usr_002', description: 'Suspended user PixelPioneer.' },
  { id: 'log_002', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), adminUsername: 'admin_user2', actionType: 'NFT_STATUS_CHANGE', targetId: 'nft_001', description: 'Featured NFT Cosmic Dreamscape.' },
  { id: 'log_003', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), adminUsername: 'admin_user1', actionType: 'CATEGORY_CREATED', targetId: 'cat_new_abstract', description: 'Created new category "Abstract Art".' },
  { id: 'log_004', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), adminUsername: 'admin_user2', actionType: 'SETTINGS_CHANGED', description: 'Updated site tagline.' },
  { id: 'log_005', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), adminUsername: 'system_monitor', actionType: 'LOGIN_ATTEMPT', description: 'Failed login attempt for user unknown_user.' },
  { id: 'log_006', timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), adminUsername: 'admin_user1', actionType: 'NFT_STATUS_CHANGE', targetId: 'nft_003', description: 'Hid NFT Synthwave Sunset due to policy violation.' },
];

const mockAdminUsers = ['all', 'admin_user1', 'admin_user2', 'system_monitor'];
const mockActionTypes: {value: AuditActionType | 'all', label: string}[] = [
    {value: 'all', label: 'All Action Types'},
    {value: 'USER_UPDATE', label: 'User Update'},
    {value: 'NFT_STATUS_CHANGE', label: 'NFT Status Change'},
    {value: 'CATEGORY_CREATED', label: 'Category Created'},
    {value: 'SETTINGS_CHANGED', label: 'Settings Changed'},
    {value: 'LOGIN_ATTEMPT', label: 'Login Attempt'},
];


export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<MockAuditLogEntry[]>(initialMockAuditLogs);
  const [filteredLogs, setFilteredLogs] = useState<MockAuditLogEntry[]>(initialMockAuditLogs);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedAdmin, setSelectedAdmin] = useState<string>('all');
  const [selectedActionType, setSelectedActionType] = useState<AuditActionType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let currentLogs = [...logs];

    if (dateRange?.from) {
      currentLogs = currentLogs.filter(log => log.timestamp >= dateRange.from!);
    }
    if (dateRange?.to) {
      // Set to end of day for "to" date for inclusive range
      const toDateEnd = new Date(dateRange.to);
      toDateEnd.setHours(23, 59, 59, 999);
      currentLogs = currentLogs.filter(log => log.timestamp <= toDateEnd);
    }

    if (selectedAdmin !== 'all') {
      currentLogs = currentLogs.filter(log => log.adminUsername === selectedAdmin);
    }

    if (selectedActionType !== 'all') {
      currentLogs = currentLogs.filter(log => log.actionType === selectedActionType);
    }
    
    if (searchTerm) {
        currentLogs = currentLogs.filter(log => 
            log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.targetId && log.targetId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            log.adminUsername.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    setFilteredLogs(currentLogs);
  }, [logs, dateRange, selectedAdmin, selectedActionType, searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <ClipboardList className="mr-3 h-7 w-7" /> Audit Log
        </h1>
        <p className="text-muted-foreground">Track significant administrative actions and system events.</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg">Filter Logs</CardTitle>
          <CardDescription>Refine the audit log view using the filters below.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
              <SelectTrigger className="h-10"><Filter className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue placeholder="Filter by Admin User" /></SelectTrigger>
              <SelectContent>
                {mockAdminUsers.map(user => (
                  <SelectItem key={user} value={user}>{user === 'all' ? 'All Admin Users' : user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedActionType} onValueChange={(value) => setSelectedActionType(value as AuditActionType | 'all')}>
              <SelectTrigger className="h-10"><Filter className="mr-2 h-4 w-4 text-muted-foreground"/><SelectValue placeholder="Filter by Action Type" /></SelectTrigger>
              <SelectContent>
                 {mockActionTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                 ))}
              </SelectContent>
            </Select>
             <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search description, target ID..." 
                className="pl-8 w-full h-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b p-4">
            <CardTitle className="text-lg">Log Entries</CardTitle>
            <CardDescription>Showing {filteredLogs.length} of {logs.length} log entries.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead className="w-[150px]">Admin User</TableHead>
                  <TableHead className="w-[180px]">Action Type</TableHead>
                  <TableHead className="w-[150px]">Target ID</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{format(log.timestamp, 'PPpp')}</TableCell>
                    <TableCell>{log.adminUsername}</TableCell>
                    <TableCell><Badge variant="secondary">{log.actionType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</Badge></TableCell>
                    <TableCell>{log.targetId || 'N/A'}</TableCell>
                    <TableCell className="max-w-md truncate">{log.description}</TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No log entries found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <CardFooter className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
             {/* Placeholder for total entries if different from logs.length due to server-side pagination */}
            <p>{filteredLogs.length} log entr(y/ies) displayed.</p>
            <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}

