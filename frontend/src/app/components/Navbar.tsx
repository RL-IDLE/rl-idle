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
        'bg-blue-400 py-4 flex-1 text-center cursor-pointer h-24 transition-all duration-200 flex flex-col justify-center items-center',
        'hover:bg-blue-500',
        '[&>*]:w-10 [&>*]:h-10',
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
      <ul
        className={cn(
          'flex flex-row justify-between border-t-2 border-blue-400',
        )}
      >
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
