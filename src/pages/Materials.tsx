import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Material {
  id: string;
  productId: string;
  productName: string;
  name_uz: string;
  name_en: string;
  name_ru: string;
}

const mockMaterials: Material[] = [
  {
    id: "1",
    productId: "1",
    productName: "Silver Ring",
    name_uz: "925 Kumush",
    name_en: "925 Silver",
    name_ru: "925 Серебро",
  },
  {
    id: "2",
    productId: "2",
    productName: "Gold Necklace",
    name_uz: "18k Oltin",
    name_en: "18k Gold",
    name_ru: "18k Золото",
  },
];

export default function Materials() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  const handleDelete = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id));
    toast.success("Material deleted successfully");
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setIsDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingMaterial(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Materials</h1>
          <p className="text-muted-foreground mt-1">Manage materials used in products</p>
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
              <DialogTitle>{editingMaterial ? "Edit Material" : "Add New Material"}</DialogTitle>
              <DialogDescription>
                Specify the material details for a product
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Product</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Silver Ring</SelectItem>
                    <SelectItem value="2">Gold Necklace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Material Name (Uzbek)</Label>
                <Input placeholder="Material nomi" />
              </div>
              <div className="space-y-2">
                <Label>Material Name (English)</Label>
                <Input placeholder="Material name" />
              </div>
              <div className="space-y-2">
                <Label>Material Name (Russian)</Label>
                <Input placeholder="Название материала" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast.success(editingMaterial ? "Material updated" : "Material added");
                setIsDialogOpen(false);
              }}>
                {editingMaterial ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{material.name_en}</CardTitle>
              <p className="text-sm text-muted-foreground">For: {material.productName}</p>
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
                onClick={() => handleDelete(material.id)}
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
