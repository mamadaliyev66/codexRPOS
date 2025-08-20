import NetInfo from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setOnline } from '../redux/slices/syncSlice';

export function useNetStatus() {
  const dispatch = useDispatch();
  useEffect(() => {
    const sub = NetInfo.addEventListener((s) => {
      dispatch(setOnline(Boolean(s.isConnected)));
    });
    NetInfo.fetch().then((s) => dispatch(setOnline(Boolean(s.isConnected))));
    return () => sub();
  }, [dispatch]);
}
