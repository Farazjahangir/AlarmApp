import {forwardRef, Ref} from 'react';
import {Text, Image, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheet from '../../../Components/BottomSheet';
import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import groupDummy from '../../../Assets/images/groupDummy.png';
import bellIcon from '../../../Assets/icons/bell.png';
import pencilIcon from '../../../Assets/icons/pencil.png';
import exitIcon from '../../../Assets/icons/exit.png';
import {Group} from '../../../Types/dataType';
import OptionItem from './OptionItem';
import {useLeaveGroup} from '../../../Hooks/reactQuery/useLeaveGroup';
import {useAppSelector} from '../../../Hooks/useAppSelector';
import queryKeys from '../../../Constants/queryKeys';
import { useConfirmDialog } from '../../../Context/ConfirmDialogueContextProvider';
import { ScreenNameConstants } from '../../../Constants/navigationConstants';
import styles from './style';

interface GroupOptionsSheet {
  data: Group | null;
  onCloseSheet?: () => void;
  onEditGroupPress: () => void
}
const GroupOptionsSheet = forwardRef<BottomSheetModal, GroupOptionsSheet>(
  ({data, onCloseSheet, onEditGroupPress}, ref: Ref<BottomSheetModal>) => {
    const userUid = useAppSelector(state => state.user.data.user?.uid);
    const leaveGroupMut = useLeaveGroup();
    const queryClient = useQueryClient()
    const { openDialog, closeDialog } = useConfirmDialog()

    const leaveGroup = async () => {
      try {
        closeDialog()
        await leaveGroupMut.mutateAsync({
          groupUid: data?.uid as string,
          userUid: userUid as string,
        });
        if (onCloseSheet) {
            onCloseSheet()
        }
        queryClient.invalidateQueries({
            queryKey: [queryKeys.USE_GET_USER_GROUPS],
          });
      } catch (e) {
        console.log('leaveGroup ERR =====>', e.message);
      }
    };
    const leaveGroupConfirm = () => {
      openDialog({
        onConfirm: leaveGroup,
        title: `Leave ${data?.groupName}`,
        message: 'Are you sure you want to leave ?'
      })
    }

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
            <OptionItem text="Panic" icon={bellIcon} textRed disabled={leaveGroupMut.isPending} />
            <OptionItem
              text="Edit"
              icon={pencilIcon}
              containerStyle={styles.optionItemContainer}
              disabled={leaveGroupMut.isPending}
              onPress={onEditGroupPress}
            />
            <OptionItem
              text="Leave Group"
              icon={exitIcon}
              textRed
              containerStyle={styles.optionItemContainer}
              onPress={leaveGroupConfirm}
              disabled={leaveGroupMut.isPending}
            />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

export default GroupOptionsSheet;
