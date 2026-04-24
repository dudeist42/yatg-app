'use client';
import Link from 'next/link';

export const HomeLink = () => {
  return (
    <Link
      href="/"
      prefetch={false}
      className="font-medium text-xl focus-visible:focus-field-ring"
    >
      YATG
    </Link>
  );
};
