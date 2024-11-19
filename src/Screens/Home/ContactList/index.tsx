import {useEffect, useState, forwardRef, Ref} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {BottomSheetModal, BottomSheetFlatList} from '@gorhom/bottom-sheet';

import TextInput from '../../../Components/TextInput';
import List from './List';
import {
  cleanString,
  hasContactPermission,
  fetchContacts,
  checkContactsWithFirestore,
  askContactsPermission,
} from '../../../Utils';
import {
  setContacts,
  setContactLoading,
} from '../../../Redux/contacts/contactSlice';
import {useAppSelector} from '../../../Hooks/useAppSelector';
import {useAppDispatch} from '../../../Hooks/useAppDispatch';
import {Contact, ContactWithAccount} from '../../../Types/dataType';
import BottomSheet from '../../../Components/BottomSheet';
import closeIcon from '../../../Assets/icons/close.png';
import searchIcon from '../../../Assets/icons/search.png';
import {CONTACTS_ITEMS_PER_PAGE} from '../../../Constants';
import {handleError} from '../../../Utils/helpers';
import {useMessageBox} from '../../../Context/MessageBoxContextProvider';
import styles from './style';
import Button from '../../../Components/Button';

interface ContactListProps {
  onChange?: (index: number) => void;
  onCloseModal?: () => void;
  onSelectContacts: (selectedContacts: SelectedContacts) => void;
  selectedContacts: SelectedContacts;
  handleSelectContact: (phoneNumber: string) => void;
  onBackDropPress?: () => void;
}

interface SelectedContacts {
  [phoneNumber: string]: boolean; // Using an index signature
}

interface Header {
  type: 'header';
  title: string;
  localId: string;
}

export type CombinedContact =
  | (ContactWithAccount & {type: 'withAccount'})
  | (Contact & {type: 'withoutAccount'})
  | Header;

const ContactList = forwardRef<BottomSheetModal, ContactListProps>(
  (
    {
      onCloseModal,
      onSelectContacts,
      selectedContacts,
      handleSelectContact,
      onBackDropPress,
    },
    ref: Ref<BottomSheetModal>,
  ) => {
    const [data, setData] = useState<CombinedContact[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [grpName, setGrpName] = useState('');
    const [filteredData, setFilteredData] = useState<CombinedContact[]>([]);
    const [page, setPage] = useState(1);
    const [paginatedData, setPaginatedData] = useState<CombinedContact[]>([]);
    const [hasPermission, setHasPermission] = useState(false);

    const contatcs = useAppSelector(state => state.contacts.data);
    const contactsLoading = useAppSelector(state => state.contacts.loading);
    const user = useAppSelector(state => state.user.data.user);
    const dispatch = useAppDispatch();
    const {openMessageBox} = useMessageBox();

    const loadMoreContacts = () => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * CONTACTS_ITEMS_PER_PAGE;
      const endIndex = nextPage * CONTACTS_ITEMS_PER_PAGE;

      // Agar next page ke items available hain toh unhe add karenge
      if (startIndex < filteredData.length) {
        setPaginatedData(prevData => [
          ...prevData,
          ...filteredData.slice(startIndex, endIndex),
        ]);
        setPage(nextPage);
      }
    };

    const renderList = ({item}: {item: CombinedContact}) => {
      return (
        <List
          item={item}
          selectedContacts={selectedContacts}
          handleSelectContact={() =>
            handleSelectContact((item as Contact).phoneNumber)
          }
        />
      );
    };

    const handleSearch = (text: string) => {
      setSearchTerm(text);
      const lowerCaseSearchTerm = text.toLowerCase();
      // Filter the 'withAccount' section
      const withAccountContacts = data.filter(
        contact =>
          contact.type === 'withAccount' &&
          (contact.displayName?.toLowerCase().includes(lowerCaseSearchTerm) ||
            contact.phoneNumber?.includes(lowerCaseSearchTerm)),
      );

      // Filter the 'withoutAccount' section
      const withoutAccountContacts = data.filter(
        contact =>
          contact.type === 'withoutAccount' &&
          (contact.displayName.toLowerCase().includes(lowerCaseSearchTerm) ||
            contact.phoneNumber.includes(lowerCaseSearchTerm)),
      );

      // Prepare the filtered data
      let searchedData: CombinedContact[] = [];

      // Add 'withAccount' section if it has data
      if (withAccountContacts.length > 0) {
        searchedData.push({
          type: 'header',
          title: 'Contacts on AlarmApp',
          localId: 'ContactsOnApp',
        });
        searchedData = searchedData.concat(withAccountContacts);
      }

      // Add 'withoutAccount' section if it has data
      if (withoutAccountContacts.length > 0) {
        searchedData.push({
          type: 'header',
          title: 'Contacts Not on AlarmApp',
          localId: 'ContactsNotOnApp',
        });
        searchedData = searchedData.concat(withoutAccountContacts);
      }
      setPaginatedData(searchedData.slice(0, CONTACTS_ITEMS_PER_PAGE));
      setFilteredData(searchedData);
    };

    const mergeData = () => {
      const combinedContacts: CombinedContact[] = [];

      if (contatcs.contactsWithAccount.length) {
        combinedContacts.push({
          type: 'header',
          title: 'Contacts on AlarmApp',
          localId: 'ContactsOnApp',
        });
        combinedContacts.push(
          ...contatcs.contactsWithAccount.map(contact => ({
            ...contact,
            type: 'withAccount' as const, // Ensure the type is added
          })),
        );
      }

      if (contatcs.contactsWithoutAccount.length) {
        combinedContacts.push({
          type: 'header',
          title: 'Contacts Not on AlarmApp',
          localId: 'ContactsNotOnApp',
        });
        combinedContacts.push(
          ...contatcs.contactsWithoutAccount.map(contact => {
            return {
              ...(contact as Contact),
              type: 'withoutAccount' as const, // Ensure the type is added
            };
          }),
        );
      }
      setData(combinedContacts);
      setFilteredData(combinedContacts);
      setPaginatedData([...combinedContacts.slice(0, CONTACTS_ITEMS_PER_PAGE)]);
    };

    const getContacts = async () => {
      try {
        dispatch(setContactLoading(true));
        // await new Promise(resolve => setTimeout(resolve, 500));

        const contacts = await fetchContacts();
        console.log('contacts =====>', contacts[0]);
        const firestoreRes = await checkContactsWithFirestore(contacts, user);
        dispatch(
          setContacts({
            contactsWithAccount: firestoreRes?.contactsWithAccount || [],
            contactsWithoutAccount: firestoreRes?.contactsWithoutAccount || [],
          }),
        );
      } catch (e) {
        const error = handleError(e);
        openMessageBox({
          title: 'Error',
          message: error,
        });
      } finally {
        dispatch(setContactLoading(false));
      }
    };

    const handleNextPress = () => {
      onSelectContacts(selectedContacts);
    };

    const checkForContactPermission = async () => {
      try {
        const hasPermission = await hasContactPermission();
        setHasPermission(hasPermission);
      } catch (e) {
        const error = handleError(e);
        openMessageBox({
          title: 'Error',
          message: error,
        });
      }
    };

    const getPermission = async () => {
      try {
        const res = await askContactsPermission();
        if (res === 'granted') {
          getContacts();
          setHasPermission(true)
        }
      } catch(e) {
        const error = handleError(e);
        openMessageBox({
          title: 'Error',
          message: error,
        });
      }
    }

    useEffect(() => {
      checkForContactPermission();
    }, []);

    useEffect(() => {
      if (
        contatcs.contactsWithAccount.length ||
        contatcs.contactsWithoutAccount.length
      ) {
        mergeData();
      }
    }, [contatcs.contactsWithAccount, contatcs.contactsWithoutAccount]);

    const renderHeader = () => {
      const shouldNextBtnDisable = !Object.keys(selectedContacts).length;
      return (
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeIconBox} onPress={onCloseModal}>
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Contacts</Text>
          <TouchableOpacity
            onPress={handleNextPress}
            disabled={shouldNextBtnDisable}>
            <Text
              style={[
                styles.headerActionButtonText,
                shouldNextBtnDisable && styles.disabledText,
              ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      );
    };

    const onChangeSnapIndex = (index: number) => {
      if (index === -1) {
        setSearchTerm('');
        setPage(1);
        mergeData();
      }
    };

    return (
      <BottomSheet
        ref={ref}
        onChange={onChangeSnapIndex}
        renderHeader={renderHeader}
        enablePanDownToClose={false}
        onBackDropPress={onBackDropPress}>
        <View style={styles.container}>
          <View style={styles.contentBox}>
            <TextInput
              placeholder="Search Contact"
              onChangeText={handleSearch}
              value={searchTerm}
              inputBoxStyle={styles.searchInput}
              leftIcon={searchIcon}
            />
            {!hasPermission && (
              <View style={styles.askPermBox}>
                <Text style={styles.permText}>
                  Allow access to your contacts
                </Text>
                <View>
                  <Button text="Allow" onPress={getPermission} />
                </View>
              </View>
            )}
            {(contactsLoading && !data.length) && (
              <ActivityIndicator size="large" style={styles.loader} />
            )}
            {hasPermission && (
              <BottomSheetFlatList
                data={paginatedData}
                renderItem={renderList}
                extraData={paginatedData}
                // keyExtractor={(item, index) => (item as Contact).phoneNumber}
                keyExtractor={(item, index) => item.localId as string}
                refreshControl={
                  <RefreshControl
                    refreshing={contactsLoading}
                    onRefresh={getContacts}
                  />
                }
                onEndReached={loadMoreContacts}
                onEndReachedThreshold={0.1}
                contentContainerStyle={{flexGrow: 1, paddingBottom: 60}}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </BottomSheet>
    );
  },
);

export default ContactList;
