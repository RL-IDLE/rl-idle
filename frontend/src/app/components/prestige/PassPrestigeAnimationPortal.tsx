import React from 'react';
import ReactDOM from 'react-dom';

export default function PassPrestigeAnimationPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  const el = React.useMemo(() => document.createElement('div'), []);

  React.useEffect(() => {
    const target = document.body;
    el.className = '';
    // Append element to dom
    target.appendChild(el);
    // On unmount function
    return () => {
      // Remove element from dom
      target.removeChild(el);
    };
  }, [el]);
  // return the createPortal function
  return ReactDOM.createPortal(children, el);
}
