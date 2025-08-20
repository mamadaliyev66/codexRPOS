import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { dequeue, setSyncError } from '../redux/slices/syncSlice';
import { runSyncTask } from '../services/sync';

export function useSyncQueue() {
  const dispatch = useDispatch();
  const { online, queue } = useSelector((s: RootState) => s.sync);
  const busy = useRef(false);

  useEffect(() => {
    if (!online || !queue.length || busy.current) return;
    busy.current = true;

    (async () => {
      for (const task of queue) {
        try {
          await runSyncTask(task);
          dispatch(dequeue(task.id));
          dispatch(setSyncError(undefined));
        } catch (e: any) {
          dispatch(setSyncError(String(e?.message || e)));
          // light backoff before trying again on next effect
          await new Promise((r) => setTimeout(r, 1500));
          break;
        }
      }
      busy.current = false;
    })();
  }, [online, queue, dispatch]);
}
