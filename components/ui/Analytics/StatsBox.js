const StatsBox = ({ title, count = 0 }) => {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-2xl py-4 px-4 relative overflow-hidden">
      {/* <div className="absolute -top-4 -left-4 w-14 h-14 bg-[rgba(123,111,253,0.2)] rounded-full blur-[18px]" /> */}
      <p className="text-sm text-[#9090c0] mb-1.5">{title}</p>
      <p className="text-[26px] font-semibold -leading-[1px] mb-1.5 ">
        {count.toLocaleString()}
      </p>
    </div>
  );
};

export default StatsBox;
