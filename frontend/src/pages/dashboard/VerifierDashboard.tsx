import { useEffect, useState } from 'react';
import { verifierService } from '@/services/verifierService';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Milestone, Document } from '@/types';
import { useToast } from '@/hooks/use-toast';

const VerifierDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [pendingDocs, setPendingDocs] = useState<(Document & { studentName: string })[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      verifierService.getAllMilestones(),
      verifierService.getPendingDocuments(),
    ]).then(([ms, docs]) => {
      setMilestones(ms);
      setPendingDocs(docs);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (id: string) => {
    await verifierService.approveMilestone(id);
    toast({ title: 'Milestone approved' });
  };

  const handleRelease = async (id: string) => {
    const result = await verifierService.releaseFunds(id);
    toast({ title: 'Funds released', description: `TX: ${result.txHash}` });
  };

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Verifier Dashboard</h1>
          <p className="text-muted-foreground text-sm">Review documents and manage milestones</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Pending Milestones" value={milestones.filter(m => m.status === 'pending').length} />
          <StatCard title="Approved" value={milestones.filter(m => m.status === 'approved').length} />
          <StatCard title="Pending Documents" value={pendingDocs.length} />
          <StatCard title="Total Reviewed" value={milestones.length} />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Milestones</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {milestones.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.studentName}</TableCell>
                    <TableCell className="text-sm">{m.description}</TableCell>
                    <TableCell>${m.amount.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell>
                      {m.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleApprove(m.id)}>Approve</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleRelease(m.id)}>Release Funds</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pending Documents</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDocs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.studentName}</TableCell>
                    <TableCell>{doc.name}</TableCell>
                    <TableCell className="capitalize text-sm">{doc.type.replace('_', ' ')}</TableCell>
                    <TableCell className="text-sm">{doc.uploadedAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs h-7">Verify</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 text-destructive">Reject</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VerifierDashboard;
