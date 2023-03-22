// noinspection ES6CheckImport

import { useCallback } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import realm, { generateContact } from '../realmStore';
import Contacts from 'react-native-contacts';
import { EventRegister } from 'react-native-event-listeners';

export const useStorePhoneContactsRealm = () => {
  function getFinalContacts(isModal, callback) {
    if (isModal) {
      const realmContacts = [...realm.objects('Contact').sorted('givenName')];
      callback(realmContacts, true);
    }
    Contacts.getAll()
      .then(contacts =>
        contacts.filter(
          contact =>
            contact?.givenName != null && contact?.phoneNumbers?.length > 0,
        ),
      )
      .then(contacts => contacts.map(contact => generateContact(contact)))
      .then(contacts => {
        if (!isModal) {
          callback(contacts, false);
        } else {
          // callback(contacts);
        }
      });
  }

  const getContacts = useCallback((callback, isModal: boolean = false) => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept bare mortal',
      })
        .then(granted => {
          if (granted === 'granted') {
            getFinalContacts(isModal, callback);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      getFinalContacts(isModal, callback);
      Contacts.checkPermission().then();
    }
  }, []);

  const syncContacts = useCallback(callback => {
    getContacts(contacts => {
      try {
        realm.write(() => {
          realm.deleteAll();

          contacts.forEach(contact =>
            realm.create('Contact', contact, 'modified'),
          );
        });
      } catch (e) {
        console.log('error (getContactList) => ', e.message);
      }

      if (callback !== null && callback !== undefined) {
        // const realmContacts = [...realm.objects('Contact').sorted('givenName')];
        callback(contacts);
      }
      EventRegister.emitEvent('contacts-synced', {
        synced: true,
      });
      //console.log('Contacts synced!');
    });
  }, []);

  const syncContactsIfRequired = useCallback((callback, dbContacts) => {
    getContacts(contacts => {
      if (contacts.length !== dbContacts.length) {
        callback({ syncRequired: true, isLoading: true });
        try {
          realm.write(() => {
            realm.deleteAll();
            contacts.forEach(contact =>
              realm.create('Contact', contact, 'modified'),
            );
          });
        } catch (e) {
          console.log('error (getContactList) => ', e.message);
        }

        if (callback !== null && callback !== undefined) {
          callback({ syncRequired: true, isLoading: false, contacts: contacts });
        }
        //console.log('Contacts synced!');
      } else {
        callback({ syncRequired: false });
      }
    });
  }, []);

  const addContact = useCallback((contact, callback) => {
    try {
      realm.write(() => {
        realm.create('Contact', generateContact(contact), 'modified');
      });
    } catch (e) {
      console.log('addContact (error) => ', e.message);
    }
    callback();
  }, []);

  return [addContact, syncContacts, getContacts, syncContactsIfRequired];
};
