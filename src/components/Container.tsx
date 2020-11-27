export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...otherProps }) => {
  return (
    <div className="container mx-auto px-4 mt-4" {...otherProps}>
      {children}
    </div>
  );
};
