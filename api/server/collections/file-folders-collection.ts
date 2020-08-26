import { MongoObservable } from 'meteor-rxjs';
import { FileFolder } from 'server/models/file-folder';

export const FileFoldersCollection = new MongoObservable.Collection<FileFolder>('file-folders');