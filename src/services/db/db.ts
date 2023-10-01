/**
 * Copyright 2023 Eugene Khyst
 * SPDX-License-Identifier: Apache-2.0
 */

import {DBSchema, IDBPDatabase, openDB} from 'idb';
import {ColorPickerSettings, PaintMix, PaintSetDefinition, PaintType} from '../color';

interface ArtistAssistAppDB extends DBSchema {
  'paint-sets': {
    value: PaintSetDefinition;
    key: PaintType;
    indexes: {'by-timestamp': number};
  };
  'image-file': {
    value: File;
    key: number;
  };
  'color-picker': {
    value: ColorPickerSettings;
    key: number;
  };
  'paint-mixes': {
    value: PaintMix;
    key: string;
  };
}

export const dbPromise: Promise<IDBPDatabase<ArtistAssistAppDB>> = openDB<ArtistAssistAppDB>(
  'artist-assist-app-db',
  2,
  {
    upgrade(db: IDBPDatabase<ArtistAssistAppDB>) {
      if (!db.objectStoreNames.contains('paint-sets')) {
        const paintSetStore = db.createObjectStore('paint-sets', {
          keyPath: 'type',
        });
        paintSetStore.createIndex('by-timestamp', 'timestamp');
      }
      if (!db.objectStoreNames.contains('color-picker')) {
        db.createObjectStore('color-picker');
      }
      if (!db.objectStoreNames.contains('paint-mixes')) {
        db.createObjectStore('paint-mixes', {
          keyPath: 'id',
        });
      }
      if (!db.objectStoreNames.contains('image-file')) {
        db.createObjectStore('image-file');
      }
    },
  }
);
