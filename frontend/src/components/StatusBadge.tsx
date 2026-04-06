import { Badge } from '@/components/ui/badge';

type Status = 'pending' | 'approved' | 'rejected' | 'under_review' | 'confirmed' | 'completed' | 'failed' | 'open' | 'closed' | 'awarded' | 'verified' | 'active' | 'graduated' | 'suspended' | 'in_progress';

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/15 text-warning border-warning/30',
  under_review: 'bg-info/15 text-info border-info/30',
  approved: 'bg-success/15 text-success border-success/30',
  verified: 'bg-success/15 text-success border-success/30',
  completed: 'bg-success/15 text-success border-success/30',
  confirmed: 'bg-info/15 text-info border-info/30',
  active: 'bg-success/15 text-success border-success/30',
  open: 'bg-info/15 text-info border-info/30',
  awarded: 'bg-primary/15 text-primary border-primary/30',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
  failed: 'bg-destructive/15 text-destructive border-destructive/30',
  closed: 'bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30',
  graduated: 'bg-primary/15 text-primary border-primary/30',
  suspended: 'bg-destructive/15 text-destructive border-destructive/30',
  in_progress: 'bg-info/15 text-info border-info/30',
};

const StatusBadge = ({ status }: { status: Status }) => (
  <Badge variant="outline" className={`capitalize text-xs ${statusStyles[status] || ''}`}>
    {status.replace('_', ' ')}
  </Badge>
);

export default StatusBadge;
