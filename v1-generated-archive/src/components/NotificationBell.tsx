import { useState } from "react";
import { Bell, X, Trash2, Check, ShoppingBag, TrendingDown, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, NotificationItem } from "@/contexts/NotificationContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDistanceToNow } from "date-fns";

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "restock":
        return <Package className="w-4 h-4 text-green-500" />;
      case "price-drop":
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case "abandoned-cart":
        return <ShoppingBag className="w-4 h-4 text-orange-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationMessage = (notification: NotificationItem) => {
    // In a real app, these would be translated
    const messages = {
      EN: {
        restock: `${notification.productName} is back in stock!`,
        "price-drop": `Price drop on ${notification.productName}!`,
        "abandoned-cart": "Items waiting in your cart"
      },
      FR: {
        restock: `${notification.productName} est de retour en stock !`,
        "price-drop": `Baisse de prix sur ${notification.productName} !`,
        "abandoned-cart": "Articles en attente dans votre panier"
      },
      AR: {
        restock: `${notification.productName} متوفر الآن!`,
        "price-drop": `انخفاض في سعر ${notification.productName}!`,
        "abandoned-cart": "منتجات في انتظارك في السلة"
      }
    };

    return messages[language as keyof typeof messages]?.[notification.type] || notification.message;
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: language === "FR" ? undefined : undefined // Could add proper locale support
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">
            {language === "AR" ? "الإشعارات" : language === "FR" ? "Notifications" : "Notifications"}
          </h3>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="h-6 px-2 text-xs"
              >
                <Check className="w-3 h-3 mr-1" />
                {language === "AR" ? "قراءة الكل" : language === "FR" ? "Tout lire" : "Mark all read"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-6 px-2 text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {language === "AR" ? "لا توجد إشعارات جديدة" : language === "FR" ? "Aucune notification" : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    // Could navigate to product or cart based on notification type
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {getNotificationMessage(notification)}
                      </p>

                      {notification.data && notification.type === "price-drop" && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="line-through">{notification.data.oldPrice} DZD</span>
                          <span className="text-green-600 font-medium">{notification.data.newPrice} DZD</span>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            -{notification.data.discountPercent}%
                          </Badge>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(notification.date)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notification.id);
                      }}
                      className="h-6 w-6 p-0 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;