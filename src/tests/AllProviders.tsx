import { AppProvider } from "../store/AppContext";
import { ReactNode } from "react";

export default function AllProviders({ children }: { children: ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}
