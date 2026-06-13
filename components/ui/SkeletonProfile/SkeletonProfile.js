import { Skeleton } from "@heroui/react";

const SkeletonProfile = ({ length = 1 }) => {
  return (
    <div className="w-full space-y-5 py-4">
      {Array.from({ length }).map((_, i) => (
        <div key={i} className="flex items-center w-full gap-3 px-4">
          <Skeleton  animationType="shimmer" className="h-14 w-14 shrink-0 rounded-full " />
          <div className="flex-1 space-y-2 min-w-0">
            {" "}
    
            <Skeleton className="h-4 w-3/5 rounded-lg " />{" "}
           
            <Skeleton className="h-3 w-2/5 rounded-lg " />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonProfile;
