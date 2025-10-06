import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  FileText,
  CreditCard,
  Building2,
  Users,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  userId: string | null;
  memberId: string | null;
  type: "email" | "sms" | "push" | "in_app";
  status: "pending" | "sent" | "delivered" | "failed" | "opened";
  title: string;
  message: string;
  data: string | null;
  scheduledFor: Date | null;
  sentAt: Date | null;
  deliveredAt: Date | null;
  openedAt: Date | null;
  externalId: string | null;
  retryCount: number | null;
  maxRetries: number | null;
  createdAt: Date;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all notifications
  const { data: notificationsData, isLoading } = useQuery<{ success: boolean; notifications: Notification[] }>({
    queryKey: ["/api/notifications"],
  });

  const notifications = notificationsData?.notifications || [];

  // Fetch unread count
  const { data: unreadData } = useQuery<{ success: boolean; count: number }>({
    queryKey: ["/api/notifications/unread"],
  });

  const unreadCount = unreadData?.count || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}/mark-read`, {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PUT",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
        variant: "success",
      });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete notification");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
      toast({
        title: "Deleted",
        description: "Notification deleted successfully",
      });
    },
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "sms":
        return <MessageSquare className="w-5 h-5" />;
      case "push":
        return <Smartphone className="w-5 h-5" />;
      case "in_app":
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "outline", label: "Pending" },
      sent: { variant: "secondary", label: "Sent" },
      delivered: { variant: "default", label: "Delivered" },
      failed: { variant: "destructive", label: "Failed" },
      opened: { variant: "secondary", label: "Read" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className="ml-2">
        {config.label}
      </Badge>
    );
  };

  const getNotificationColor = (notification: Notification) => {
    if (notification.status === "failed") return "border-l-red-500 bg-red-50/50";
    if (notification.openedAt) return "border-l-gray-300 bg-gray-50/50";
    return "border-l-blue-500 bg-blue-50/50";
  };

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsReadMutation.mutate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteNotificationMutation.mutate(id);
    }
  };

  const filterNotifications = (notifications: Notification[]) => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.openedAt);
      case "read":
        return notifications.filter((n) => n.openedAt);
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(notifications);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Notifications</CardTitle>
                  <CardDescription className="text-blue-100">
                    Stay updated with your account activity
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white border-0 text-lg px-3 py-1">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="grid w-[400px] grid-cols-3">
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="read">
                    Read ({notifications.length - unreadCount})
                  </TabsTrigger>
                </TabsList>

                {unreadCount > 0 && (
                  <Button
                    onClick={() => markAllAsReadMutation.mutate()}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                  </Button>
                )}
              </div>

              <TabsContent value={activeTab} className="mt-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading notifications...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-500">
                      {activeTab === "unread"
                        ? "You're all caught up!"
                        : activeTab === "read"
                        ? "No read notifications yet"
                        : "You don't have any notifications yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => {
                      const isRead = !!notification.openedAt;
                      return (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 border-l-4 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer",
                            getNotificationColor(notification)
                          )}
                          onClick={() => handleMarkAsRead(notification.id, isRead)}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                                isRead ? "bg-gray-200 text-gray-600" : "bg-blue-100 text-blue-600"
                              )}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <h4
                                  className={cn(
                                    "text-sm font-semibold",
                                    isRead ? "text-gray-700" : "text-gray-900"
                                  )}
                                >
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-2 ml-4">
                                  {!isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  {getStatusBadge(notification.status)}
                                </div>
                              </div>

                              <p
                                className={cn(
                                  "text-sm mb-2",
                                  isRead ? "text-gray-600" : "text-gray-800"
                                )}
                              >
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                  {notification.deliveredAt && (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                      Delivered
                                    </span>
                                  )}
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(notification.id);
                                  }}
                                  className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
