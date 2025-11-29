import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from "@/service/materialApi";
import axios from "axios";
import { API } from "@/hooks/getEnv";

interface Material {
  id: string;
  productId: string;
  product: {
    name_uz: string;
    name_ru: string;
    name_en: string;
  };

  name_uz: string;
  name_en: string;
  name_ru: string;
}

export default function Materials() {
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });

  const [form, setForm] = useState({
    productId: "",
    name_uz: "",
    name_en: "",
    name_ru: "",
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: getMaterials,
  });

  const { data: productList } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const res = await axios.get(`${API}/products`);

      return res.data.items;
    },
  });

  const createMutation = useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      toast.success("Material qo'shildi");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Create error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: any) => updateMaterial(id, body),
    onSuccess: () => {
      toast.success("Material yangilandi");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Update error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      toast.success("O'chirildi");
      queryClient.invalidateQueries({ queryKey: ["materials"] });
    },
    onError: (err) => {
      toast.error("Delete error"), console.log("error", err);
    },
  });

  const handleSubmit = () => {
    const body = {
      productId: form.productId,
      name_uz: form.name_uz,
      name_en: form.name_en,
      name_ru: form.name_ru,
    };

    if (editingMaterial) {
      updateMutation.mutate({ id: editingMaterial.id, body });
    } else {
      createMutation.mutate(body);
    }
  };

  const handleEdit = (m: Material) => {
    setEditingMaterial(m);
    setForm({
      productId: m.productId,
      name_uz: m.name_uz,
      name_en: m.name_en,
      name_ru: m.name_ru,
    });
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingMaterial(null);
    setForm({
      productId: "",
      name_uz: "",
      name_en: "",
      name_ru: "",
    });
    setIsDialogOpen(true);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materials</h1>
          <p className="text-muted-foreground mt-1">
            Manage materials used in products
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Material
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMaterial ? "Edit Material" : "Add New Material"}
              </DialogTitle>
              <DialogDescription>
                Specify the material details for a product
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select
                  value={form.productId}
                  onValueChange={(v) => setForm({ ...form, productId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>

                  <SelectContent>
                    {productList?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name_uz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Material Name (Uzbek)</Label>
                <Input
                  value={form.name_uz}
                  onChange={(e) =>
                    setForm({ ...form, name_uz: e.target.value })
                  }
                  placeholder="Material nomi"
                />
              </div>

              <div className="space-y-2">
                <Label>Material Name (English)</Label>
                <Input
                  value={form.name_en}
                  onChange={(e) =>
                    setForm({ ...form, name_en: e.target.value })
                  }
                  placeholder="Material name"
                />
              </div>

              <div className="space-y-2">
                <Label>Material Name (Russian)</Label>
                <Input
                  value={form.name_ru}
                  onChange={(e) =>
                    setForm({ ...form, name_ru: e.target.value })
                  }
                  placeholder="Название материала"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingMaterial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={confirmDelete.open}
          onOpenChange={(o) => setConfirmDelete({ open: o, id: null })}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ishonchingiz komilmi ?</DialogTitle>
              <DialogDescription>O'chirishni xohlaysizmi</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDelete({ open: false, id: null })}
              >
                Bekor qilish
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  if (confirmDelete.id) {
                    deleteMutation.mutate(confirmDelete.id);
                  }
                  setConfirmDelete({ open: false, id: null });
                }}
              >
                Ha o'chiraman
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material: Material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{material.name_en}</CardTitle>
              <p className="text-sm text-muted-foreground">
                mahsulot nomi: {material.product.name_uz}
              </p>
            </CardHeader>

            <CardContent className="space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Uzbek</p>
                <p className="text-sm font-medium">{material.name_uz}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Russian</p>
                <p className="text-sm font-medium">{material.name_ru}</p>
              </div>
            </CardContent>

            <CardFooter className="gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={() => handleEdit(material)}
              >
                <Pencil className="w-3 h-3" />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="flex-1 gap-2"
                onClick={() =>
                  setConfirmDelete({ open: true, id: material.id })
                }
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
