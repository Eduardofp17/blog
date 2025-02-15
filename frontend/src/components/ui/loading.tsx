export function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black dark:border-white"></div>
    </div>
  );
}
