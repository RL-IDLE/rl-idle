import { cn } from '@/lib/utils';
import Button from './ui/Button';

export default function PaymentValidation({
  close,
  children,
}: {
  close: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center',
      )}
      onClick={() => close()}
    >
      <div className="rounded-xl p-5 flex flex-col items-center rounded-t-2xl overflow-hidden border-2 border-[#245184] bg-gradient-to-t from-[#111429] to-[#1F3358] text-white">
        <div className="flex flex-col gap-3">{children}</div>
        <Button onClick={() => close()}>Claim</Button>
      </div>
    </div>
  );
}
