export function StatusCard({ title, value, icon, color, description, active = false }: any) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border-t-4 border-${color} p-5 transition-all ${active ? 'border-t-6' : 'hover:shadow-md'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                    <h3 className={`text-3xl font-extrabold text-${color} mt-1`}>{value}</h3>
                </div>
                <div className={`p-2 bg-slate-50 rounded-lg text-${color}`}>{icon}</div>
            </div>
            <p className="text-xs text-slate-400 mt-4 font-medium">{description}</p>
        </div>
    );
}