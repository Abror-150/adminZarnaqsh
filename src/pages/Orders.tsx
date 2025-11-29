import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API } from "@/hooks/getEnv";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface ProductItem {
  id: string;
  Product: {
    name_uz: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  fullName: string;
  totalPrice: number;
  createdAt: string;
  status?: "pending" | "completed" | "shipped";
  OrderItem?: ProductItem[];
}

export default function Orders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Ordersni olish
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(`${API}/order`);
      return res.data;
    },
  });

  // Orderni o'chirish
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`${API}/order/${id}`),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Error deleting order"),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "shipped":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading orders</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Buyurtmalar</h1>
        <p className="text-muted-foreground mt-1">
         Buyurtmalarni va clientlarni barchasini koring
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Barcha buyurtmalar</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mahsulot id</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Mahsulotlar</TableHead>
                <TableHead>Narxi</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Harakat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.fullName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {order.OrderItem?.map((item) => (
                        <span
                          key={item.id}
                          className="text-sm text-muted-foreground"
                        >
                          {item.Product?.name_uz} {item.quantity} ta
                        </span>
                      )) || (
                        <span className="text-sm text-muted-foreground">
                          Mahsulotlar yoq
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">
                    {(order.totalPrice ?? 0).toLocaleString()} UZS
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(order.status || "pending")}
                    >
                      {order.status || "pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Eye / View button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {/* Delete button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>O'chirasizmi buyurtmani</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order {order.id}?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMutation.mutate(order.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.fullName} — {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {selectedOrder?.OrderItem?.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.Product?.name_uz}</span>
                <span>x{item.quantity}</span>
              </div>
            )) || <p>No products in this order.</p>}
            <div className="flex justify-between font-bold mt-2">
              <span>Total:</span>
              <span>
                {(selectedOrder?.totalPrice ?? 0).toLocaleString()} UZS
              </span>
            </div>
          </div>
          <DialogClose asChild>
            <Button className="mt-4 w-full">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
