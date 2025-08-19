import { AppDispatch } from '../redux/store';
import { enqueue } from '../redux/slices/syncSlice';
import { SyncTask } from '../types';

export const addTask = (dispatch: AppDispatch, task: SyncTask) => {
  dispatch(enqueue(task));
};
