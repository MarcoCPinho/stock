import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  useContext,
  useReducer,
} from 'react';
import { INITIAL_STATE } from '../constants';
import { IPricingData } from '../interfaces';

interface IAction {
  type: string;
  stock: IPricingData;
}

export const AppContext = createContext<IPricingData[]>([]);
export const AppDispatchContext = createContext<Dispatch<IAction>>(
  () => undefined,
);

export const AppReducer = (
  dataTable: IPricingData[],
  action: IAction,
): IPricingData[] => {
  switch (action.type) {
    case 'changed': {
      return dataTable.map(stock => {
        if (stock.id === action.stock.id) {
          return action.stock;
        }
        return stock;
      });
    }

    default: {
      throw Error(`Unknown action: ${action.type}`);
    }
  }
};

export const AppProvider = ({ children }: any): ReactElement => {
  const [tableData, dispatch] = useReducer(AppReducer, INITIAL_STATE);

  return (
    <AppContext.Provider value={tableData}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
};

export const useAppContext = (): IPricingData[] => {
  return useContext(AppContext);
};

export const useAppDispatch = (): React.Dispatch<IAction> => {
  return useContext(AppDispatchContext);
};
