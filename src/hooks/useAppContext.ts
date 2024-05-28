import { useContext } from "react";
import { AppContext } from "../store/AppContext";

// Hook to use the store
const useAppContext = () => {
  const { dispatch, state } = useContext(AppContext);
  return { state, dispatch };
};

export default useAppContext;
