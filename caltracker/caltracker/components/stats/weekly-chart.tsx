
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
    { name: "Lun", calories: 2100 },
    { name: "Mar", calories: 2400 },
    { name: "Mer", calories: 1800 },
    { name: "Jeu", calories: 2600 },
    { name: "Ven", calories: 2200 },
    { name: "Sam", calories: 2900 },
    { name: "Dim", calories: 2300 },
];

export function WeeklyChart() {
    return (
        <div className="glass-panel p-6 rounded-3xl relative">
            <h3 className="text-lg font-bold text-white mb-6">Résumé de la semaine</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#525252"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                        />
                        <Bar
                            dataKey="calories"
                            fill="#fff"
                            radius={[4, 4, 4, 4]}
                            barSize={32}
                            className="fill-white hover:fill-indigo-400 transition-colors"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
