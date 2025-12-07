export default function ComplexDashboardLayout({
  children,
  users,
  revenue,
}: {
  children: React.ReactNode;
  users: React.ReactNode;
  revenue: React.ReactNode;
}) {
  return (
    <div>
      <div>{children}</div>
      <div>{users}</div>
      <div>{revenue}</div>
    </div>
  );
}
