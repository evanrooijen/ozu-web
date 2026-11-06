import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  Globe2,
  MousePointer2,
  Users,
  Zap,
} from "lucide-react";

const dailyVisitors = [
  290, 380, 310, 470, 420, 350, 390, 550, 480, 430, 610, 520, 460, 590, 710,
  620, 530, 640, 580, 760, 690, 630, 820, 710, 650, 780, 690, 870, 740, 810,
  930,
];

export default function Home() {
  // Server-rendered calendar period for the placeholder report.
  // oxlint-disable-next-line react/purity
  const now = new Date();
  const month = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const days = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const monthName = month.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const shortMonth = month.toLocaleDateString("en-US", { month: "short" });
  const values = dailyVisitors.slice(0, days);
  const total = values.reduce((sum, count) => sum + count, 0);
  const csv = `Date,Visitors\n${values.map((value, i) => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")},${value}`).join("\n")}`;

  return (
    <div className="analytics-app">
      <header className="app-header">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <ChartNoAxesCombined size={21} />
          </span>
          insight<span className="brand-dot">.</span>
        </Link>
        <span className="workspace">
          <Globe2 size={15} /> My website <span className="workspace-dot" />{" "}
          <span>Workspace</span>
        </span>
        <div className="avatar" aria-label="My workspace">
          JD
        </div>
      </header>
      <main className="dashboard">
        <div className="breadcrumb">
          Workspace <span>/</span> Overview
        </div>
        <div className="page-heading">
          <div>
            <div className="eyebrow">YOUR WEBSITE AT A GLANCE</div>
            <h1>Visitor overview</h1>
            <p>A little insight into the people stopping by.</p>
          </div>
          <a
            className="export-button"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
            download="monthly-visitors-sample.csv"
          >
            <ArrowDownToLine size={16} /> Export report
          </a>
        </div>
        <div className="toolbar">
          <div className="tab">
            <ChartNoAxesCombined size={16} /> Overview
          </div>
          <div className="date-pill">
            <CalendarDays size={15} /> Last month{" "}
            <span className="date-divider" /> {monthName}
          </div>
        </div>
        <section className="stats-grid" aria-label="Monthly visitor summary">
          <article className="stat-card primary-stat">
            <div className="stat-label">
              Total visitors{" "}
              <span className="stat-icon">
                <Users size={18} />
              </span>
            </div>
            <div className="stat-number">
              {total.toLocaleString("en-US")}
              <svg
                className="sparkline"
                viewBox="0 0 120 40"
                aria-hidden="true"
              >
                <path d="M1 36 L12 29 L23 32 L34 19 L45 24 L56 16 L67 20 L78 8 L89 15 L100 6 L119 2" />
              </svg>
            </div>
            <div className="stat-foot">
              <span className="growth">
                <ArrowUpRight size={14} /> 18.6%
              </span>{" "}
              vs. previous month
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-label">
              Daily average{" "}
              <span className="stat-icon">
                <ChartNoAxesCombined size={18} />
              </span>
            </div>
            <div className="stat-number">
              {Math.round(total / days).toLocaleString("en-US")}
              <span className="stat-unit">visitors / day</span>
            </div>
            <div className="stat-foot">A steady stream of new perspectives</div>
          </article>
          <article className="stat-card">
            <div className="stat-label">
              Busiest day{" "}
              <span className="stat-icon">
                <Zap size={18} />
              </span>
            </div>
            <div className="stat-number">
              {shortMonth} {values.indexOf(Math.max(...values)) + 1}
              <span className="peak-pill">Peak</span>
            </div>
            <div className="stat-foot">
              <strong>{Math.max(...values)} visitors</strong> made it your
              busiest day
            </div>
          </article>
        </section>
        <section className="chart-card">
          <div className="chart-heading">
            <div>
              <h2>Visitors over time</h2>
              <p>Your daily visitor activity for {monthName}.</p>
            </div>
            <span className="chart-legend">
              <i /> Visitors
            </span>
          </div>
          <div
            className="chart"
            aria-label={`Sample daily visitor bar chart for ${monthName}`}
          >
            <div className="y-labels">
              {[1000, 750, 500, 250, 0].map((n) => (
                <span key={n}>{n.toLocaleString()}</span>
              ))}
            </div>
            <div className="plot">
              <div className="grid-lines">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div key={n} />
                ))}
              </div>
              <div className="bars">
                {values.map((value, index) => (
                  <div
                    className={`bar ${value === Math.max(...values) ? "peak-bar" : ""}`}
                    key={index}
                    style={{ height: `${value / 10}%` }}
                    title={`${shortMonth} ${index + 1}: ${value} visitors`}
                  />
                ))}
              </div>
              <div className="x-labels">
                {[1, 5, 10, 15, 20, 25, days].map((n) => (
                  <span key={n}>
                    {shortMonth} {n.toString().padStart(2, "0")}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="chart-footer">
            <span>
              <span className="small-dot" /> {days} days of activity
            </span>
            <span>Every visit is a new opportunity.</span>
          </div>
        </section>
        <aside className="sample-notice">
          <span className="notice-icon">
            <MousePointer2 size={19} />
          </span>
          <div>
            <h3>A preview of what’s possible</h3>
            <p>
              You’re viewing sample data. Connect your analytics source to start
              tracking real visitors.
            </p>
          </div>
          <span className="sample-badge">Sample data</span>
        </aside>
        <div className="dashboard-bottom">
          <span>
            <span className="small-dot" /> All times in UTC
          </span>
          <span>
            <CircleHelp size={14} /> Built for the bigger picture.
          </span>
        </div>
      </main>
    </div>
  );
}
