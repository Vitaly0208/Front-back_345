import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Новый товар";

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) { alert("Введите название"); return; }
        if (!price || price < 0) { alert("Некорректная цена"); return; }

        onSubmit({
            id: initialProduct?.id,
            name: name.trim(),
            category,
            description,
            price: Number(price),
            stock: Number(stock),
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">Название<input className="input" value={name} onChange={e => setName(e.target.value)} /></label>
                    <label className="label">Категория<input className="input" value={category} onChange={e => setCategory(e.target.value)} /></label>
                    <label className="label">Описание<input className="input" value={description} onChange={e => setDescription(e.target.value)} /></label>
                    <label className="label">Цена (₽)<input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} /></label>
                    <label className="label">Остаток (шт)<input className="input" type="number" value={stock} onChange={e => setStock(e.target.value)} /></label>
                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>Отмена</button>
                        <button type="submit" className="btn btn--primary">{mode === "edit" ? "Сохранить" : "Создать"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}