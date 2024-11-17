import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import MessageBox from '../Components/MessageBox';

interface MessageBox {
  open: boolean;
  title: string;
  message: string;
  closeMessageBox: () => void;
}

interface OpenDialogParams {
  title: string;
  message: string;
}

interface MessageContextValue {
  open: boolean;
  closeMessageBox: () => void;
  openMessageBox: (params: OpenDialogParams) => void;
}

const INITIAL_STATE = {
  open: false,
  closeMessageBox: () => {},
  title: '',
  message: '',
};
const MessageBoxContext = createContext<MessageContextValue | null>(
  null,
);

const MessageContextProvider = ({children}: {children: ReactNode}) => {
  const [state, setState] = useState<MessageBox>(INITIAL_STATE);

  const closeMessageBox = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const openMessageBox = useCallback(
    ({...rest}: OpenDialogParams) => {
      setState(prevState => ({
        ...prevState,
        open: true,
        ...rest,
      }));
    },
    [],
  );


  const value = useMemo(() => {
    return {
      open: state.open,
      closeMessageBox,
      openMessageBox,
    };
  }, [
    state.open,
    closeMessageBox,
    openMessageBox,
  ]);

  return (
    <MessageBoxContext.Provider value={value}>
      {children}
      <MessageBox
        title={state.title}
        message={state.message}
        onClose={closeMessageBox}
        open={state.open}
      />
    </MessageBoxContext.Provider>
  );
};

export const useMessageBox = (): MessageContextValue => {
  const context = useContext(MessageBoxContext);

  if (!context) {
    throw new Error(
      'useMessageBox must be used within a MessageContextProvider',
    );
  }

  return context;
};
export default MessageContextProvider;
