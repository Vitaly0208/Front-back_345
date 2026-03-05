import React, { useState, useEffect } from 'react';
import { api } from '../api';
import UserItem from '../components/UserItem';
import UserModal from '../components/UserModal';


const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await api.getUsers();

            console.log('📦 Полученные данные с сервера:', data);
            console.log('📦 Тип данных:', Array.isArray(data) ? 'массив' : typeof data);

            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Не удалось загрузить пользователей');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreate = async (userData) => {
        try {
            await api.createUser(userData);
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            setError('Ошибка при создании пользователя');
            console.error('Create error:', err);
        }
    };

    const handleUpdate = async (id, userData) => {
        try {
            await api.updateUser(id, userData);
            setIsModalOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            setError('Ошибка при обновлении пользователя');
            console.error('Update error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этого пользователя?')) return;
        try {
            await api.deleteUser(id);
            fetchUsers();
        } catch (err) {
            setError('Ошибка при удалении пользователя');
            console.error('Delete error:', err);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="users-page">
            <div className="page-header">
                <h1>Пользователи</h1>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    + Добавить
                </button>
            </div>

            {users.length === 0 ? (
                <p className="empty">Список пользователей пуст</p>
            ) : (
                <ul className="users-list">
                    {users.map((user) => (
                        <UserItem
                            key={user.id}
                            user={user}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <UserModal
                    user={editingUser}
                    onClose={closeModal}
                    onSave={editingUser ? handleUpdate : handleCreate}
                />
            )}
        </div>
    );
};

export default UsersPage;