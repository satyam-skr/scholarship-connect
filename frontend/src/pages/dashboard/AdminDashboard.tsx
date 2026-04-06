import { useEffect, useState } from 'react';
import { adminService } from '@/services/adminService';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Application, Student, FundAllocation } from '@/types';

const COLORS = ['hsl(152,56%,40%)', 'hsl(210,80%,55%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalFunds, setTotalFunds] = useState(0);
  const [studentsSupported, setStudentsSupported] = useState(0);
  const [allocations, setAllocations] = useState<FundAllocation[]>([]);

  useEffect(() => {
    Promise.all([
      adminService.getAllStudents(),
      adminService.getAllApplications(),
      adminService.getTotalFundsDistributed(),
      adminService.getStudentsSupported(),
      adminService.getFundAllocations(),
    ]).then(([studs, apps, funds, supported, allocs]) => {
      setStudents(studs);
      setApplications(apps);
      setTotalFunds(funds);
      setStudentsSupported(supported);
      setAllocations(allocs);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage students and fund allocations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Funds Distributed" value={`$${totalFunds.toLocaleString()}`} change={15} />
          <StatCard title="Students Supported" value={studentsSupported} change={10} />
          <StatCard title="Pending Applications" value={applications.filter(a => a.status === 'pending' || a.status === 'under_review').length} />
          <StatCard title="Total Students" value={students.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Fund Allocation by Field</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={allocations}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,90%)" />
                  <XAxis dataKey="category" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="amount" fill="hsl(152,56%,40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Distribution Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={allocations} dataKey="amount" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`} fontSize={11}>
                    {allocations.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend fontSize={12} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Applications</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Scholarship</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.studentName}</TableCell>
                    <TableCell>{app.scholarshipTitle}</TableCell>
                    <TableCell className="text-sm">{app.submittedAt}</TableCell>
                    <TableCell><StatusBadge status={app.status} /></TableCell>
                    <TableCell>
                      {(app.status === 'pending' || app.status === 'under_review') && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="text-xs h-7">Approve</Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-destructive">Reject</Button>
                        </div>
                      )}
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

export default AdminDashboard;
