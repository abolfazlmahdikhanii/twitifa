const EngagementItem = ({ bg, color, label, value, icon }) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-2.5">
        <div
          style={{
            background: bg,
            color: color,
          }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] "
        >
          {icon}
        </div>
        <div className="">
          <p className="text-lg font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementItem;
