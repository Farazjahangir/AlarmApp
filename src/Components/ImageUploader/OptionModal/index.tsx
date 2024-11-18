import {forwardRef, Ref, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import {BottomSheetModal, BottomSheetView} from '@gorhom/bottom-sheet';
import ImagePicker from 'react-native-image-crop-picker';

import BottomSheet from '../../BottomSheet';
import cameraIcon from '../../../Assets/icons/camera.png';
import galleryIcon from '../../../Assets/icons/imagePlaceholder.png';
import {SelectedImage} from '../../../Types/dataType';
import {handleError} from '../../../Utils/helpers';
import MessageBox from '../../MessageBox';
import styles from './style';

interface OptionModalProps {
  onImageSelected?: (image: SelectedImage) => void;
}
const OptionModal = forwardRef<BottomSheetModal, OptionModalProps>(
  ({onImageSelected}, ref: Ref<BottomSheetModal>) => {
    const [messgaeBox, setMessageBox] = useState({
      open: false,
      title: '',
      message: '',
    });

    const handleOpenGallery = async () => {
      try {
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true,
          compressImageQuality: 0.7,
        });
        if (onImageSelected) {
          onImageSelected(image as SelectedImage); // Pass image URI to parent component
        }
      } catch (e) {
        const error = handleError(e);
        setMessageBox({
          open: true,
          title: 'Error',
          message: error,
        });
      }
    };

    // Function to open the camera
    const handleOpenCamera = async () => {
      try {
        const image = await ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: true,
          includeBase64: true,
          useFrontCamera: true,
          compressImageQuality: 0.7,
        });
        if (onImageSelected) {
          onImageSelected(image as SelectedImage);
        }
      } catch (e) {
        const error = handleError(e);
        setMessageBox({
          open: true,
          title: 'Error',
          message: error,
        });
      }
    };

    const onCloseMessageBox = () => {
      setMessageBox({
        open: false,
        title: '',
        message: ''
      })
    }

    const renderOption = (
      icon: ImageSourcePropType,
      label: string,
      onPress: () => void,
    ) => (
      <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
        <View style={styles.iconBox}>
          <Image source={icon} style={styles.icon} />
        </View>
        <Text style={styles.text}>{label}</Text>
      </TouchableOpacity>
    );

    return (
      <>
        <MessageBox
          open={messgaeBox.open}
          title={messgaeBox.title}
          message={messgaeBox.message}
          onClose={onCloseMessageBox}
        />
        <BottomSheet
          ref={ref}
          snapPoints={['18%']}
          showIndicator
          backgroundStyle={styles.bottomSheetBgStyle}>
          <BottomSheetView style={styles.contentBox}>
            {renderOption(cameraIcon, 'Camera', handleOpenCamera)}
            {renderOption(galleryIcon, 'Gallery', handleOpenGallery)}
          </BottomSheetView>
        </BottomSheet>
      </>
    );
  },
);

export default OptionModal;
