import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calculator,
  MagnifyingGlass,
  Trash,
  ArrowRight,
  Plus,
  Buildings,
  User,
} from 'phosphor-react';
import { useSavedCalculations } from '@/hooks/useSavedCalculations';
import { formatCurrency } from '@/lib/formatCurrency';
import type { SavedCalculation } from '@/types/database';

export default function SavedCalculations() {
  const navigate = useNavigate();
  const { calculations, isLoading, isConfigured, deleteCalculation } = useSavedCalculations();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredCalculations = calculations?.filter((calc) =>
    calc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this calculation?')) {
      setDeletingId(id);
      await deleteCalculation(id);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          Saved Calculations
        </h1>
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Calculator weight="duotone" className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Database Not Configured</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            To save calculations, configure your Supabase credentials in the .env.local file.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
          Saved Calculations
        </h1>
        <Button onClick={() => navigate('/')}>
          <Plus weight="bold" className="h-4 w-4 mr-2" />
          New Calculation
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlass
          weight="bold"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />
        <Input
          placeholder="Search calculations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Calculations list */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
                <div className="h-10 w-20 bg-muted rounded" />
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCalculations && filteredCalculations.length > 0 ? (
        <div className="grid gap-4">
          {filteredCalculations.map((calc) => (
            <CalculationCard
              key={calc.id}
              calculation={calc}
              onDelete={handleDelete}
              isDeleting={deletingId === calc.id}
              formatDate={formatDate}
              onClick={() => navigate(`/dashboard/calculations/${calc.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            {searchQuery ? (
              <MagnifyingGlass weight="duotone" className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Calculator weight="duotone" className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <h3 className="font-semibold mb-1">
            {searchQuery ? 'No results found' : 'No saved calculations'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchQuery
              ? 'Try a different search term'
              : 'Run a tax comparison and save it to see it here'}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate('/')}>
              <Plus weight="bold" className="h-4 w-4 mr-2" />
              New Calculation
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

interface CalculationCardProps {
  calculation: SavedCalculation;
  onDelete: (id: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
  formatDate: (date: string) => string;
  onClick: () => void;
}

function CalculationCard({
  calculation,
  onDelete,
  isDeleting,
  formatDate,
  onClick,
}: CalculationCardProps) {
  const { name, inputs, results, created_at } = calculation;

  const RecommendedIcon = results.recommendation === 'sdn-bhd' ? Buildings : User;

  return (
    <Card
      className="p-6 cursor-pointer hover:border-foreground/20 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{name}</h3>
            {results.recommendation !== 'neutral' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs">
                <RecommendedIcon weight="fill" className="h-3 w-3" />
                {results.recommendation === 'sdn-bhd' ? 'Sdn Bhd' : 'Enterprise'}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Profit: {formatCurrency(inputs.businessProfit)}
            {inputs.directorSalary > 0 && ` • Salary: ${formatCurrency(inputs.directorSalary)}`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(created_at)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right mr-2">
            <div className="font-semibold">{formatCurrency(Math.abs(results.taxSavings))}</div>
            <div className="text-xs text-muted-foreground">
              {results.taxSavings > 0 ? 'Sdn Bhd saves' : 'Enterprise saves'}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => onDelete(calculation.id, e)}
            disabled={isDeleting}
          >
            <Trash weight="bold" className="h-4 w-4" />
          </Button>

          <ArrowRight weight="bold" className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}
