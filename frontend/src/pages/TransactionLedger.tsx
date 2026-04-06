import { useEffect, useState } from 'react';
import { transactionService } from '@/services/transactionService';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction } from '@/types';

const TransactionLedger = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    transactionService.getAll().then((txs) => {
      setTransactions(txs);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Transaction Ledger</h1>
          <p className="text-muted-foreground text-sm">Immutable record of all platform transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Blockchain Ledger
            </CardTitle>
            <CardDescription>All transactions are recorded on-chain for full transparency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TX Hash</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-xs text-primary">{tx.txHash}</TableCell>
                      <TableCell className="capitalize text-xs">{tx.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-sm">{tx.donor}</TableCell>
                      <TableCell className="text-sm">{tx.student}</TableCell>
                      <TableCell className="font-medium">${tx.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{tx.blockNumber ?? '—'}</TableCell>
                      <TableCell><StatusBadge status={tx.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TransactionLedger;
