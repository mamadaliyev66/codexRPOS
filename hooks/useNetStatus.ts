import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { setOnline } from '../redux/slices/syncSlice';

export const useNetStatus = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsub = NetInfo.addEventListener(state => {
      dispatch(setOnline(state.isConnected ?? false));
    });
    return () => unsub();
  }, [dispatch]);
};
