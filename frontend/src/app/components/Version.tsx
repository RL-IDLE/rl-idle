import { useUserStore } from '@/contexts/user.store';

export default function Version() {
  const userId = useUserStore((state) => state.user?.id);

  return (
    <p className="fixed left-1 top-1 text-white z-[2] text-xs opacity-40">
      {APP_VERSION} {userId && `- ${userId.slice(0, 8)}`}
    </p>
  );
}
