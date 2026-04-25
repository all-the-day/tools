import React, { useState } from 'react';
import { Button, Card, Input } from 'animal-island-ui';

function OrderItem({ order, onEdit, onDelete, showToast, index }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(order.name);
  const [editDish, setEditDish] = useState(order.dish);

  const handleSave = async () => {
    if (!editName.trim() || !editDish.trim()) {
      showToast('姓名和菜品名称不能为空', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, dish: editDish })
      });
      const data = await response.json();

      if (data.success) {
        onEdit(data.order);
        setEditing(false);
        showToast('修改成功！', 'success');
      } else {
        showToast(data.error || '修改失败', 'error');
      }
    } catch (error) {
      showToast('修改失败，请重试', 'error');
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这条记录吗？')) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        onDelete(order.id);
        showToast('删除成功！', 'success');
      } else {
        showToast(data.error || '删除失败', 'error');
      }
    } catch (error) {
      showToast('删除失败，请重试', 'error');
    }
  };

  if (editing) {
    return (
      <Card color="app-blue" style={{ 
        marginBottom: '1rem',
        animation: 'scaleIn 0.3s ease-out',
        className: 'card-hover'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem', 
          marginBottom: '1rem' 
        }}>
          <Input
            placeholder="请输入姓名"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Input
            placeholder="请输入菜品名称"
            value={editDish}
            onChange={(e) => setEditDish(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button type="primary" onClick={handleSave}>✓ 保存</Button>
          <Button onClick={() => setEditing(false)}>✕ 取消</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card color="app-green" style={{ 
      marginBottom: '1rem',
      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
      className: 'card-hover'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E79796 0%, #FFB284 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              fontWeight: '600',
              color: '#FFFEF9',
              boxShadow: '0 2px 8px rgba(231, 151, 150, 0.3)'
            }}>
              {order.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '600', 
              color: '#5D4037' 
            }}>
              {order.name}
            </div>
          </div>
          <div style={{ 
            fontSize: '1.1rem', 
            color: '#8D6E63', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            paddingLeft: '3.25rem'
          }}>
            <span style={{ color: '#FFB284', fontSize: '1.3rem' }}>→</span>
            <span style={{ fontWeight: '500' }}>{order.dish}</span>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <Button onClick={() => setEditing(true)}>✏️ 编辑</Button>
          <Button type="danger" onClick={handleDelete}>🗑️ 删除</Button>
        </div>
      </div>
    </Card>
  );
}

export default function OrderList({ orders, onRefresh, showToast }) {
  const [name, setName] = useState('');
  const [dish, setDish] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !dish.trim()) {
      showToast('姓名和菜品名称不能为空', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dish })
      });
      const data = await response.json();

      if (data.success) {
        onRefresh();
        setName('');
        setDish('');
        showToast('添加成功！', 'success');
      } else {
        showToast(data.error || '添加失败', 'error');
      }
    } catch (error) {
      showToast('添加失败，请重试', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (updatedOrder) => {
    onRefresh();
  };

  const handleDelete = (orderId) => {
    onRefresh();
  };

  return (
    <Card color="app-yellow" style={{ className: 'card-hover' }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🍽️</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#5D4037',
            margin: 0,
            lineHeight: 1.2
          }}>
            点菜清单
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#A1887F',
            margin: 0,
            marginTop: '0.25rem'
          }}>
            Order List · {orders.length} 人已点菜
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          alignItems: 'end',
          marginBottom: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              color: '#8D6E63',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              姓名
            </label>
            <Input
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              color: '#8D6E63',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              菜品名称
            </label>
            <Input
              placeholder="请输入想吃的菜"
              value={dish}
              onChange={(e) => setDish(e.target.value)}
              disabled={submitting}
            />
          </div>
          <Button type="primary" disabled={submitting} style={{ height: 'fit-content' }}>
            {submitting ? '添加中...' : '➕ 添加'}
          </Button>
        </div>
      </form>

      <div>
        {orders.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            color: '#A1887F',
            background: 'rgba(255, 254, 249, 0.5)',
            borderRadius: '16px'
          }}>
            <div style={{ 
              fontSize: '5rem', 
              marginBottom: '1.5rem', 
              opacity: 0.4,
              animation: 'float 3s ease-in-out infinite'
            }}>
              📝
            </div>
            <p style={{ 
              fontSize: '1.3rem', 
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}>
              还没有人点菜
            </p>
            <p style={{ fontSize: '1rem', opacity: 0.8 }}>
              快来添加第一个吧！
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order, index) => (
              <OrderItem
                key={order.id}
                order={order}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showToast={showToast}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}