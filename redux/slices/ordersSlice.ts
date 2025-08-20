import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderItem, OrderStatus, Payment, SyncTask } from '../../types';
import { listOrdersByStatus, createOrder as svcCreate, addItem as svcAddItem, updateOrderStatus as svcSetStatus, addPayment as svcAddPayment, closeOrder as svcClose } from '../../services/orders';
import { enqueue } from './syncSlice';
import { RootState } from '../store';

type Lists = Record<OrderStatus, string[]>;

type OrdersState = {
  byId: Record<string, Order>;
  lists: Lists;
  loading: boolean;
  error?: string;
};

const initLists = (): Lists => ({ yangi: [], oshxonada: [], tayyor: [], yopilgan: [] });
const initialState: OrdersState = { byId: {}, lists: initLists(), loading: false };

export const fetchByStatus = createAsyncThunk('orders/fetchByStatus', async (status: OrderStatus) => {
  const list = await listOrdersByStatus(status);
  return { status, list };
});

export const createOrder = createAsyncThunk<Order, Order, { state: RootState }>(
  'orders/create',
  async (order, { getState, dispatch }) => {
    const { online } = getState().sync;
    if (online) {
      await svcCreate(order);
    } else {
      const task: SyncTask = {
        id: `sync_order_${order.id}`,
        createdAt: Date.now(),
        retries: 0,
        op: { type: 'CREATE_ORDER', payload: order },
      };
      dispatch(enqueue(task));
    }
    return order;
  },
);

export const addItemToOrder = createAsyncThunk<{ orderId: string; item: OrderItem }, { orderId: string; item: OrderItem }, { state: RootState }>(
  'orders/addItem',
  async ({ orderId, item }, { getState, dispatch }) => {
    const state = getState();
    const online = state.sync.online;
    if (online) {
      await svcAddItem(orderId, item);
    } else {
      // We queue a full UPSERT_ORDER with the updated order snapshot
      const order = state.orders.byId[orderId];
      if (order) {
        const updated: Order = { ...order, items: [...order.items, item] };
        const task: SyncTask = {
          id: `sync_upsert_order_${orderId}_${Date.now()}`,
          createdAt: Date.now(),
          retries: 0,
          op: { type: 'UPSERT_ORDER', payload: updated },
        };
        dispatch(enqueue(task));
      }
    }
    return { orderId, item };
  },
);

export const setOrderStatus = createAsyncThunk<{ orderId: string; status: OrderStatus }, { orderId: string; status: OrderStatus }, { state: RootState }>(
  'orders/setStatus',
  async ({ orderId, status }, { getState, dispatch }) => {
    const { online } = getState().sync;
    if (online) {
      await svcSetStatus(orderId, status);
    } else {
      const cur = getState().orders.byId[orderId];
      if (cur) {
        const updated: Order = { ...cur, status };
        const task: SyncTask = {
          id: `sync_status_${orderId}_${Date.now()}`,
          createdAt: Date.now(),
          retries: 0,
          op: { type: 'UPSERT_ORDER', payload: updated },
        };
        dispatch(enqueue(task));
      }
    }
    return { orderId, status };
  },
);

export const addPayment = createAsyncThunk<{ orderId: string; payment: Payment }, { orderId: string; payment: Payment }, { state: RootState }>(
  'orders/addPayment',
  async ({ orderId, payment }, { getState, dispatch }) => {
    const { online } = getState().sync;
    if (online) {
      await svcAddPayment(orderId, payment);
    } else {
      const cur = getState().orders.byId[orderId];
      if (cur) {
        const updated: Order = { ...cur, payments: [...(cur.payments || []), payment] };
        const task: SyncTask = {
          id: `sync_payment_${orderId}_${Date.now()}`,
          createdAt: Date.now(),
          retries: 0,
          op: { type: 'UPSERT_ORDER', payload: updated },
        };
        dispatch(enqueue(task));
      }
    }
    return { orderId, payment };
  },
);

export const closeOrder = createAsyncThunk<string, string, { state: RootState }>(
  'orders/close',
  async (orderId, { getState, dispatch }) => {
    const { online } = getState().sync;
    if (online) {
      await svcClose(orderId);
    } else {
      const cur = getState().orders.byId[orderId];
      if (cur) {
        const updated: Order = { ...cur, status: 'yopilgan', closedAt: Date.now() };
        const task: SyncTask = {
          id: `sync_close_${orderId}_${Date.now()}`,
          createdAt: Date.now(),
          retries: 0,
          op: { type: 'UPSERT_ORDER', payload: updated },
        };
        dispatch(enqueue(task));
      }
    }
    return orderId;
  },
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // handy for UI
    upsertLocal(state, action: PayloadAction<Order>) {
      const o = action.payload;
      state.byId[o.id] = o;
      // ensure in list:
      (Object.keys(state.lists) as OrderStatus[]).forEach((st) => {
        state.lists[st] = state.lists[st].filter((id) => id !== o.id);
      });
      state.lists[o.status] = Array.from(new Set([o.id, ...state.lists[o.status]]));
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchByStatus.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(fetchByStatus.fulfilled, (s, a) => {
      s.loading = false;
      for (const o of a.payload.list) {
        s.byId[o.id] = o;
      }
      s.lists[a.payload.status] = a.payload.list.map((o) => o.id);
    });
    b.addCase(fetchByStatus.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message || a.error); });

    b.addCase(createOrder.fulfilled, (s, a) => {
      const o = a.payload;
      s.byId[o.id] = o;
      s.lists[o.status] = [o.id, ...s.lists[o.status]];
    });

    b.addCase(addItemToOrder.fulfilled, (s, a) => {
      const o = s.byId[a.payload.orderId];
      if (o) o.items = [...o.items, a.payload.item];
    });

    b.addCase(setOrderStatus.fulfilled, (s, a) => {
      const { orderId, status } = a.payload;
      const o = s.byId[orderId];
      if (!o) return;
      // remove from old list
      (Object.keys(s.lists) as OrderStatus[]).forEach((st) => {
        s.lists[st] = s.lists[st].filter((id) => id !== orderId);
      });
      o.status = status;
      s.lists[status] = [orderId, ...s.lists[status]];
    });

    b.addCase(addPayment.fulfilled, (s, a) => {
      const o = s.byId[a.payload.orderId];
      if (!o) return;
      o.payments = [...(o.payments || []), a.payload.payment];
    });

    b.addCase(closeOrder.fulfilled, (s, a) => {
      const id = a.payload;
      const o = s.byId[id];
      if (!o) return;
      (Object.keys(s.lists) as OrderStatus[]).forEach((st) => {
        s.lists[st] = s.lists[st].filter((x) => x !== id);
      });
      o.status = 'yopilgan';
      s.lists['yopilgan'] = [id, ...s.lists['yopilgan']];
    });
  },
});

export const { upsertLocal } = ordersSlice.actions;
export default ordersSlice.reducer;
