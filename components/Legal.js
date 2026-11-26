export function LegalShell({ title, updated, children }) {
  return (
    <>
      <section className="hero small"><div className="wrap"><div><h1>{title}</h1><p className="fine">Last updated {updated}</p></div></div></section>
      <div className="narrow content"><div className="prose">{children}</div></div>
    </>
  );
}
