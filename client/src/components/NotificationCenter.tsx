import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, Info, CheckCircle, Calendar, FileText, CreditCard } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "reminder";
  category: "membership" | "event" | "payment" | "document" | "system";
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Membership Renewal Due",
    message: "Your 2024 membership is due for renewal. Renew now to maintain active status.",
    type: "warning",
    category: "membership",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: "/member/payments"
  },
  {
    id: "2",
    title: "New Event Available",
    message: "Property Investment Workshop registration is now open. Limited spots available.",
    type: "info",
    category: "event",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: "/member/events"
  },
  {
    id: "3",
    title: "Document Verification Complete",
    message: "Your education transcript has been verified and approved.",
    type: "success",
    category: "document",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: true,
    actionUrl: "/member/documents"
  },
  {
    id: "4",
    title: "Payment Confirmation",
    message: "Your conference registration payment of $150 has been processed successfully.",
    type: "success",
    category: "payment",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true,
    actionUrl: "/member/payments"
  },
  {
    id: "5",
    title: "Profile Incomplete",
    message: "Complete your professional details to improve your profile visibility.",
    type: "reminder",
    category: "system",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: false,
    actionUrl: "/member/profile"
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string, category: string) => {
    if (category === "event") return <Calendar className="w-4 h-4" />;
    if (category === "payment") return <CreditCard className="w-4 h-4" />;
    if (category === "document") return <FileText className="w-4 h-4" />;
    
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "reminder":
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-l-orange-500 bg-orange-50";
      case "success":
        return "border-l-green-500 bg-green-50";
      case "reminder":
        return "border-l-blue-500 bg-blue-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
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
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </Button>
                )}
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
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-l-4 ${getNotificationColor(notification.type)} ${
                        !notification.isRead ? "bg-opacity-100" : "bg-opacity-50"
                      } hover:bg-opacity-75 transition-colors cursor-pointer`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type, notification.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                                {notification.title}
                              </h4>
                              <p className={`text-xs mt-1 ${!notification.isRead ? "text-gray-700" : "text-gray-500"}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {formatTimestamp(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.isRead && (
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
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-blue-600 hover:text-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  View All Notifications
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}