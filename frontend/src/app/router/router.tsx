import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getHashPath = () => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash.startsWith('/') ? hash : '/' + hash;
  };

  const [path, setPath] = useState<string>(getHashPath() || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setPath(getHashPath() || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    const target = to.startsWith('/') ? to : '/' + to;
    window.location.hash = target;
    setPath(target);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within a Router');
  return ctx;
};

export const useNavigate = () => {
  const { navigate } = useRouter();
  return navigate;
};

export const usePathname = () => {
  const { path } = useRouter();
  return path;
};

export const Link: React.FC<{
  to: string;
  className?: string;
  title?: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, className, title, children, onClick }) => {
  const { navigate } = useRouter();

  return (
    <a
      href={`#${to.startsWith('/') ? to : '/' + to}`}
      className={className}
      title={title}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
        if (onClick) onClick();
      }}
    >
      {children}
    </a>
  );
};
