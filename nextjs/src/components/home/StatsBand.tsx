const stats = [
  { value: "40+",       label: "Years of German Engineering" },
  { value: "350k+",     label: "Customers Worldwide" },
  { value: "2-Year",    label: "Machine Warranty" },
  { value: "Since '07", label: "Exclusive SA Distributor" },
];

const StatsBand = () => {
  return (
    <section className="trust-strip border-y border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-stretch divide-x divide-border overflow-x-auto">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="trust-strip__stat flex min-w-[140px] flex-1 flex-col items-center justify-center px-6 py-8 text-center"
            >
              <span className="font-heading text-3xl font-bold tracking-tight text-primary">
                {stat.value}
              </span>
              <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-copy-muted">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBand;
