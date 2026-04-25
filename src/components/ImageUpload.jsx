import React, { useState, useRef } from 'react';
import { Button, Card } from 'animal-island-ui';

export default function ImageUpload({ dishImage, onUpload, showToast }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('请上传图片文件', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.success) {
        onUpload(data.image);
        showToast('图片上传成功！', 'success');
      } else {
        showToast(data.error || '上传失败', 'error');
      }
    } catch (error) {
      showToast('上传失败，请重试', 'error');
    } finally {
      setUploading(false);
    }
  };

  const uploadAreaStyle = {
    border: `3px dashed ${dragging ? '#E79796' : '#FFB284'}`,
    borderRadius: '20px',
    padding: '3rem 2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: dragging ? 'rgba(255, 178, 132, 0.2)' : 'rgba(255, 254, 249, 0.5)',
    transform: dragging ? 'scale(1.02)' : 'scale(1)',
    boxShadow: dragging ? '0 8px 24px rgba(231, 151, 150, 0.3)' : 'none'
  };

  return (
    <Card color="app-yellow" style={{ 
      marginBottom: '2.5rem',
      className: 'card-hover'
    }}>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🍽️</div>
        <div>
          <h2 style={{ 
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2rem',
            fontWeight: '600',
            color: '#5D4037',
            margin: 0,
            lineHeight: 1.2
          }}>
            今日菜品
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#A1887F',
            margin: 0,
            marginTop: '0.25rem'
          }}>
            Today's Special Dish
          </p>
        </div>
      </div>
      
      {uploading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem',
          background: 'rgba(255, 254, 249, 0.5)',
          borderRadius: '16px'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            animation: 'rotate 2s linear infinite'
          }}>
            ⏳
          </div>
          <div style={{ 
            fontSize: '1.2rem', 
            color: '#5D4037',
            fontWeight: '500'
          }}>
            正在上传美味图片...
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#A1887F',
            marginTop: '0.5rem'
          }}>
            请稍候片刻
          </div>
        </div>
      ) : dishImage ? (
        <div>
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(93, 64, 55, 0.15)',
            marginBottom: '1.5rem'
          }}>
            <img 
              src={dishImage} 
              alt="菜品图片" 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(93, 64, 55, 0.7), transparent)',
              padding: '2rem 1.5rem 1.5rem',
              color: '#FFFEF9'
            }}>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                ✨ 今日推荐
              </div>
              <div style={{
                fontSize: '0.9rem',
                opacity: 0.9
              }}>
                精心制作的美味凉拌菜
              </div>
            </div>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <Button type="primary" onClick={() => fileInputRef.current.click()}>
              🔄 更换图片
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={uploadAreaStyle}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <div style={{ 
            fontSize: '5rem', 
            marginBottom: '1.5rem',
            animation: 'float 3s ease-in-out infinite'
          }}>
            📸
          </div>
          <div style={{ 
            fontSize: '1.3rem', 
            color: '#5D4037', 
            marginBottom: '0.75rem',
            fontWeight: '500'
          }}>
            点击或拖拽上传菜品图片
          </div>
          <div style={{ 
            fontSize: '1rem', 
            color: '#8D6E63',
            marginBottom: '1rem'
          }}>
            支持 JPG、PNG、GIF、WEBP 格式
          </div>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'rgba(231, 151, 150, 0.2)',
            borderRadius: '20px',
            fontSize: '0.85rem',
            color: '#A1887F'
          }}>
            💡 建议尺寸：宽度 800px 以上
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Card>
  );
}