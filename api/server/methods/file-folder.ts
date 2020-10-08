import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Group } from '../models/group';
import { FileFolder, Access, ownerHasAccess, memberHasAccess, FileType,
  FileProperty, FileChange, newPropertyValue, FilePrivacy, FileStatus, FileFolderSetting } from '../models/file-folder';
import { FileFoldersCollection } from '../collections/file-folders-collection';
import { User } from '../models/user';


Meteor.methods({

  fetchPublicFileFolder(): R {
    try {
      if ( !this.userId ) {
        throw new Meteor.Error('User is not logged.');
      }

      const result = FileFoldersCollection.collection.find({
        privacy: { $eq: FilePrivacy.Public },
        status: { $eq: FileStatus.Normalized }
      }).fetch();
      if (util.valueExist(result)) {
        return response.fetchResponse(result);
      }
    } catch (error) {
      return response.fetchResponse(error, false);
    }
  },

  createFileFolder(fileFolder: FileFolder): R {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }
          fileFolder.properties = {
              createdDateTime: new Date(),
              lastModifiedDateTime: new Date(),
              lastModifiedBy: Accounts.user(),
              changes: []
          };
          const result: string = FileFoldersCollection.collection.insert(fileFolder);
          if (result) {
              return response.fetchResponse(result);
          } else {
              throw new Meteor.Error('Unable to create file or folder');
          }
      } catch (error){
          return response.fetchResponse(error, false);
      }

  },

  assignRemoveGroup(fileFolderId: string, newGroup: Group = null) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
          const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
          if (!util.valueExist(fileFolder)) {
              throw new Meteor.Error('Folder not found.');
          } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
              !memberHasAccess(this.userId, accesses, fileFolder)) {
              throw new Meteor.Error('User does not have the right access');
          }

          const fileChange: FileChange = {
              date: new Date(),
              info: util.valueExist(newGroup)
                      ? `Group is changed to ${newGroup.name} from ${fileFolder.group.name}`
                      : `${fileFolder.group.name} is removed from group.`
          };
          const setValues = newPropertyValue(fileChange, fileFolder);
          setValues['group'] = newGroup;

          const updated = FileFoldersCollection.collection.update(fileFolderId, {$set: setValues});
          if ( updated ) {
              return response.fetchResponse(setValues);
          } else {
              throw new Meteor.Error('Unable to remove group from file or folder.');
          }

      }
      catch (error){
          return response.fetchResponse(error, false);
      }

  },

  updateFileFolderSetting(fileFolderSetting: FileFolderSetting, fileFolderId: string) {
    try {
      if ( !this.userId ) {
          throw new Meteor.Error('User is not logged.');
      }

      const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
      const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
      if (!util.valueExist(fileFolder)) {
          throw new Meteor.Error('Folder not found.');
      } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
          !memberHasAccess(this.userId, accesses, fileFolder)) {
          throw new Meteor.Error('User does not have the right access');
      }

      const fileChange: FileChange = { date: new Date(), info: 'File setting change' };
      const setValues = newPropertyValue(fileChange, fileFolder);
      setValues['group'] = fileFolderSetting.group;
      setValues['memberAccess'] = fileFolderSetting.memberAccess;
      setValues['privacy'] = fileFolderSetting.privacy;

      if ( fileFolderSetting.privacy !== fileFolder.privacy ) {
        setValues['parent'] = 'root';
      }

      const updated = FileFoldersCollection.collection.update(fileFolderId, { $set: setValues });
      if ( updated ) {
          return response.fetchResponse(setValues);
      } else {
          throw new Meteor.Error('Unable to rename file or folder.');
      }
    }
    catch (error) {
      return response.fetchResponse(error, false);
    }

  },

  renameFileFolder(fileFolderId: string, newFileFolderName: string) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
          const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
          if (!util.valueExist(fileFolder)) {
              throw new Meteor.Error('Folder not found.');
          } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
              !memberHasAccess(this.userId, accesses, fileFolder)) {
              throw new Meteor.Error('User does not have the right access');
          }

          const fileChange: FileChange = {
              date: new Date(),
              info: 'Renamed file with ' + newFileFolderName + ' from ' + fileFolder.name
          };
          const setValues = newPropertyValue(fileChange, fileFolder);
          setValues['name'] = newFileFolderName;

          const updated = FileFoldersCollection.collection.update(fileFolderId, { $set: setValues });
          if ( updated ) {
              return response.fetchResponse(setValues);
          } else {
              throw new Meteor.Error('Unable to rename file or folder.');
          }
      }
      catch(error){
          return response.fetchResponse(error, false);
      }

  },

  moveFileStatus(fileFolderId: string, fileStatus: FileStatus) {
    try {
      if ( !this.userId ) {
        throw new Meteor.Error('User is not logged.');
      }

      const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
      const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
      if (!util.valueExist(fileFolder)) {
        throw new Meteor.Error('Folder not found.');
      } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
        !memberHasAccess(this.userId, accesses, fileFolder)) {
        throw new Meteor.Error('User does not have the right access');
      }

      const fileChange: FileChange = {
        date: new Date(),
        info: 'File is ' + fileStatus
      };
      const setValues = newPropertyValue(fileChange, fileFolder);
      setValues['status'] = fileStatus;

      const updated = FileFoldersCollection.collection.update(fileFolderId, { $set: setValues });
      if ( updated ) {
      return response.fetchResponse(setValues);
      } else {
      throw new Meteor.Error('Unable to rename file or folder.');
      }
    }
    catch(error){
      return response.fetchResponse(error, false);
    }

  },

  moveFileFolder(fileFolderId: string, destinationId: string) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
          const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
          const destination: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: destinationId}});
          if (!util.valueExist(fileFolder)) {
              throw new Meteor.Error('Folder not found.');
          } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
              !memberHasAccess(this.userId, accesses, fileFolder)) {
              throw new Meteor.Error('User does not have the right access');
          } else if ( !util.valueExist(destination) && destination.type !== FileType.Folder ) {
              throw new Meteor.Error('Selected destination is not folder or does not exist');
          }

          const fileChange: FileChange = {
              date: new Date(),
              info: 'File or folder moved to ' + destination.name
          };
          const setValues = newPropertyValue(fileChange, fileFolder);
          setValues['parent'] = destination._id;

          const updated = FileFoldersCollection.collection.update(fileFolderId, { $set: setValues });
          if ( updated ) {
              return response.fetchResponse(setValues);
          } else {
              throw new Meteor.Error('Unable to move file or folder.');
          }
      }
      catch(error){
          return response.fetchResponse(error, false);
      }

  },

  updateFileContent(fileFolderId: string, newContent: string) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
          let fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
          if (!util.valueExist(fileFolder)) {
              throw new Meteor.Error('Folder not found.');
          } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
              !memberHasAccess(this.userId, accesses, fileFolder)) {
              throw new Meteor.Error('User does not have the right access');
          }

          /*
          TODO
          Think about a way to impliment content change comparison
          */
          const fileChange: FileChange = {
              date: new Date(),
              info: 'File content is updated'
          };
          let setValues = newPropertyValue(fileChange, fileFolder);
          setValues['content'] = newContent;

          const updated = FileFoldersCollection.collection.update(fileFolderId, { $set: setValues });
          if ( updated ) {
              return response.fetchResponse(setValues);
          } else {
              throw new Meteor.Error('Unable to update file or folder.');
          }
      }
      catch(error){
          return response.fetchResponse(error, false);
      }

  },

  removeFileFolderPermanently(fileFolderId: string) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          const accesses: Access[] = [Access.nwx, Access.rwn, Access.rwx];
          let fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
          if (!util.valueExist(fileFolder)) {
              throw new Meteor.Error('Folder not found.');
          } else if ( !ownerHasAccess(this.userId, accesses, fileFolder) &&
              !memberHasAccess(this.userId, accesses, fileFolder)) {
              throw new Meteor.Error('User does not have the right access');
          }

          const updated = FileFoldersCollection.collection.remove(fileFolderId);
          if ( updated ) {
              return response.fetchResponse();
          } else {
              throw new Meteor.Error('Unable to update file or folder.');
          }
      }
      catch(error){
          return response.fetchResponse(error, false);
      }

  },

  executeFile(file: FileFolder) {
      try {
          if ( !this.userId ) {
              throw new Meteor.Error('User is not logged.');
          }

          /*
          TODO
          Impliment the http call to the selected solver in here
          */

          return response.fetchResponse();
      }
      catch (error) {
          return response.fetchResponse(error, false);
      }

  }

});
