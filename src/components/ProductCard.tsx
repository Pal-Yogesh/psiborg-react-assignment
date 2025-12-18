import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 animate-fade-in"
      onClick={onClick}
    >
      <div className="relative aspect-square bg-muted/30 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 capitalize text-xs font-medium"
        >
          {product.category}
        </Badge>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem] text-foreground group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{product.rating.rate}</span>
            <span className="text-xs">({product.rating.count})</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
