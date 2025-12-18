import React, { useState } from 'react';
import { Product } from '@/types/product';
import { useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Star, Edit2, Trash2, X, Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
  });
  
  const { toast } = useToast();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleEdit = () => {
    if (product) {
      setEditForm({
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        category: product.category,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ title: '', price: '', description: '', category: '' });
  };

  const handleSave = async () => {
    if (!product) return;

    const priceNum = parseFloat(editForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data: {
          title: editForm.title,
          price: priceNum,
          description: editForm.description,
          category: editForm.category,
        },
      });

      toast({
        title: 'Product updated',
        description: 'The product has been successfully updated.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Failed to update the product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteMutation.mutateAsync(product.id);
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully removed.',
      });
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: 'Failed to delete the product. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setEditForm({ title: '', price: '', description: '', category: '' });
    onClose();
  };

  if (!product) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>{product.title}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Product Image */}
            <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain p-6"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {isEditing ? (
                // Edit Form
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Input
                      id="edit-category"
                      value={editForm.category}
                      onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="flex-1"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                  
                  <h2 className="text-xl font-bold text-foreground">
                    {product.title}
                  </h2>
                  
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{product.rating.rate}</span>
                      <span className="text-sm text-muted-foreground">
                        ({product.rating.count} reviews)
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                      Description
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleEdit} className="flex-1">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Product
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductDetailModal;
