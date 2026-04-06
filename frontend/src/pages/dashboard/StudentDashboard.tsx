import { useEffect, useState } from 'react';
import { studentService } from '@/services/studentService';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Application, Student } from '@/types';

const StudentDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [funds, setFunds] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      studentService.getStudent(user.id),
      studentService.getApplications(user.id),
      studentService.getReceivedFunds(user.id),
    ]).then(([s, apps, f]) => {
      setStudent(s ?? null);
      setApplications(apps);
      setFunds(f);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;
  if (!student) return <DashboardLayout><EmptyState title="Student not found" /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your scholarships and progress</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Applications" value={applications.length} />
          <StatCard title="Approved" value={applications.filter(a => a.status === 'approved').length} />
          <StatCard title="Funds Received" value={`$${funds.toLocaleString()}`} />
          <StatCard title="Current GPA" value={student.gpa} />
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <EmptyState title="No applications yet" description="Browse scholarships to apply" />
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{app.scholarshipTitle}</p>
                      <p className="text-xs text-muted-foreground">Submitted {app.submittedAt}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {student.documents.length === 0 ? (
                <EmptyState title="No documents" description="Upload your documents to proceed" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium text-sm">{doc.name}</TableCell>
                        <TableCell className="capitalize text-sm">{doc.type.replace('_', ' ')}</TableCell>
                        <TableCell><StatusBadge status={doc.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <Button variant="outline" size="sm" className="mt-3">Upload Document</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Academic Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.academicProgress.map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{p.semester}</p>
                      <p className="text-xs text-muted-foreground">{p.credits} credits</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{p.gpa} GPA</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
