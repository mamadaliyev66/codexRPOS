const rand = () => Math.random().toString(36).slice(2, 7);
export const newOrderId = () => `ord_${Date.now()}_${rand()}`;
export const newItemId  = () => `itm_${Date.now()}_${rand()}`;
export const newUserId  = () => `usr_${Date.now()}_${rand()}`;
