import { providers, utils } from 'ethers'
import { Base64 } from 'js-base64'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'nftgenerator-auth-token'
const TOKEN_DURATION = 1000 * 60 * 60 * 24 * 7 // 7 days

type Claim = {
  iat: number
  exp: number
  iss: string
  aud: string
  tid: string
}

export const getTokenFromStore = (): string | null =>
  window.localStorage.getItem(STORAGE_KEY)

export const setTokenInStore = (token: string): void =>
  window.localStorage.setItem(STORAGE_KEY, token)

export const clearToken = (): void =>
  window.localStorage.removeItem(STORAGE_KEY)

export const signerHelper = async (
  provider: providers.Web3Provider,
  rawMessage: string
): Promise<string> => {
  const ethereum = provider.provider
  const signer = provider.getSigner()
  const address = await signer.getAddress()
  if (!ethereum.request) throw new Error('invalid ethereum provider')

  let params = [rawMessage, address.toLowerCase()]
  if (ethereum.isMetaMask) {
    params = [params[1], params[0]]
  }
  const signature = await ethereum.request({
    method: 'personal_sign',
    params,
  })
  return signature
}

// enum WalletType {
//   EOA,
//   SMART
// }

// async function getWalletType(
//   address: string,
//   provider: providers.BaseProvider
// ): Promise<WalletType> {
//   const code = await provider.getCode(address);
//   return code === "0x" ? WalletType.EOA : WalletType.SMART;
// }

export async function verifySignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  // const walletType = await getWalletType(address, provider);

  // if (walletType === WalletType.EOA) {
  const recoveredAddress = utils.verifyMessage(message, signature)
  return address.toLowerCase() === recoveredAddress.toLowerCase()
  // }

  // // Smart wallet
  // const arrayishMessage = utils.toUtf8Bytes(message);
  // const hexMessage = utils.hexlify(arrayishMessage);
  // const hexArray = utils.arrayify(hexMessage);
  // const hashMessage = utils.hashMessage(hexArray);

  // const smartWalletABI = [
  //   "function isValidSignature(bytes32 _message, bytes _signature) public view returns (bool)",
  // ];
  // const contract = new Contract(address, smartWalletABI, provider);
  // try {
  //   const returnValue = await contract.isValidSignature(hashMessage, signature);
  //   return returnValue;
  // } catch (error) {
  //   throw new Error("unsupported smart wallet");
  // }
}

export const createToken = async (
  provider: providers.Web3Provider
): Promise<string> => {
  const address = await provider.getSigner().getAddress()

  const iat = new Date().getTime()

  const claim = {
    iat,
    exp: iat + TOKEN_DURATION,
    iss: address.toLowerCase(),
    aud: 'nftgenerator',
    tid: uuidv4(),
  }

  const serializedClaim = JSON.stringify(claim)
  const proof = await signerHelper(provider, serializedClaim)

  return Base64.encode(JSON.stringify([proof, serializedClaim]))
}

export const verifyToken = async (token: string): Promise<Claim | null> => {
  try {
    const rawToken = Base64.decode(token)
    const [proof, rawClaim] = JSON.parse(rawToken)
    const claim: Claim = JSON.parse(rawClaim)
    const address = claim.iss

    const valid = await verifySignature(address, rawClaim, proof)
    const expired = claim.exp < new Date().getTime()

    if (!valid) {
      throw new Error('invalid signature')
    }
    if (expired) {
      throw new Error('token expired')
    }
    return claim
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Token verification failed', e)
    return null
  }
}

export const getExistingAuth = async (
  provider: providers.Web3Provider
): Promise<string | null> => {
  const token = getTokenFromStore()
  if (!token) return null

  const signerAddress = await provider.getSigner().getAddress()
  const claim = await verifyToken(token)
  if (!claim || claim.iss.toLowerCase() !== signerAddress.toLowerCase()) {
    clearToken()
    return null
  }
  return token
}

export const authenticateWallet = async (
  ethersProvider: providers.Web3Provider
): Promise<string> => {
  const token = await createToken(ethersProvider)
  setTokenInStore(token)
  return token
}
