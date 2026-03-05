import React, { useState, useEffect } from 'react';



const UserModal = ({ user, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setAge(user.age?.toString() || '');
        } else {
            setName('');
            setAge('');
        }
        setErrors({});
    }, [user]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Имя обязательно';
        if (!age || isNaN(age) || Number(age) < 0) {
            newErrors.age = 'Введите корректный возраст';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const userData = {
            name: name.trim(),
            age: Number(age),
        };
        if (user?.id) {
            onSave(user.id, userData);
        } else {
            onSave(userData);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{user ? 'Редактировать' : 'Новый пользователь'}</h2>
                    <button className="btn-close" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="name">Имя *</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errors.name ? 'error' : ''}
                            placeholder="Введите имя"
                            autoFocus
                        />
                        {errors.name && <span className="error-msg">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Возраст *</label>
                        <input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className={errors.age ? 'error' : ''}
                            placeholder="Введите возраст"
                            min="0"
                        />
                        {errors.age && <span className="error-msg">{errors.age}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {user ? 'Сохранить' : 'Создать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;