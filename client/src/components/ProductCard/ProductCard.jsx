import React from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <div className="userRow"> {/* Используем классы из методички для стиля */}
            <div className="userMain">
                <div className="userId">#{product.id}</div>
                <div className="userName">{product.name}</div>
                <div className="userAge">{product.category} | {product.price} ₽</div>
                <div style={{fontSize: '0.9em', opacity: 0.7}}>Остаток: {product.stock}</div>
            </div>
            <div className="userActions">
                <button className="btn" onClick={() => onEdit(product)}>Изменить</button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>Удалить</button>
            </div>
        </div>
    );
}