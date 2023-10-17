import { pages } from '@/lib/navigation';
import { useNavigationStore } from '../contexts/navigation.store';
import { cn } from '../lib/utils';

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
        'bg-blue-400 py-4 flex-1 text-center cursor-pointer',
        'hover:bg-blue-500',
        {
          'bg-blue-500': active,
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
    <nav className="">
      <ul className={cn('flex flex-row justify-between')}>
        {pages.map((page) => (
          <Item
            active={navigationStore.page === page.name}
            onClick={() => navigationStore.setPage(page.name)}
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
