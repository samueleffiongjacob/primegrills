import { createContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
