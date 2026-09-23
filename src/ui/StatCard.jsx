const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="card flex items-center justify-between p-5">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;