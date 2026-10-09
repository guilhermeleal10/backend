import{createContext,useContext,useEffect,useState,ReactNode}from"react";
type Theme="light"|"dark";type ThemeContextValue={theme:Theme;toggleTheme:()=>void};
const ThemeContext=createContext<ThemeContextValue|undefined>(undefined);
export function ThemeProvider({children}:{children:ReactNode}){const[theme,setTheme]=useState<Theme>(()=>localStorage.getItem("meta_theme")==="dark"?"dark":"light");useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("meta_theme",theme)},[theme]);function toggleTheme(){setTheme(v=>v==="dark"?"light":"dark")}return <ThemeContext.Provider value={{theme,toggleTheme}}>{children}</ThemeContext.Provider>}
export function useTheme(){const value=useContext(ThemeContext);if(!value)throw new Error("useTheme deve ser usado dentro de ThemeProvider");return value}
