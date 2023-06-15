import mw from '@game/middleware';
import { useDispatch } from 'react-redux';
import { setConnected, setUserWallet } from './redux/store';

export async function login(dispatch: ReturnType<typeof useDispatch>): Promise<boolean> {
  const walletResult = await mw.userWalletLogin('metamask');
  if (walletResult.success) {
    dispatch(setUserWallet(walletResult.result));
    dispatch(setConnected(true));
  }
  return walletResult.success;
}
