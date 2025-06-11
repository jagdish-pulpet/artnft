
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { ClipboardCheck, AlertTriangle, ListChecks, Bell, CircleAlert, CheckSquare, Eye, MessageSquare, AlertCircleIcon, Settings, Database, UserCog } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
type TaskPriority = 'High' | 'Medium' | 'Low';
type AlertSeverity = 'Critical' | 'Warning' | 'Info';

interface MockTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate?: Date;
  status: TaskStatus;
  assignedTo?: string; // Admin username
  relatedLink?: string; // Link to relevant admin page
}

interface MockAlert {
  id: string;
  message: string;
  severity: AlertSeverity;
  timestamp: Date;
  acknowledged: boolean;
}

const initialMockTasks: MockTask[] = [
  { id: 'task_001', title: 'Review 5 New NFT Submissions', description: 'Check submitted NFTs for quality and policy compliance.', priority: 'High', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), status: 'Pending', assignedTo: 'admin_user1', relatedLink: '/admin/moderation' },
  { id: 'task_002', title: 'Process 2 Artist Verification Requests', description: 'Verify identities and portfolios of new artist applicants.', priority: 'Medium', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'Pending', assignedTo: 'admin_user2', relatedLink: '/admin/users' },
  { id: 'task_003', title: 'Update Platform Terms of Service', description: 'Incorporate new clauses regarding AI-generated art.', priority: 'Low', dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: 'In Progress', assignedTo: 'admin_user1', relatedLink: '/admin/settings' },
  { id: 'task_004', title: 'Investigate High Report Volume on User "SpamBot"', description: 'User has received multiple spam reports.', priority: 'High', status: 'Pending', assignedTo: 'admin_user2', relatedLink: '/admin/users/usr_spambot_id' },
];

const initialMockAlerts: MockAlert[] = [
  { id: 'alert_001', message: 'Simulated: Database backup successfully completed.', severity: 'Info', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), acknowledged: false },
  { id: 'alert_002', message: 'Simulated: High traffic volume detected on marketplace homepage.', severity: 'Warning', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), acknowledged: false },
  { id: 'alert_003', message: 'Simulated: New security patch applied to server.', severity: 'Info', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), acknowledged: true },
  { id: 'alert_004', message: 'Simulated: Failed login attempts threshold reached for IP 123.45.67.89.', severity: 'Critical', timestamp: new Date(Date.now() - 5 * 60 * 1000), acknowledged: false },
];

const priorityVariantMap: Record<TaskPriority, "default" | "secondary" | "destructive" | "outline"> = {
  'High': 'destructive',
  'Medium': 'default', // Using 'default' (primary) for medium
  'Low': 'secondary',
};
const severityIconMap: Record<AlertSeverity, React.ElementType> = {
    'Critical': CircleAlert,
    'Warning': AlertTriangle,
    'Info': AlertCircleIcon,
};
const severityColorMap: Record<AlertSeverity, string> = {
    'Critical': 'text-red-500',
    'Warning': 'text-yellow-500',
    'Info': 'text-blue-500',
};


export default function AdminTasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<MockTask[]>(initialMockTasks);
  const [alerts, setAlerts] = useState<MockAlert[]>(initialMockAlerts);
  const [selectedTask, setSelectedTask] = useState<MockTask | null>(null);

  const handleCompleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    const completedTask = tasks.find(task => task.id === taskId);
    toast({
      title: 'Task Completed (Simulated)',
      description: `Task "${completedTask?.title}" marked as complete.`,
    });
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    toast({
      title: 'Alert Acknowledged (Simulated)',
      description: `Alert "${alerts.find(a=>a.id===alertId)?.message.substring(0,30)}..." acknowledged.`,
    });
  };
  
  const openTaskDetailsDialog = (task: MockTask) => {
    setSelectedTask(task);
    // Dialog trigger will handle opening
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center">
          <ClipboardCheck className="mr-3 h-7 w-7" /> Admin Tasks & Alerts
        </h1>
        <p className="text-muted-foreground">Manage your workload and stay informed about important system events.</p>
      </div>

      <Tabs defaultValue="pending-tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2">
          <TabsTrigger value="pending-tasks">
            <ListChecks className="mr-2 h-4 w-4" /> Pending Tasks ({tasks.filter(t => t.status !== 'Completed').length})
          </TabsTrigger>
          <TabsTrigger value="system-alerts">
            <Bell className="mr-2 h-4 w-4" /> System Alerts ({alerts.filter(a => !a.acknowledged).length} New)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending-tasks">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Actionable items requiring your attention.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.filter(t => t.status !== 'Completed').length > 0 ? (
                tasks.filter(t => t.status !== 'Completed').map(task => (
                  <Card key={task.id} className="p-4 shadow-sm border hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                      <div className="flex-1 mb-3 sm:mb-0">
                        <h4 className="font-semibold text-md">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                        {task.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Due: {new Date(task.dueDate).toLocaleDateString()} ({formatDistanceToNow(task.dueDate, { addSuffix: true })})
                            </p>
                        )}
                        {task.assignedTo && <p className="text-xs text-muted-foreground mt-0.5">Assigned to: {task.assignedTo}</p>}
                      </div>
                      <div className="flex flex-col items-start sm:items-end sm:ml-4 space-y-2">
                        <Badge variant={priorityVariantMap[task.priority]} className="text-xs">{task.priority} Priority</Badge>
                        <div className="flex gap-2">
                           <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => openTaskDetailsDialog(task)}>
                                        <Eye className="mr-2 h-3.5 w-3.5" /> View
                                    </Button>
                                </DialogTrigger>
                                {selectedTask && selectedTask.id === task.id && (
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{selectedTask.title}</DialogTitle>
                                            <DialogDescription>{selectedTask.description}</DialogDescription>
                                        </DialogHeader>
                                        <div className="py-2 text-sm space-y-1">
                                            <p><strong>Priority:</strong> <Badge variant={priorityVariantMap[selectedTask.priority]}>{selectedTask.priority}</Badge></p>
                                            {selectedTask.dueDate && <p><strong>Due:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>}
                                            <p><strong>Status:</strong> {selectedTask.status}</p>
                                            {selectedTask.assignedTo && <p><strong>Assigned To:</strong> {selectedTask.assignedTo}</p>}
                                        </div>
                                        <DialogFooter>
                                            {selectedTask.relatedLink && <Button asChild variant="outline"><Link href={selectedTask.relatedLink}>Go to Item</Link></Button>}
                                            <DialogClose asChild><Button>Close</Button></DialogClose>
                                        </DialogFooter>
                                    </DialogContent>
                                )}
                            </Dialog>
                          <Button variant="default" size="sm" onClick={() => handleCompleteTask(task.id)}>
                            <CheckSquare className="mr-2 h-3.5 w-3.5" /> Complete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ListChecks className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  No pending tasks. Great job!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-alerts">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important system notifications and status updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map(alert => {
                  const AlertIcon = severityIconMap[alert.severity];
                  const iconColor = severityColorMap[alert.severity];
                  return (
                  <div key={alert.id} className={`p-3 rounded-md border flex items-start gap-3 ${alert.acknowledged ? 'bg-muted/30 opacity-70' : 'bg-card'}`}>
                    <AlertIcon className={`h-5 w-5 mt-0.5 shrink-0 ${iconColor}`} />
                    <div className="flex-1">
                      <p className={`text-sm ${alert.acknowledged ? 'text-muted-foreground' : 'text-foreground'}`}>{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button variant="outline" size="sm" onClick={() => handleAcknowledgeAlert(alert.id)}>
                        Acknowledge
                      </Button>
                    )}
                     {alert.acknowledged && (
                        <Badge variant="secondary" className="text-xs">Acknowledged</Badge>
                    )}
                  </div>
                )})
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  No system alerts at the moment.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
