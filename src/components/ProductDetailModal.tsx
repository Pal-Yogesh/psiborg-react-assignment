import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
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
import { Star, Edit2, Trash2, X, Loader2, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
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
  
  // Fetch product details only when modal is open and productId is available
  const { 
    data: product, 
    isLoading, 
    isError,
    error 
  } = useProduct(productId || 0, isOpen && productId !== null);

  // Reset editing state when modal opens with a new product
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
      setEditForm({ title: '', price: '', description: '', category: '' });
    }
  }, [isOpen, productId]);

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

    // Validate title
    if (!editForm.title.trim()) {
      toast({
        title: 'Invalid title',
        description: 'Please enter a product title',
        variant: 'destructive',
      });
      return;
    }

    // Validate price
    const priceNum = parseFloat(editForm.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: 'Invalid price',
        description: 'Please enter a valid price greater than 0',
        variant: 'destructive',
      });
      return;
    }

    // Validate description
    if (!editForm.description.trim()) {
      toast({
        title: 'Invalid description',
        description: 'Please enter a product description',
        variant: 'destructive',
      });
      return;
    }

    // Validate category
    if (!editForm.category.trim()) {
      toast({
        title: 'Invalid category',
        description: 'Please enter a product category',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: product.id,
        data: {
          title: editForm.title.trim(),
          price: priceNum,
          description: editForm.description.trim(),
          category: editForm.category.trim(),
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
      // Close both modals immediately for instant feedback
      setShowDeleteConfirm(false);
      onClose();
      
      // Execute deletion in background (optimistic update already removes from UI)
      await deleteMutation.mutateAsync(product.id);
      
      toast({
        title: 'Product deleted',
        description: 'The product has been successfully removed.',
      });
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

  // Don't render modal if productId is null
  if (!isOpen || productId === null) {
    return null;
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sr-only">
            <DialogTitle>{product?.title || 'Product Details'}</DialogTitle>
          </DialogHeader>
          
          {/* Loading State */}
          {(isLoading || !product) && !isError && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Failed to load product
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                {error instanceof Error ? error.message : 'Could not fetch product details. Please try again.'}
              </p>
              <Button onClick={handleClose} variant="outline">
                Close
              </Button>
            </div>
          )}

          {/* Product Content */}
          {!isLoading && !isError && product && (
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
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product?.title || 'this product'}"? This action cannot be undone.
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
