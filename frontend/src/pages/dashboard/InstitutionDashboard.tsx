import { useEffect, useState } from 'react';
import { institutionService } from '@/services/institutionService';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';

const InstitutionDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      institutionService.getEnrolledStudents(),
      institutionService.getTotalReceivedFunds(),
    ]).then(([studs, funds]) => {
      setStudents(studs);
      setTotalFunds(funds);
      setLoading(false);
    });
  }, []);

  const handleVerify = async (studentId: string) => {
    await institutionService.verifyEnrollment(studentId);
    toast({ title: 'Enrollment verified', description: `Student ${studentId} enrollment confirmed.` });
  };

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Institution Dashboard</h1>
          <p className="text-muted-foreground text-sm">Verify enrollment and track funds</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Enrolled Students" value={students.length} />
          <StatCard title="Total Funds Received" value={`$${totalFunds.toLocaleString()}`} />
          <StatCard title="Pending Verifications" value={2} />
          <StatCard title="Documents to Review" value={3} />
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Student Enrollment</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Field of Study</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Funds</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.fieldOfStudy}</TableCell>
                    <TableCell>{s.gpa}</TableCell>
                    <TableCell><StatusBadge status={s.enrollmentStatus} /></TableCell>
                    <TableCell>${s.receivedFunds.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleVerify(s.id)}>Verify</Button>
                        <Button size="sm" variant="outline" className="text-xs h-7">Upload Proof</Button>
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

export default InstitutionDashboard;
