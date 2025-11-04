import {createContext, useContext, ReactNode, useState} from "react";

type TitleContextType = {
  title: string;
  subtitle?: string;
  setTitle: (title: string, subtitle?: string) => void;
};

export const TitleContext = createContext<TitleContextType>({
  title: "Card Hive",
  subtitle: undefined,
  setTitle: () => {},
});

export const usePageTitle = () => useContext(TitleContext);

export const TitleProvider = ({ children, defaultTitle = "Card Hive" }: { children: ReactNode; defaultTitle?: string }) => {
  const [title, setTitleState] = useState(defaultTitle);
  const [subtitle, setSubtitleState] = useState<string | undefined>();

  const setTitle = (newTitle: string, newSubtitle?: string) => {
    setTitleState(newTitle);
    setSubtitleState(newSubtitle);
  };

  return (
    <TitleContext.Provider value={{ title, subtitle, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const PageTitle = () => {
  const { title, subtitle } = usePageTitle();
  return (
    <>
      <h1 className="text-white text-3xl font-bold text-center mb-2">{title}</h1>
      {subtitle && (
        <p className="text-white/70 text-center mt-2">{subtitle}</p>
      )}
    </>
  );
};
