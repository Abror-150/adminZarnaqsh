import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = "https://api.zarnaqsh.uz";

interface Product {
  id?: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
  description_uz: string;
  description_en: string;
  description_ru: string;
  amount: number;
  price: number;
  image: string;
}

export default function Products() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({
    name_uz: "",
    name_en: "",
    name_ru: "",
    description_uz: "",
    description_en: "",
    description_ru: "",
    amount: 0,
    price: 0,
    image: "",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(`${API}/products?page=1&limit=100`);
      return res.data.items as Product[];
    },
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: async (body: any) => axios.post(`${API}/products`, body),
    onSuccess: () => {
      toast.success("Mahsulot yaratildi");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Xatolik!"),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: async (body: any) => {
      if (!editingProduct?.id) throw new Error("Mahsulot tanlanmagan!");
      return axios.patch(`${API}/products/${editingProduct.id}`, body);
    },
    onSuccess: () => {
      toast.success("Mahsulot yangilandi");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Xatolik!"),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => axios.delete(`${API}/products/${id}`),
    onSuccess: () => {
      toast.success("Mahsulot o‘chirildi");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Xatolik!"),
  });

  const openCreate = () => {
    setEditingProduct(null);
    setFormData({
      name_uz: "",
      name_en: "",
      name_ru: "",
      description_uz: "",
      description_en: "",
      description_ru: "",
      amount: 0,
      price: 0,
      image: "",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleImageChange = async (file: File) => {
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await axios.post(`${API}/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({ ...formData, image: res.data.compressed });
    } catch {
      toast.error("Rasm yuklashda xatolik!");
    }
  };

  const handleSubmit = async () => {
    if (!formData.image) return toast.error("Rasm tanlanmagan!");

    if (editingProduct?.id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mahsulotlar</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" /> Mahsulot qo‘shish
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct
                  ? "Mahsulotni o‘zgartirish"
                  : "Mahsulot qo‘shish"}
              </DialogTitle>
              <DialogDescription>Ma’lumotlarni kiriting</DialogDescription>
            </DialogHeader>

            {/* FORM */}
            <div className="space-y-3 py-4">
              {(
                [
                  ["name_uz", "Name (Uz)"],
                  ["name_en", "Name (En)"],
                  ["name_ru", "Name (Ru)"],
                  ["description_uz", "Description (Uz)", "textarea"],
                  ["description_en", "Description (En)", "textarea"],
                  ["description_ru", "Description (Ru)", "textarea"],
                ] as any
              ).map(([key, label, type]: any) => (
                <div key={key} className="space-y-1">
                  <Label>{label}</Label>
                  {type === "textarea" ? (
                    <Textarea
                      value={(formData as any)[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                    />
                  ) : (
                    <Input
                      value={(formData as any)[key]}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                    />
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Miqdori</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Narxi</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rasm</Label>
                {formData.image && (
                  <img
                    src={formData.image}
                    className="w-40 h-40 object-cover rounded border"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    handleImageChange(file);
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleSubmit}>
                {editingProduct ? "Yangilash" : "Yaratish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Qidirish..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader className="p-0">
              <img src={product.image} className="w-full h-48 object-cover" />
            </CardHeader>

            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold">{product.name_uz}</h3>
              <p className="text-sm text-muted-foreground">
                {product.description_uz}
              </p>

              <div className="flex justify-between pt-2">
                <Badge>{product.amount} dona</Badge>
                <span className="font-bold">
                  {product.price.toLocaleString()} UZS
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => openEdit(product)}
              >
                <Pencil className="w-4 h-4" /> O‘zgartirish
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => setDeleteId(product.id!)}
              >
                <Trash2 className="w-4 h-4" /> O‘chirish
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mahsulotni o‘chirish</DialogTitle>
            <DialogDescription>
              Haqiqatan ham o‘chirmoqchimisiz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Yo‘q
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) deleteMutation.mutate(deleteId);
                setDeleteId(null);
              }}
            >
              Ha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
