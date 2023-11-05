import { useNavigationStore } from '@/contexts/navigation.store';
import { pages } from '@/lib/navigation';
import { cn } from '../../lib/utils';

function Item({
  children,
  active,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <li
      className={cn(
        'py-4 flex-1 text-center cursor-pointer h-20 transition-all duration-200 flex flex-col justify-center items-center',
        'hover:bg-blue-500/20',
        '[&>*]:w-6 [&>*]:h-6',
        {
          'bg-blue-500/30': active,
          'opacity-50 pointer-events-none cursor-default': disabled,
        },
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
}

export default function Navbar() {
  const navigationStore = useNavigationStore();

  return (
    <nav className="absolute bottom-0 left-0 min-w-full z-50">
      <ul
        className={cn(
          'flex flex-row justify-between rounded-t-2xl overflow-hidden border-2 border-[#245184] bg-gradient-to-t from-[#111429] to-[#1F3358] text-white',
        )}
      >
        {pages.map((page) => (
          <Item
            active={navigationStore.page === page.name}
            onClick={() => {
              navigationStore.setPage(page.name);
            }}
            disabled={page.disabled}
            key={page.name}
          >
            {page.label}
          </Item>
        ))}
      </ul>
    </nav>
  );
}
