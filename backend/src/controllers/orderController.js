import pool from '../config/db.js';
import { sendOrderEmail } from '../utils/emailService.js';

// @desc    Get user orders
// @route   GET /api/orders/me
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Correctly using authenticated user

    const ordersRes = await pool.query(
      `SELECT o.*, 
        (SELECT json_agg(json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price_at_time', oi.price_at_time,
          'name', p.name,
          'image_url', p.image_url
        )) 
         FROM order_items oi 
         JOIN products p ON oi.product_id = p.id 
         WHERE oi.order_id = o.id
        ) as items
       FROM orders o 
       WHERE o.user_id = $1 
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(ordersRes.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Cancel an order
// @route   PATCH /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check if order exists and belongs to user
    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, userId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderRes.rows[0].status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    // Restore stock for all items in the order
    const itemsRes = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [id]);
    for (const item of itemsRes.rows) {
      await client.query('UPDATE products SET stock = stock + $1 WHERE id = $2', [item.quantity, item.product_id]);
    }

    // Update order status
    const updatedOrder = await client.query(
      "UPDATE orders SET status = 'cancelled' WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Order cancelled successfully', order: updatedOrder.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Server error cancelling order' });
  } finally {
    client.release();
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const client = await pool.connect();
  const userId = req.user.id;
  const user = req.user;
  
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    await client.query('BEGIN');

    let totalAmount = 0;
    const orderItemsData = [];

    // Verify stock and calculate correct total directly from the database
    for (const item of items) {
      const productRes = await client.query('SELECT id, name, price, stock, image_url FROM products WHERE id = $1 FOR UPDATE', [item.productId]);
      if (productRes.rows.length === 0) {
        throw new Error(`Product ID ${item.productId} not found`);
      }
      
      const product = productRes.rows[0];
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product. Only ${product.stock} left for product ID ${item.productId}`);
      }

      totalAmount += (product.price * item.quantity);
      orderItemsData.push({
        productId: product.id,
        name: product.name,
        quantity: item.quantity,
        priceAtTime: product.price,
        image_url: product.image_url
      });

      // Deduct stock
      await client.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, product.id]);
    }

    // Insert into Orders Table
    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address)
       VALUES ($1, $2, $3) RETURNING id, status, created_at`,
      [userId, totalAmount, shippingAddress]
    );
    const orderId = orderRes.rows[0].id;

    // Insert into Order Items Table
    for (const orderItem of orderItemsData) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
         VALUES ($1, $2, $3, $4)`,
        [orderId, orderItem.productId, orderItem.quantity, orderItem.priceAtTime]
      );
    }

    await client.query('COMMIT');

    // Trigger confirmation email
    // Passing full order details to avoid another DB hit
    const orderDetails = {
      id: orderId,
      totalAmount,
      shippingAddress,
      createdAt: orderRes.rows[0].created_at
    };
    
    // Non-blocking email trigger
    sendOrderEmail(user, orderDetails, orderItemsData);
    
    res.status(201).json({
      message: 'Order created successfully!',
      orderId: orderId,
      status: orderRes.rows[0].status,
      totalAmount
    });
  } catch (error) {
    if (client) await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(500).json({ message: error.message || 'Server error creating order' });
  } finally {
    client.release();
  }
};
