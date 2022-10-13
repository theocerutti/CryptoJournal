import { CryptoAddressType } from '../utils/address';

declare module 'yup' {
  interface StringSchema {
    cryptoAddress(type: CryptoAddressType, message: string): StringSchema;
  }
}
