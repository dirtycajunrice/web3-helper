export const chainIdToNumber = (chainId: string) => {
  return Number(chainId.split(':')[1])
}