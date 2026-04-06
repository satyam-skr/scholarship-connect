import { useEffect, useState } from 'react';
import { donorService } from '@/services/donorService';
import { useAuthStore } from '@/store/authStore';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Donation, Scholarship, Student } from '@/types';

const COLORS = ['hsl(152,56%,40%)', 'hsl(210,80%,55%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)'];

const DonorDashboard = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [totalDonated, setTotalDonated] = useState(0);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [studentsFunded, setStudentsFunded] = useState<Student[]>([]);
  const [donationsOverTime, setDonationsOverTime] = useState<{ month: string; amount: number }[]>([]);
  const [byField, setByField] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      donorService.getTotalDonated(user.id),
      donorService.getScholarships(user.id),
      donorService.getStudentsFunded(user.id),
      donorService.getDonationsOverTime(user.id),
      donorService.getDonationsByField(user.id),
    ]).then(([total, schs, studs, timeline, fields]) => {
      setTotalDonated(total);
      setScholarships(schs);
      setStudentsFunded(studs);
      setDonationsOverTime(timeline);
      setByField(fields);
      setLoading(false);
    });
  }, [user]);

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Donor Dashboard</h1>
          <p className="text-muted-foreground text-sm">Track your impact and contributions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Donated" value={`$${totalDonated.toLocaleString()}`} change={12} />
          <StatCard title="Active Scholarships" value={scholarships.filter(s => s.status === 'open').length} />
          <StatCard title="Students Funded" value={studentsFunded.length} change={8} />
          <StatCard title="Scholarships Created" value={scholarships.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Donations Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={donationsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140,15%,90%)" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="hsl(152,56%,40%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Distribution by Field</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={byField} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} fontSize={11}>
                    {byField.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend fontSize={12} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Students Funded</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsFunded.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.institution}</TableCell>
                    <TableCell>{s.fieldOfStudy}</TableCell>
                    <TableCell>{s.gpa}</TableCell>
                    <TableCell>${s.receivedFunds.toLocaleString()}</TableCell>
                    <TableCell><StatusBadge status={s.enrollmentStatus} /></TableCell>
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

export default DonorDashboard;
