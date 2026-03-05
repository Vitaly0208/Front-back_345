import React from 'react';

const UserItem = ({ user, onEdit, onDelete }) => {

    if (!user) {
        return null;
    }

    return (
        <li className="user-item">
            <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-age">, {user.age} лет</span>
                <span className="user-id" title="ID пользователя">
          #{user.id}
        </span>
            </div>
            <div className="user-actions">
                <button
                    className="btn btn-sm btn-edit"
                    onClick={() => onEdit(user)}
                    aria-label={`Редактировать ${user.name}`}
                >
                    ✎
                </button>
                <button
                    className="btn btn-sm btn-delete"
                    onClick={() => onDelete(user.id)}
                    aria-label={`Удалить ${user.name}`}
                >
                    ✕
                </button>
            </div>
        </li>
    );
};

export default UserItem;