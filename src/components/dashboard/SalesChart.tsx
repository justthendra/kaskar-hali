"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesChartProps {
    data: {
        name: string;
        total: number;
    }[];
}

export default function SalesChart({ data }: SalesChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-secondary/30 border border-border rounded-3xl p-6 h-[400px] flex items-center justify-center text-muted-foreground">
                Veri bulunamadı.
            </div>
        );
    }

    return (
        <div className="bg-secondary/30 border border-border rounded-3xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                Haftalık Satış Grafiği
            </h2>
            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₺${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                borderRadius: '12px'
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            formatter={(value: number | undefined) => [
                                `₺${(value || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
                                'Toplam Satış'
                            ]}
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
