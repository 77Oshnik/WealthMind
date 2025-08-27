import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Target,
  Lightbulb,
  Zap
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'insight';
  title: string;
  message: string;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissed?: boolean;
}

export const AINotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const aiNotifications = [
    {
      type: 'success',
      title: 'Goal Achievement!',
      message: "Congratulations! You've exceeded your monthly savings goal by 15%. Your discipline is paying off!",
      action: { label: 'View Details', onClick: () => console.log('View savings details') }
    },
    {
      type: 'warning',
      title: 'Budget Alert',
      message: "You're at 85% of your dining budget with 8 days left in the month. Consider cooking at home more often.",
      action: { label: 'See Suggestions', onClick: () => console.log('Show cooking suggestions') }
    },
    {
      type: 'insight',
      title: 'Smart Insight',
      message: "I noticed you spend less on weekends. Your weekday coffee habit costs $78/month. Here are some alternatives.",
      action: { label: 'Show Alternatives', onClick: () => console.log('Show coffee alternatives') }
    },
    {
      type: 'info',
      title: 'Market Opportunity',
      message: "Your savings account rate is below market average. I found 3 accounts with 2.1% higher APY.",
      action: { label: 'Compare Rates', onClick: () => console.log('Show rate comparison') }
    },
    {
      type: 'success',
      title: 'Subscription Optimization',
      message: "I successfully helped you save $47/month by canceling unused subscriptions. That's $564/year!",
      action: { label: 'View Report', onClick: () => console.log('Show optimization report') }
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Only add new notification if we have less than 1 visible
      if (notifications.filter(n => !n.dismissed).length < 1) {
        const randomNotification = aiNotifications[Math.floor(Math.random() * aiNotifications.length)];
        
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomNotification.type as any,
          title: randomNotification.title,
          message: randomNotification.message,
          timestamp: new Date(),
          action: randomNotification.action,
          dismissed: false
        };

        setNotifications(prev => [newNotification]); // Keep only 1 notification
      }
    }, 20000); // New notification every 20 seconds (less frequent)

    return () => clearInterval(interval);
  }, [notifications]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, dismissed: true } : notif
      )
    );

    // Remove after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 300);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'insight':
        return <Lightbulb className="w-5 h-5 text-ai-primary" />;
      case 'info':
        return <TrendingUp className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'insight':
        return 'border-ai-primary/20 bg-ai-primary/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-muted/20 bg-muted/5';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-40 space-y-3 max-w-sm max-h-[60vh] overflow-y-auto">
      {notifications.filter(n => !n.dismissed).slice(0, 1).map((notification, index) => (
        <Card
          key={notification.id}
          className={`
            border transition-all duration-300 hover:shadow-lg
            ${getNotificationStyle(notification.type)}
            ${index === 0 ? 'animate-[slideInRight_0.3s_ease-out]' : ''}
          `}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    {notification.type === 'insight' && (
                      <Badge variant="outline" className="bg-ai-primary/10 text-ai-primary border-ai-primary/20 text-xs px-1.5 py-0.5">
                        <Zap className="w-2.5 h-2.5 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs opacity-60">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                    {notification.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs h-7 px-2"
                        onClick={notification.action.onClick}
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={() => dismissNotification(notification.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};