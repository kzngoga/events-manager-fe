import React, { ReactNode, createContext, useReducer } from "react";
import { reducer, AppState, initialState, Action } from "./AppReducer";

export type DispatchAction = React.Dispatch<Action>;

type ContextType = {
  state: AppState;
  dispatch: DispatchAction;
};

// Create context
export const AppContext = createContext<ContextType>({
  state: initialState,
  dispatch: () => {},
});

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
