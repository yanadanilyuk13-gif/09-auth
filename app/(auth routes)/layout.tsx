'use client';

import { useEffect, useState, startTransition } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: ReactNode;
};

export default function PublicLayout({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    router.refresh();

    startTransition(() => {
      setLoading(false);
    });
  }, [router]);

  return <>{loading ? <div>Loading...</div> : children}</>;
}
