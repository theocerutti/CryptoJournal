export enum CryptoAddressType {
  ERC20,
  BTC,
}

const regexFromAddressType: { [key in CryptoAddressType]: RegExp } = {
  [CryptoAddressType.ERC20]: /^0x[a-fA-F0-9]{40}$/,
  [CryptoAddressType.BTC]: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
};

export const isValidCryptoAddress = (address: string, type: CryptoAddressType): boolean => {
  return regexFromAddressType[type].test(address);
};
