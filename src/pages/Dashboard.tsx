import { Package, Layers, ShoppingCart, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const stats = [
    {
      title: "Products",
      value: "23",
      icon: Package,
      link: "/products",
      color: "text-primary",
    },
    {
      title: "Materials",
      value: "45",
      icon: Layers,
      link: "/materials",
      color: "text-rose-gold",
    },
    {
      title: "Orders",
      value: "12",
      icon: ShoppingCart,
      link: "/orders",
      color: "text-accent-foreground",
    },
    {
      title: "Messages",
      value: "8",
      icon: MessageSquare,
      link: "/messages",
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome to Zarnaqsh</h1>
        <p className="text-muted-foreground mt-1">Manage your handmade jewelry business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 via-rose-gold-light/30 to-accent/20 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              to="/products"
              className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-semibold text-foreground">Add New Product</h3>
              <p className="text-sm text-muted-foreground mt-1">Create a new jewelry item</p>
            </Link>
            <Link
              to="/orders"
              className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-semibold text-foreground">View Orders</h3>
              <p className="text-sm text-muted-foreground mt-1">Check pending orders</p>
            </Link>
            <Link
              to="/materials"
              className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-semibold text-foreground">Manage Materials</h3>
              <p className="text-sm text-muted-foreground mt-1">Update material inventory</p>
            </Link>
            <Link
              to="/messages"
              className="p-4 bg-card rounded-lg border border-border hover:border-primary transition-colors"
            >
              <h3 className="font-semibold text-foreground">Read Messages</h3>
              <p className="text-sm text-muted-foreground mt-1">View customer inquiries</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
