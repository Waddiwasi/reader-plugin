declare namespace chrome {
  export namespace storage {
    export interface StorageChange {
      oldValue?: any;
      newValue?: any;
    }

    export interface StorageChanges {
      [key: string]: StorageChange;
    }

    export interface StorageArea {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
    }

    export interface StorageOnChangedEvent {
      addListener(callback: (changes: StorageChanges, areaName: string) => void): void;
    }

    export const sync: StorageArea;
    export const local: StorageArea;
    export const onChanged: StorageOnChangedEvent;
  }
}
