import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

interface Product {
  id: string;
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

const mockProducts: Product[] = [
  {
    id: "1",
    name_uz: "Kumush Halqa",
    name_en: "Silver Ring",
    name_ru: "Серебряное кольцо",
    description_uz: "Qo'lda ishlangan kumush halqa",
    description_en: "Handmade silver ring",
    description_ru: "Ручное серебряное кольцо",
    amount: 15,
    price: 129000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
  },
  {
    id: "2",
    name_uz: "Oltin Marjon",
    name_en: "Gold Necklace",
    name_ru: "Золотое ожерелье",
    description_uz: "Noyob toshlar bilan bezatilgan",
    description_en: "Decorated with precious stones",
    description_ru: "Украшено драгоценными камнями",
    amount: 8,
    price: 450000,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
  },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name_uz.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name_ru.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your jewelry collection</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                Fill in the product details in all languages
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name (Uzbek)</Label>
                <Input placeholder="Mahsulot nomi" />
              </div>
              <div className="space-y-2">
                <Label>Name (English)</Label>
                <Input placeholder="Product name" />
              </div>
              <div className="space-y-2">
                <Label>Name (Russian)</Label>
                <Input placeholder="Название продукта" />
              </div>
              <div className="space-y-2">
                <Label>Description (Uzbek)</Label>
                <Textarea placeholder="Tavsif" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Description (English)</Label>
                <Textarea placeholder="Description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Description (Russian)</Label>
                <Textarea placeholder="Описание" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="50" />
                </div>
                <div className="space-y-2">
                  <Label>Price (UZS)</Label>
                  <Input type="number" placeholder="129000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input placeholder="https://example.com/image.png" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success(editingProduct ? "Product updated" : "Product added");
                setIsDialogOpen(false);
              }}>
                {editingProduct ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={product.image}
                alt={product.name_en}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-foreground">{product.name_en}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description_en}
              </p>
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary" className="font-mono">
                  {product.amount} in stock
                </Badge>
                <span className="text-lg font-bold text-primary">
                  {product.price.toLocaleString()} UZS
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleDelete(product.id)}
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
