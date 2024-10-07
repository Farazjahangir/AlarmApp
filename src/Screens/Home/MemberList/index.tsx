import { useEffect } from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";

import Modal from "../../../Components/Modal";
import Chip from "../../../Components/Chip";
import styles from "./style"

const MembersList = ({ data, onClose, isVisible }) => {
    const user = useSelector(state => state.user.data.user)
    useEffect(() => {
        console.log("isVisible ==>", isVisible)
    }, [isVisible])
    return (
       <Modal isVisible={isVisible} title={data?.groupName} onClose={onClose}>
        {data?.members.map(item => (
            <View style={styles.container}>
                <Text style={styles.name}>{item?.name || item.displayName}</Text>
                {user.uid === item.uid && <Chip text='Admin' />}
            </View>
        ))}
       </Modal>
    )
}

export default MembersList