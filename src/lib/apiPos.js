import { supabase } from './supabaseClient';
import { addInventoryMovement } from './apiInventory';

export async function processPosSale({ items, adminId }) {
  const totalAmount = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: null,
      total_amount: totalAmount,
      status: 'Completed',
    })
    .select('id')
    .single();

  if (orderError) throw orderError;

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  for (const item of items) {
    await addInventoryMovement({
      productId: item.productId,
      movementType: 'pos_sale',
      quantity: item.quantity,
      notes: `POS Sale - Order ${order.id.slice(0, 8)}`,
      createdBy: adminId,
    });
  }

  return { orderId: order.id, totalAmount };
}
