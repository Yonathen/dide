import { util } from './../lib/util';
import { FilterFileFolder, FilterResult, allHasAccess } from './../models/file-folder';
import { Meteor } from 'meteor/meteor';
import { response, R } from '../lib/response';
import { util } from '../lib/util';
import { Group } from '../models/group';
import { FileFolder, Access, ownerHasAccess, memberHasAccess, FileType,
  FileProperty, FileChange, newPropertyValue, FilePrivacy, FileStatus, FileFolderSetting } from '../models/file-folder';
import { FileFoldersCollection } from '../collections/file-folders-collection';
import { User } from '../models/user';


Meteor.methods({

  getFileFolder(fileFolderId: string): R {
    try {
      if ( !this.userId ) {
        throw new Meteor.Error('User is not logged.');
      }

      const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
      if (util.valueExist(fileFolder)) {
        return response.fetchResponse(fileFolder);
      }
    } catch (error) {
      return response.fetchResponse(error, false);
    }
  },

  searchFileFolderByName(keyword: string, filePrivacy: FilePrivacy = FilePrivacy.Public): R {
    try {
      if ( !this.userId && filePrivacy === FilePrivacy.Private) {
        throw new Meteor.Error('User is not logged.');
      }

      let fileFolders: FileFolder[] = [];
      if (filePrivacy === FilePrivacy.Public) {
        const allPublicFiles: FileFolder[] = FileFoldersCollection.collection.find({
          privacy: { $eq: FilePrivacy.Public },
          status: { $eq: FileStatus.Normalized }
        }).fetch();
        if (util.valueExist(allPublicFiles)) {
          allPublicFiles.forEach((file, index) => {
            const readAccess: Access[] = [Access.rnn, Access.rnx, Access.rwn, Access.rwx];
            if ( (allHasAccess(readAccess, file)) ||
              (util.valueExist(this.userId) && memberHasAccess(this.userId, readAccess, file)) ) {
                fileFolders.push(file);
            }
          });
        }
      } else if (filePrivacy === FilePrivacy.Private) {
        fileFolders = FileFoldersCollection.collection.find({
          privacy: { $eq: FilePrivacy.Private },
          status: { $eq: FileStatus.Normalized }
        }).fetch();
      }

      const result: FileFolder[] = [];
      fileFolders.forEach(value => {
        if ( value.name.indexOf(keyword) !== -1 ) {
            result.push(value);
        }
      });

      if (util.valueExist(result)) {
        return response.fetchResponse(result);
      }
    } catch (error) {
      return response.fetchResponse(error, false);
    }
  },

  filterFileFolder(keyword: string, filePrivacy: FilePrivacy = FilePrivacy.Public): R {
    try {
      if ( !this.userId ) {
        throw new Meteor.Error('User is not logged.');
      }

      const fileFolders: FileFolder[] = FileFoldersCollection.collection.find({
        privacy: { $eq: filePrivacy },
        status: { $eq: FileStatus.Normalized }
      }).fetch();

      const result: FilterFileFolder[] = [];
      fileFolders.forEach(value => {
        if ( util.valueExist(value.content) && value.content.indexOf(keyword) !== -1 ) {
          const content = value.content;
          const lines = content.split('\n');
          console.log(lines);
          const resultItem: FilterFileFolder = {
            document: value,
            filterResult: []
          } as FilterFileFolder;
          lines.forEach( (line, index) => {
            if (line.indexOf(keyword) !== -1) {
              const filterResult: FilterResult = {
                from: line.indexOf(keyword),
                end: line.indexOf(keyword) + keyword.length,
                lineNumber: index + 1,
                textSnippet: line
              } as FilterResult;
              resultItem.filterResult.push(filterResult);
            }
          });
          result.push(resultItem);
        }
      });

      if (util.valueExist(result)) {
        return response.fetchResponse(result);
      }
    } catch (error) {
      return response.fetchResponse(error, false);
    }
  },

  fetchPublicFileFolder(): R {
    try {
      const allPublicFiles: FileFolder[] = FileFoldersCollection.collection.find({
        privacy: { $eq: FilePrivacy.Public },
        status: { $eq: FileStatus.Normalized }
      }).fetch();
      if (util.valueExist(allPublicFiles)) {
        const result: FileFolder[] = [];
        allPublicFiles.forEach((file, index) => {
          const readAccess: Access[] = [Access.rnn, Access.rnx, Access.rwn, Access.rwx];
          if ( (allHasAccess(readAccess, file)) ||
            (util.valueExist(this.userId) && memberHasAccess(this.userId, readAccess, file)) ) {
            result.push(file);
          }
        });
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
          const fileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
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
            const updatedFileFolder: FileFolder = FileFoldersCollection.collection.findOne({ _id: { $eq: fileFolderId}});
            return response.fetchResponse(updatedFileFolder);
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
