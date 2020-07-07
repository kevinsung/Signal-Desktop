// Captures the globals put in place by preload.js, background.js and others

import { Ref } from 'react';
import {
  LibSignalType,
  SignalProtocolAddressClass,
  StorageType,
} from './libsignal.d';
import { ContactRecordIdentityState, TextSecureType } from './textsecure.d';
import { WebAPIConnectType } from './textsecure/WebAPI';
import { CallingClass, CallHistoryDetailsType } from './services/calling';
import * as Crypto from './Crypto';
import { ColorType, LocalizerType } from './types/Util';
import { SendOptionsType } from './textsecure/SendMessage';
import Data from './sql/Client';

type TaskResultType = any;

declare global {
  interface Window {
    dcodeIO: DCodeIOType;
    getConversations: () => ConversationControllerType;
    getExpiration: () => string;
    getEnvironment: () => string;
    getSocketStatus: () => number;
    getAlwaysRelayCalls: () => Promise<boolean>;
    getIncomingCallNotification: () => Promise<boolean>;
    getCallRingtoneNotification: () => Promise<boolean>;
    getCallSystemNotification: () => Promise<boolean>;
    getMediaPermissions: () => Promise<boolean>;
    getMediaCameraPermissions: () => Promise<boolean>;
    showCallingPermissionsPopup: (forCamera: boolean) => Promise<void>;
    i18n: LocalizerType;
    libphonenumber: {
      util: {
        getRegionCodeForNumber: (number: string) => string;
      };
    };
    libsignal: LibSignalType;
    log: {
      info: LoggerType;
      warn: LoggerType;
      error: LoggerType;
    };
    normalizeUuids: (obj: any, paths: Array<string>, context: string) => any;
    platform: string;
    restart: () => void;
    showWindow: () => void;
    storage: {
      put: (key: string, value: any) => void;
      remove: (key: string) => void;
      get: <T = any>(key: string) => T | undefined;
      addBlockedNumber: (number: string) => void;
      isBlocked: (number: string) => boolean;
      removeBlockedNumber: (number: string) => void;
    };
    textsecure: TextSecureType;

    Signal: {
      Crypto: typeof Crypto;
      Data: typeof Data;
      Metadata: {
        SecretSessionCipher: typeof SecretSessionCipherClass;
        createCertificateValidator: (
          trustRoot: ArrayBuffer
        ) => CertificateValidatorType;
      };
      Services: {
        calling: CallingClass;
      };
    };
    ConversationController: ConversationControllerType;
    WebAPI: WebAPIConnectType;
    Whisper: WhisperType;

    // Flags
    CALLING: boolean;
  }

  interface Error {
    cause?: Event;
  }
}

export type ConversationAttributes = {
  e164?: string | null;
  isArchived?: boolean;
  profileFamilyName?: string | null;
  profileKey?: string | null;
  profileName?: string | null;
  profileSharing?: boolean;
  name?: string;
  storageID?: string;
  uuid?: string | null;
  verified?: number;
};

export type ConversationType = {
  attributes: ConversationAttributes;
  fromRecordVerified: (
    verified: ContactRecordIdentityState
  ) => ContactRecordIdentityState;
  set: (props: Partial<ConversationAttributes>) => void;
  updateE164: (e164?: string) => void;
  updateUuid: (uuid?: string) => void;
  id: string;
  get: (key: string) => any;
  getAvatarPath(): string | undefined;
  getColor(): ColorType | undefined;
  getName(): string | undefined;
  getNumber(): string;
  getProfiles(): Promise<Array<Promise<void>>>;
  getProfileName(): string | undefined;
  getRecipients: () => Array<string>;
  getSendOptions(): SendOptionsType;
  getTitle(): string;
  isVerified(): boolean;
  safeGetVerified(): Promise<number>;
  getIsAddedByContact(): boolean;
  addCallHistory(details: CallHistoryDetailsType): void;
  toggleVerified(): Promise<TaskResultType>;
};

export type ConversationControllerType = {
  getOrCreateAndWait: (
    identifier: string,
    type: 'private' | 'group'
  ) => Promise<ConversationType>;
  getOrCreate: (
    identifier: string,
    type: 'private' | 'group'
  ) => ConversationType;
  getConversationId: (identifier: string) => string | null;
  ensureContactIds: (o: { e164?: string; uuid?: string }) => string;
  getOurConversationId: () => string | null;
  prepareForSend: (
    id: string,
    options: Object
  ) => {
    wrap: (promise: Promise<any>) => Promise<void>;
    sendOptions: Object;
  };
  get: (identifier: string) => null | ConversationType;
  map: (mapFn: (conversation: ConversationType) => any) => any;
};

export type DCodeIOType = {
  ByteBuffer: typeof ByteBufferClass;
  Long: {
    fromBits: (low: number, high: number, unsigned: boolean) => number;
  };
};

export class CertificateValidatorType {
  validate: (cerficate: any, certificateTime: number) => Promise<void>;
}

export class SecretSessionCipherClass {
  constructor(storage: StorageType);
  decrypt: (
    validator: CertificateValidatorType,
    ciphertext: ArrayBuffer,
    serverTimestamp: number,
    me: any
  ) => Promise<{
    isMe: boolean;
    sender: SignalProtocolAddressClass;
    senderUuid: SignalProtocolAddressClass;
    content: ArrayBuffer;
  }>;
  getRemoteRegistrationId: (
    address: SignalProtocolAddressClass
  ) => Promise<number>;
  closeOpenSessionForDevice: (
    address: SignalProtocolAddressClass
  ) => Promise<void>;
  encrypt: (
    address: SignalProtocolAddressClass,
    senderCertificate: any,
    plaintext: ArrayBuffer | Uint8Array
  ) => Promise<ArrayBuffer>;
}

export class ByteBufferClass {
  constructor(value?: any, encoding?: string);
  static wrap: (value: any, type?: string) => ByteBufferClass;
  toString: (type: string) => string;
  toArrayBuffer: () => ArrayBuffer;
  toBinary: () => string;
  slice: (start: number, end?: number) => ByteBufferClass;
  append: (data: ArrayBuffer) => void;
  limit: number;
  offset: 0;
  readVarint32: () => number;
  skip: (length: number) => void;
}

export class GumVideoCapturer {
  constructor(
    maxWidth: number,
    maxHeight: number,
    maxFramerate: number,
    localPreview: Ref<HTMLVideoElement>
  );
}

export class CanvasVideoRenderer {
  constructor(canvas: Ref<HTMLCanvasElement>);
}

export type LoggerType = (...args: Array<any>) => void;

export type WhisperType = {
  events: {
    trigger: (name: string, param1: any, param2: any) => void;
  };
  Database: {
    open: () => Promise<IDBDatabase>;
    handleDOMException: (
      context: string,
      error: DOMException | null,
      reject: Function
    ) => void;
  };
};
