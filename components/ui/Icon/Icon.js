const Icon = ({ className, name, size,strokeWidth=1.5 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      strokeWidth={strokeWidth}
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};

export default Icon;
