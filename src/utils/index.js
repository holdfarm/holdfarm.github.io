export const formatAddress = (address) => {
  return `${address.substr(0, 5)}...${address.substr(
    address.length - 5,
    address.length
  )}`;
};
