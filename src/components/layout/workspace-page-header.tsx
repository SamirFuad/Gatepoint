export function WorkspacePageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="workspace-page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div>{children}</div>}
    </header>
  );
}
