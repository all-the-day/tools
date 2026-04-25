import React, { useState, useEffect } from 'react';
import { Card } from 'animal-island-ui';
import Toast from './components/Toast';
import ImageUpload from './components/ImageUpload';
import OrderList from './components/OrderList';

export default function App() {
  const [dishImage, setDishImage] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setDishImage(data.dishImage);
      setOrders(data.orders || []);
    } catch (error) {
      showToast('加载数据失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5CEC7 0%, #FFC98B 50%, #F5CEC7 100%)'
      }}>
        <Card color="app-yellow">
          <div style={{ textAlign: 'center', padding: '3rem 4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>
              🍽️
            </div>
            <div style={{ fontSize: '1.2rem', color: '#5D4037', fontWeight: '500' }}>
              正在准备美味...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: '"Noto Sans SC", sans-serif',
      background: 'linear-gradient(135deg, #F5CEC7 0%, #FFC98B 50%, #F5CEC7 100%)',
      color: '#5D4037',
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Enhanced Background decoration */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(255, 178, 132, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(231, 151, 150, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(198, 192, 156, 0.2) 0%, transparent 70%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Decorative Leaves */}
      <div className="decoration-leaf" style={{ fontSize: '2.5rem' }}>🍃</div>
      <div className="decoration-leaf" style={{ fontSize: '2rem' }}>🌿</div>
      <div className="decoration-leaf" style={{ fontSize: '2.2rem' }}>🍃</div>
      <div className="decoration-leaf" style={{ fontSize: '1.8rem' }}>🌿</div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Enhanced Header */}
        <header style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem 3rem',
          animation: 'fadeInDown 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            🥗
          </div>
          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '4rem',
            fontWeight: '700',
            color: '#5D4037',
            marginBottom: '1rem',
            letterSpacing: '0.05em',
            textShadow: '2px 2px 4px rgba(93, 64, 55, 0.15)',
            lineHeight: 1.2
          }}>
            美味凉拌菜
          </h1>
          <div style={{
            width: '80px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, #E79796, transparent)',
            margin: '1.5rem auto',
            borderRadius: '2px'
          }} />
          <p style={{
            fontSize: '1.3rem',
            color: '#8D6E63',
            fontWeight: '300',
            letterSpacing: '0.15em',
            marginBottom: '0.5rem'
          }}>
            Animal Island Style
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#A1887F',
            fontWeight: '400',
            letterSpacing: '0.1em'
          }}>
            🏝️ 用心制作，美味共享 🏝️
          </p>
        </header>

        {/* Main Content */}
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 2rem 4rem'
        }}>
          <div style={{
            animation: 'fadeInUp 0.8s ease-out 0.2s both'
          }}>
            <ImageUpload
              dishImage={dishImage}
              onUpload={setDishImage}
              showToast={showToast}
            />
          </div>

          <div style={{
            animation: 'fadeInUp 0.8s ease-out 0.4s both'
          }}>
            <OrderList
              orders={orders}
              onRefresh={fetchData}
              showToast={showToast}
            />
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#A1887F',
          fontSize: '0.9rem',
          borderTop: '1px solid rgba(231, 151, 150, 0.3)',
          marginTop: '2rem'
        }}>
          <p>✨ 用爱烹饪，用心服务 ✨</p>
        </footer>

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}