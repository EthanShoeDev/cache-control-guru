import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import type { Accessor } from 'solid-js';
import { twMerge } from 'tailwind-merge';

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));
export const narrow = <A, B extends A>(
  accessor: Accessor<A>,
  guard: (v: A) => v is B,
): B | null => {
  const val = accessor();
  if (guard(val)) {
    return val;
  }
  return null;
};
