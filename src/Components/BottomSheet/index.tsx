import {ReactNode, Ref, forwardRef, useCallback} from 'react';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import styles from './style';

interface BottomSheetProps {
  children: ReactNode; // Type for children
  snapPoints?: string[];
  showIndicator?: boolean;
  onChange?: (index: number) => void;
  renderHeader?: () => ReactNode;
  enableDynamicSizing?: boolean;
  enablePanDownToClose?: boolean
}

const bottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>(
  (
    {
      children,
      snapPoints = ['80%', '90%'],
      showIndicator = false,
      onChange,
      renderHeader,
      enableDynamicSizing = false,
      enablePanDownToClose = true
    }: BottomSheetProps,
    ref: Ref<BottomSheetModal>,
  ) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        snapPoints={snapPoints}
        onChange={onChange}
        ref={ref}
        handleIndicatorStyle={{display: showIndicator ? 'flex' : 'none'}}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bgStyle}
        style={{flex: 1}}
        enableDynamicSizing={enableDynamicSizing}
        enablePanDownToClose={enablePanDownToClose}>
        {!!renderHeader && (
          <BottomSheetView>{renderHeader()}</BottomSheetView>
        )}
        {/* <BottomSheetScrollView style={styles.contentContainer}> */}
        {children}
        {/* </BottomSheetScrollView> */}
      </BottomSheetModal>
    );
  },
);

export default bottomSheet;
