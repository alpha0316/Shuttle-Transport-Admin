import { useMemo, useState } from 'react';
import { Wrench } from '@phosphor-icons/react';
import TopHeader from '../components/TopHeader';
import { DataTable } from '../components/DataTable';
import { FilterBar } from '../components/FilterBar';
import { StatCard, StatCardGroup } from '../components/StatCard';
import TopVehiclesByCostCard from '../components/TopVehiclesByCostCard';
import {
  MOCK_EXPENSE_DATA,
  MOCK_EXPENSE_COLUMNS,
  expenseRowActions,
  MOCK_EXPENSE_KPIS,
  EXPENSE_FILTER_OPTIONS,
  MOCK_EXPENSE_CATEGORIES,
  MOCK_TOP_VEHICLES_BY_COST,
} from '../mockData/index';

function Maintenance() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredData = useMemo(() => {
    let d = MOCK_EXPENSE_DATA;
    if (filter !== 'all') d = d.filter(r => r.category === filter);
    if (search) d = d.filter(r => r.vehicle.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()));
    return d;
  }, [search, filter]);

  const categoryTotal = MOCK_EXPENSE_CATEGORIES.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="flex flex-col w-full h-full">
      <TopHeader icon={<Wrench size={14} color="black" weight="duotone" />} title="Maintenance Overview" pageKey="maintenance" />
      <div className="flex-1 overflow-y-auto p-6">
        <StatCardGroup>
          <StatCard label={MOCK_EXPENSE_KPIS.totalExpenses.label} value={MOCK_EXPENSE_KPIS.totalExpenses.value} sub={MOCK_EXPENSE_KPIS.totalExpenses.sub} />
          <StatCard label={MOCK_EXPENSE_KPIS.fuelCosts.label} value={MOCK_EXPENSE_KPIS.fuelCosts.value} sub={MOCK_EXPENSE_KPIS.fuelCosts.sub} accent="text-blue-700" />
          <StatCard label={MOCK_EXPENSE_KPIS.maintenanceRepairs.label} value={MOCK_EXPENSE_KPIS.maintenanceRepairs.value} sub={MOCK_EXPENSE_KPIS.maintenanceRepairs.sub} accent="text-yellow-600" />
          <StatCard label={MOCK_EXPENSE_KPIS.avgPerVehicle.label} value={MOCK_EXPENSE_KPIS.avgPerVehicle.value} sub={MOCK_EXPENSE_KPIS.avgPerVehicle.sub} accent="text-green-700" />
        </StatCardGroup>

        {/* Category breakdown + Top vehicles by cost */}
        <div className="flex gap-4 mt-6">
          <div className="flex-1 min-w-0 bg-white rounded-2xl border border-black/5 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-black text-left mb-4">Spend by Category</h3>
            <div className="flex flex-col gap-4">
              {MOCK_EXPENSE_CATEGORIES.map((c) => (
                <div key={c.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-black/70 font-medium">{c.label}</span>
                    <span className="text-black/50">₵{c.amount.toLocaleString()} · {Math.round((c.amount / categoryTotal) * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${(c.amount / categoryTotal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <TopVehiclesByCostCard data={MOCK_TOP_VEHICLES_BY_COST} />
          </div>
        </div>

        {/* Recent expenses */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-black mb-3">Recent Expenses</h3>
          <FilterBar
            searchPlaceholder="Search"
            onSearch={setSearch}
            filterLabel={EXPENSE_FILTER_OPTIONS.find(o => o.value === filter)?.label || 'All Categories'}
            filterOptions={EXPENSE_FILTER_OPTIONS}
            activeFilter={filter}
            onFilterChange={setFilter}
          />
          <DataTable
            columns={MOCK_EXPENSE_COLUMNS}
            data={filteredData}
            rowKey={(r) => r.id}
            rowActions={expenseRowActions}
            emptyMessage="No expenses found."
          />
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
