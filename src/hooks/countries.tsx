import React, { createContext, useContext, useMemo } from 'react';
import countriesJSON from '../countries.json';
import ICountryPhone from '../interfaces/IPhoneCountry';

interface CountriesContext {
  countries: ICountryPhone[];
}

interface Props {
  children: React.ReactNode;
}

const CountriesContext = createContext<CountriesContext | null>(null);

const CountriesProvider: React.FC<Props> = ({ children }) => {
  const countries = useMemo<ICountryPhone[]>(() => {
    return countriesJSON.map(country => ({
      iso: country.iso,
      name: country.name,
      mask: country.mask,
    }));
  }, []);

  const value = useMemo(() => ({ countries }), [countries]);

  return (
    <CountriesContext.Provider value={value}>
      {children}
    </CountriesContext.Provider>
  );
};

const useCountries = (): CountriesContext => {
  const context = useContext(CountriesContext);

  if (!context)
    throw new Error('useCountries must be used within a CountriesProvider');

  return context;
};

export { CountriesProvider, useCountries };
