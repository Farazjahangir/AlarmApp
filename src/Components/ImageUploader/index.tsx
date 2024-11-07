import {useEffect, useState} from 'react';
import {TouchableOpacity, Image, Text, View} from 'react-native';
import {ImageOrVideo} from 'react-native-image-crop-picker';

import placeholderImage from '../../Assets/icons/imagePlaceholder.png';
import styles from './style';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import OptionModal from './OptionModal';
import {SelectedImage} from '../../Types/dataType';
import {useRef} from 'react';

interface ImageUploaderProps {
    onImageSelected?: (image: SelectedImage) => void;
    value?: string | undefined
}
const ImageUploader = ({onImageSelected, value}: ImageUploaderProps) => {
  const [image, setImage] = useState<string | undefined>(value);
  const optionModalRef = useRef<BottomSheetModal>(null);

  const handleUploadPic = async () => {
    optionModalRef.current?.present();
  };

  const handleSelectImage = (image: SelectedImage) => {
    optionModalRef.current?.dismiss();
    console.log("VALUE =====>", value)
    if (value === undefined) {
        setImage(image.path);
    }
    if (onImageSelected) {
        onImageSelected(image)
    }
  };

  useEffect(() => {
    if (value) {
      setImage(value); // Only update if value is non-empty string
    }
  }, [value]);

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handleUploadPic}>
        <Image
          source={image ? {uri: image} : placeholderImage}
          style={[styles.placeholder, image && styles.image]}
        />
      </TouchableOpacity>
      <OptionModal ref={optionModalRef} onImageSelected={handleSelectImage} />
    </View>
  );
};

export default ImageUploader;
