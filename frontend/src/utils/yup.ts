import { addMethod, string } from 'yup';
import { CryptoAddressType, isValidCryptoAddress } from './address';

export const setupYup = () => {
  addMethod(
    string,
    'cryptoAddress',
    function (type: CryptoAddressType, message: string) {
      return this.test('isCryptoAddress', message, (value) => {
        return isValidCryptoAddress(value, type);
      });
    }
  );
};
