import { useDashboardUserRoleStats } from "@/hooks/useDashboardUsers";

export const QuickRoleStats = () => {
  const { data, isLoading, error } = useDashboardUserRoleStats();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="font-semibold mb-3">User Role Statistics</h3>
      <div className="space-y-2">
        <div>Total Users: <strong>{data?.totalUsers}</strong></div>
        {data?.roleStats && Object.entries(data.roleStats).map(([role, count]) => (
          <div key={role} className="flex justify-between">
            <span>{role}:</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
