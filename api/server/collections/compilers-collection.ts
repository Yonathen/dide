import { MongoObservable } from 'meteor-rxjs';
import { Compiler } from 'server/models/compiler';

export const CompilersCollection = new MongoObservable.Collection<Compiler>('compilers');