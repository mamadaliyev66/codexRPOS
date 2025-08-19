import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { processQueue } from '../redux/slices/syncSlice';

export const useSyncQueue = () => {
  const dispatch = useDispatch();
  const { online, queue } = useSelector((s: RootState) => s.sync);

  useEffect(() => {
    if (online && queue.length) {
      dispatch(processQueue());
    }
  }, [online, queue.length, dispatch]);
};
