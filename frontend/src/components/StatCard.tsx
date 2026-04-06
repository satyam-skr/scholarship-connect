import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  change?: number;
}

const StatCard = ({ title, value, description, icon, change }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      {icon && <span className="text-primary">{icon}</span>}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold font-heading">{value}</div>
      {change !== undefined && (
        <p className={`text-xs mt-1 ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
          {change >= 0 ? '+' : ''}{change}% from last month
        </p>
      )}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </CardContent>
  </Card>
);

export default StatCard;
