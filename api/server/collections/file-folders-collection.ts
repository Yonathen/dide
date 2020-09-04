import { MongoObservable } from 'meteor-rxjs';
import { FileFolder } from '../models/file-folder';

export const FileFoldersCollection = new MongoObservable.Collection<FileFolder>('file-folders');
