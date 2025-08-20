import useGetAllLeadsData from "@/hooks/useGetAllLeadsData";
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Loading from "../Loading";

const LeadTrendsChart = () => {
  // 1. Fetch data from custom hook
  const { data: leadsData, isLoading, error } = useGetAllLeadsData();

  // 2. Loading and error states
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p className="text-center text-red-500">Error loading leads data</p>;
  }

  // 3. Transform database data → month-wise aggregation for current year
  const monthlyData = useMemo(() => {
    if (!Array.isArray(leadsData)) return [];

    // Get current year (2025, based on provided date)
    const currentYear = new Date().getFullYear();

    // Create 12 months initialized
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize counts using map for structure
    const initialCounts = months.map((m) => ({ month: m, leads: 0 }));

    // Aggregate leads by month for the current year
    return leadsData.reduce((acc, lead) => {
      if (lead?.dateSubmitted) {
        const date = new Date(lead.dateSubmitted);
        if (!isNaN(date.getTime()) && date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          acc[monthIndex].leads += 1;
        }
      }
      return acc;
    }, initialCounts);
  }, [leadsData]);

  // 4. Empty check
  if (monthlyData.length === 0) {
    return <p className="text-center text-gray-500">No leads data available</p>;
  }

  // 5. Chart render
  return (
    <div className="h-80 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Monthly Leads Trend ({new Date().getFullYear()})
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={monthlyData}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          aria-label={`Monthly leads trend chart for ${new Date().getFullYear()}`}
        >
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" opacity={0.5} />
          <XAxis
            dataKey="month"
            className="text-sm font-medium text-gray-600"
            tick={{ fill: "#4b5563" }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={{ stroke: "#d1d5db" }}
          />
          <YAxis
            className="text-sm font-medium text-gray-600"
            tick={{ fill: "#4b5563" }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={{ stroke: "#d1d5db" }}
            label={{
              value: "Number of Leads",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              fill: "#374151",
              fontSize: 14,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: "8px 12px",
            }}
            formatter={(value) => [`${value} leads`, "Leads"]}
            labelFormatter={(label) => `Month: ${label}`}
            cursor={{
              stroke: "#9ca3af",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={() => "Leads"}
            iconType="circle"
            iconSize={10}
          />
          <Line
            type="monotone"
            dataKey="leads"
            stroke="hsl(var(--primary, #3b82f6))"
            strokeWidth={3}
            dot={{ fill: "hsl(var(--primary, #3b82f6))", strokeWidth: 2, r: 5 }}
            activeDot={{
              r: 8,
              stroke: "hsl(var(--primary, #3b82f6))",
              strokeWidth: 2,
            }}
            animationDuration={800}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadTrendsChart;
