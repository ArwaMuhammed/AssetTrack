import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

const PALETTE = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

// ── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "8px 14px",
        boxShadow: "var(--shadow-md)",
        fontFamily: "inherit",
        fontSize: 13,
      }}
    >
      {label && (
        <p style={{ margin: "0 0 4px", color: "var(--text-muted)", fontSize: 12 }}>{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color || "var(--text-main)", fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// ── Status Pie Chart ─────────────────────────────────────────────────────────
// data: [{ name: "Available", value: 12 }, ...]
export function StatusPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── Assets by Type Bar Chart ─────────────────────────────────────────────────
// data: [{ type: "LAPTOP", count: 6 }, ...]
export function TypeBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="35%">
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="type"
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
        <Bar dataKey="count" name="Assets" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Allocation Over Time Bar Chart ───────────────────────────────────────────
// data: [{ month: "Jan", assigned: 10, available: 5 }, ...]
export function AllocationBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="30%">
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(59,130,246,0.06)" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-muted)" }} />
        <Bar dataKey="assigned"  name="Assigned"  fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="available" name="Available" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}