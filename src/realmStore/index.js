import Realm from 'realm';
import {removeSpecialCharacters} from '../uikit-app';

class Contact extends Realm.Object {}
Contact.schema = {
  name: 'Contact',
  properties: {
    recordID: 'string',
    thumbnailPath: 'string',
    givenName: 'string',
    familyName: 'string',
    value: 'string',
    key: 'string',
    hasThumbnail: {type: 'bool', default: false},
    phoneNumber: 'string',
  },
  primaryKey: 'recordID',
};

export const generateContact = contact => {
  let contactNumber = contact.phoneNumbers[0].number
    .replace(/ /g, '')
    .replace(/-/g, '');

  contactNumber = removeSpecialCharacters(contactNumber);
  return {
    recordID: contact?.recordID,
    thumbnailPath: contact?.thumbnailPath,
    givenName: contact?.givenName,
    familyName: contact?.familyName,
    value: contact?.givenName + ' ' + contact?.familyName,
    // key:
    //   contact?.givenName.substring(0, 1).toUpperCase() +
    //   contact?.familyName.substring(0, 1).toUpperCase(),
    key: contact?.recordID,
    hasThumbnail: contact?.hasThumbnail,
    phoneNumber: contactNumber,
  };
};

export default new Realm({schema: [Contact]});
