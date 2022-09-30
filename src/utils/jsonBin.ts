import { Domain } from '@utils/contracts/ERC20Permit';

const url = 'https://api.jsonbin.io/v3/b';

export const permitToJson = (
  account: string,
  spender: string,
  domain: Domain,
  amount: string,
  deadline: string,
  signedMessage: string,
) => {
  return JSON.stringify({
    account,
    spender,
    domain,
    amount,
    deadline,
    signedMessage
  })
}

export const postJSON = async (data: string) => {
  const response =  await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': '$2b$10$NQ8XUoWWBBRsojU97ju5xuWUgu9L9HXhF5Oezm9PhyhdPiLSqk3Ou',
      'X-Collection-Id': '6337471d71de7e26c6a7c226',
      'X-Bin-Private': 'true',
      // 'X-Bin-Name': 'something'
    },
    body: data
  })
  console.log(response);
}
