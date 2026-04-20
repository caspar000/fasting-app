import React, { createContext, useContext } from 'react';

interface DatabaseContextValue {
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: true,
  error: null,
});

export function useDatabaseReady() {
  return useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // No migrations exist yet in ./drizzle — skeleton ships with an empty schema.
  // Once tables are added and `pnpm db:generate` runs, swap this for:
  //   const { success, error } = useMigrations(db, migrations);
  //   return <DatabaseContext.Provider value={{ isReady: success, error: error ?? null }}>{children}</DatabaseContext.Provider>;
  return (
    <DatabaseContext.Provider value={{ isReady: true, error: null }}>
      {children}
    </DatabaseContext.Provider>
  );
}
