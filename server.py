#!/usr/bin/env python3
"""
轻量级点菜系统后端服务
使用 Flask + JSON 文件存储
"""

import os
import json
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename

app = Flask(__name__)

# 配置
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.json')
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# 确保上传目录存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def load_data():
    """从 JSON 文件加载数据"""
    if not os.path.exists(DATA_FILE):
        return {"dishImage": None, "orders": []}
    
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return {"dishImage": None, "orders": []}


def save_data(data):
    """保存数据到 JSON 文件"""
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# 静态文件路由 - 提供构建后的前端文件
@app.route('/')
def index():
    """返回主页面（构建后的版本）"""
    dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist')
    return send_from_directory(dist_dir, 'index.html')


@app.route('/assets/<path:filename>')
def assets_files(filename):
    """返回构建后的静态资源（JS、CSS 等）"""
    dist_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dist', 'assets')
    return send_from_directory(dist_dir, filename)


@app.route('/static/<path:filename>')
def static_files(filename):
    """返回静态文件（上传的图片等）"""
    return send_from_directory(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static'), filename)


# API 路由
@app.route('/api/upload', methods=['POST'])
def upload_image():
    """上传菜品图片"""
    if 'image' not in request.files:
        return jsonify({'error': '没有上传图片'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'error': '没有选择文件'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': '不支持的文件类型'}), 400
    
    # 生成安全的文件名
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"dish_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # 保存文件
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    # 更新数据
    data = load_data()
    # 删除旧图片
    if data.get('dishImage') and data['dishImage'].startswith('uploads/'):
        old_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', data['dishImage'])
        if os.path.exists(old_path):
            os.remove(old_path)
    
    data['dishImage'] = f"uploads/{filename}"
    save_data(data)
    
    return jsonify({
        'success': True,
        'image': f"/static/uploads/{filename}"
    })


@app.route('/api/orders', methods=['GET'])
def get_orders():
    """获取所有点菜记录"""
    data = load_data()
    return jsonify({
        'dishImage': f"/static/{data['dishImage']}" if data.get('dishImage') else None,
        'orders': data.get('orders', [])
    })


@app.route('/api/orders', methods=['POST'])
def add_order():
    """新增点菜记录"""
    data = load_data()
    
    order_data = request.get_json()
    
    if not order_data.get('name') or not order_data.get('dish'):
        return jsonify({'error': '姓名和菜品名称不能为空'}), 400
    
    new_order = {
        'id': str(uuid.uuid4()),
        'name': order_data['name'].strip(),
        'dish': order_data['dish'].strip(),
        'createdAt': datetime.now().isoformat()
    }
    
    data['orders'].append(new_order)
    save_data(data)
    
    return jsonify({'success': True, 'order': new_order}), 201


@app.route('/api/orders/<order_id>', methods=['PUT'])
def update_order(order_id):
    """更新点菜记录"""
    data = load_data()
    
    order_data = request.get_json()
    
    if not order_data.get('name') or not order_data.get('dish'):
        return jsonify({'error': '姓名和菜品名称不能为空'}), 400
    
    # 查找并更新记录
    for i, order in enumerate(data['orders']):
        if order['id'] == order_id:
            data['orders'][i] = {
                'id': order_id,
                'name': order_data['name'].strip(),
                'dish': order_data['dish'].strip(),
                'createdAt': order['createdAt'],
                'updatedAt': datetime.now().isoformat()
            }
            save_data(data)
            return jsonify({'success': True, 'order': data['orders'][i]})
    
    return jsonify({'error': '记录不存在'}), 404


@app.route('/api/orders/<order_id>', methods=['DELETE'])
def delete_order(order_id):
    """删除点菜记录"""
    data = load_data()
    
    # 查找并删除记录
    for i, order in enumerate(data['orders']):
        if order['id'] == order_id:
            data['orders'].pop(i)
            save_data(data)
            return jsonify({'success': True})
    
    return jsonify({'error': '记录不存在'}), 404


if __name__ == '__main__':
    print("=" * 50)
    print("轻量级点菜系统后端服务")
    print("=" * 50)
    print(f"数据文件: {DATA_FILE}")
    print(f"图片目录: {UPLOAD_FOLDER}")
    print("访问地址: http://localhost:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)