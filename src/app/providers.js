"use client";
import { Provider } from "react-redux";
import store from "../redux/store";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </Provider>
  );
} 