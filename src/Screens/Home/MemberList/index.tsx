import { useEffect } from "react";
import { View, Text } from "react-native";

import Modal from "../../../Components/Modal";
import Chip from "../../../Components/Chip";
import styles from "./style"

const MembersList = ({ data, onClose, isVisible }) => {
    return (
       <Modal isVisible={isVisible} title={data?.groupName} onClose={onClose}>
        {data?.members.map(item => {
            return (
                <View style={styles.container}>
                    <Text style={styles.name}>{item?.displayName || item.name}</Text>
                    {(item?.uid || item?.user?.uid) === data.createdBy && <Chip text='Admin' />}
                </View>
            )
        })}
       </Modal>
    )
}

export default MembersList