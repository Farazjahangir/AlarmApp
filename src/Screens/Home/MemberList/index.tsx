import { useEffect } from "react";
import { View, Text, TouchableOpacityProps } from "react-native";

import Modal from "../../../Components/Modal";
import Chip from "../../../Components/Chip";
import { Group } from "..";
import styles from "./style"

interface MemberListProps {
    data: Group;
    onClose: TouchableOpacityProps['onPress'];
    isVisible: boolean
}

const MembersList = ({ data, onClose, isVisible }: MemberListProps) => {
    return (
       <Modal isVisible={isVisible} title={data?.groupName} onClose={onClose}>
        {data?.members.map(item => {
            return (
                <View style={styles.container}>
                    <Text style={styles.name}>{item?.displayName || item.user?.name}</Text>
                    {(item.user?.uid) === data.createdBy && <Chip text='Admin' />}
                </View>
            )
        })}
       </Modal>
    )
}

export default MembersList