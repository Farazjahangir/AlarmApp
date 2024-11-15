import {forwardRef, Ref} from 'react';
import {Text, Image, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheet from '../../../Components/BottomSheet';

import groupDummy from '../../../Assets/images/groupDummy.png';
import bellIcon from '../../../Assets/icons/bell.png';
import pencilIcon from '../../../Assets/icons/pencil.png';
import exitIcon from '../../../Assets/icons/exit.png';
import {Group} from '../../../Types/dataType';
import OptionItem from './OptionItem';
import styles from './style';

interface GroupOptionsSheet {
  data: Group;
}
const GroupOptionsSheet = forwardRef<BottomSheetModal, GroupOptionsSheet>(
  ({data}, ref: Ref<BottomSheetModal>) => {
    return (
      <BottomSheet snapPoints={['50%', '60%']} ref={ref} showIndicator>
        <View style={styles.contentBox}>
          <View style={styles.topSection}>
            <Image
              source={data?.image ? {uri: data?.image} : groupDummy}
              style={styles.groupIcon}
            />
            <View style={styles.nameBox}>
              <Text style={styles.name}>{data?.groupName}</Text>
              <Text style={styles.count}>{data?.members.length} members</Text>
            </View>
          </View>
          <View style={styles.optionsBox}>
            <OptionItem text="Panic" icon={bellIcon} textRed />
            <OptionItem text="Edit" icon={pencilIcon} containerStyle={styles.optionItemContainer} />
            <OptionItem text="Leave Group" icon={exitIcon} textRed containerStyle={styles.optionItemContainer} />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

export default GroupOptionsSheet;
