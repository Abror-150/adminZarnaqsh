import { Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    name: "Shohruh Aliyev",
    email: "shohruh@example.com",
    message: "Assalomu alaykum, men sizning kumush halqangizni sotib olishni xohlayman. Qanday qilib buyurtma berishim mumkin?",
    date: "2025-01-16",
    read: false,
  },
  {
    id: "2",
    name: "Elena Petrova",
    email: "elena@example.com",
    message: "Hello, I'm interested in your gold necklace collection. Do you ship internationally?",
    date: "2025-01-15",
    read: true,
  },
  {
    id: "3",
    name: "Nodira Samadova",
    email: "nodira@example.com",
    message: "Salom, sizda maxsus buyurtma qabul qilamanmi? Men o'ziga xos dizayndagi zargarlik buyumi yasatmoqchiman.",
    date: "2025-01-14",
    read: true,
  },
];

export default function Messages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">View customer inquiries and contact messages</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{mockMessages.length}</p>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {mockMessages.filter(m => !m.read).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <Card key={message.id} className={!message.read ? "border-primary" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.name}
                      {!message.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(message.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
