import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import ConfirmationModal from '../Components/ConfirmationModal';

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  loading: boolean;
}

interface OpenDialogParams {
  onConfirm: () => void;
  title: string;
  message: string;
}

interface ConfirmDialogContextValue {
  open: boolean;
  closeDialog: () => void;
  openDialog: (params: OpenDialogParams) => void;
  onConfirm: () => void;
  loading: boolean;
  toggleLoading: (newLoadingState: boolean) => void;
}

const INITIAL_STATE = {
  open: false,
  onConfirm: () => {},
  title: '',
  message: '',
  loading: false,
};
const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(
  null,
);

const ConfirmDialogContextProvider = ({children}: {children: ReactNode}) => {
  const [state, setState] = useState<ConfirmDialogState>(INITIAL_STATE);

  const closeDialog = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const openDialog = useCallback(
    ({onConfirm: onConfirmCallback, ...rest}: OpenDialogParams) => {
      setState(prevState => ({
        ...prevState,
        open: true,
        onConfirm: onConfirmCallback,
        ...rest,
      }));
    },
    [],
  );

  const toggleLoading = useCallback((newLoadingState: boolean) => {
    setState(prevState => ({...prevState, loading: newLoadingState}));
  }, []);

  const value = useMemo(() => {
    return {
      open: state.open,
      closeDialog,
      openDialog,
      onConfirm: state.onConfirm,
      loading: state.loading,
      toggleLoading,
    };
  }, [
    state.open,
    closeDialog,
    openDialog,
    state.onConfirm,
    state.loading,
    toggleLoading,
  ]);

  return (
    <ConfirmDialogContext.Provider value={value}>
      {children}
      <ConfirmationModal
        onConfirm={state.onConfirm}
        title={state.title}
        message={state.message}
        loading={state.loading}
        open={state.open}
        onClose={closeDialog}
      />
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = (): ConfirmDialogContextValue => {
  const context = useContext(ConfirmDialogContext);

  if (!context) {
    throw new Error(
      'useConfirmDialog must be used within a ConfirmDialogContextProvider',
    );
  }

  return context;
};
export default ConfirmDialogContextProvider;
