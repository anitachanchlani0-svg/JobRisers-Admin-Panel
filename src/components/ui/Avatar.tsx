interface AvatarProps {
  name: string;
}

export function Avatar({ name }: AvatarProps) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eeeafd] text-[10px] font-bold text-[#6352a5]">{initials}</div>;
}