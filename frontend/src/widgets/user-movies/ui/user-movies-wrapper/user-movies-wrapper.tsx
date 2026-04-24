import { ReactNode } from 'react';

export const UserMoviesWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,171px)] gap-4 justify-center">
      {children}
    </div>
  );
};
