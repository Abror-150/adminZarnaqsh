import { Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@/hooks/getEnv";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}


export default function Messages() {
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useQuery<Message[]>({
    queryKey: ["contact"],
    queryFn: async () => {
      const res = await axios.get(`${API}/contact`);
      return res.data; // backend qaytgan array
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading messages</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground mt-1">
          View customer inquiries and contact messages
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{messages.length}</p>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.name}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {message.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {message.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
