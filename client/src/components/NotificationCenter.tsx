import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, Info, CheckCircle, Calendar, FileText, CreditCard, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  // Fetch unread notifications (limit to 5 for dropdown)
  const { data: unreadData } = useQuery<{ success: boolean; count: number; notifications: Notification[] }>({
    queryKey: ["/api/notifications/unread"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const notifications = unreadData?.notifications?.slice(0, 5) || [];
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
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
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
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getNotificationIcon = (status: string) => {
    switch (status) {
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (status: string, isRead: boolean) => {
    if (status === "failed") return "border-l-orange-500 bg-orange-50";
    if (isRead) return "border-l-gray-300 bg-gray-50";
    return "border-l-blue-500 bg-blue-50";
  };

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  const viewAllNotifications = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 text-white hover:bg-white/10"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {unreadCount} new
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => {
                    const isRead = !!notification.openedAt;
                    return (
                      <div
                        key={notification.id}
                        className={`p-3 border-l-4 ${getNotificationColor(notification.status, isRead)} ${
                          !isRead ? "bg-opacity-100" : "bg-opacity-50"
                        } hover:bg-opacity-75 transition-colors cursor-pointer`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium ${!isRead ? "text-gray-900" : "text-gray-700"}`}>
                                  {notification.title}
                                </h4>
                                <p className={`text-xs mt-1 ${!isRead ? "text-gray-700" : "text-gray-500"}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatTimestamp(new Date(notification.createdAt))}
                                </p>
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                {!isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="border-t p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 gap-2"
                onClick={viewAllNotifications}
              >
                View All Notifications
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}