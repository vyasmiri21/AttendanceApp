import { useState } from 'react';
import { User } from '../App';
import styles from './UserManagement.module.css';
import { Mail, Briefcase, Trash2, UserPlus, X } from 'lucide-react';

type UserManagementProps = {
  users: User[];
  onAddUser: (user: User) => void;
  onRemoveUser: (userId: string) => void;
};

export function UserManagement({ users, onAddUser, onRemoveUser }: UserManagementProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      role: 'user',
      department: formData.department,
    };
    onAddUser(newUser);
    setFormData({ name: '', email: '', department: '' });
    setShowAddModal(false);
  };

  const handleDelete = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to remove ${userName}?`)) {
      onRemoveUser(userId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Team Members</h2>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={20} />
          <span>Add User</span>
        </button>
      </div>

      <div className={styles.grid}>
        {users.map((user) => (
          <div key={user.id} className={styles.card}>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(user.id, user.name)}
              title="Remove user"
            >
              <Trash2 size={16} />
            </button>
            <div className={styles.avatar}>{user.name.charAt(0)}</div>
            <h3 className={styles.name}>{user.name}</h3>
            <div className={styles.info}>
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            <div className={styles.info}>
              <Briefcase size={16} />
              <span>{user.department}</span>
            </div>
            <div className={styles.footer}>
              <span className={styles.badge}>{user.role}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <>
          <div 
            className={styles.modalOverlay}
            onClick={() => setShowAddModal(false)}
          />
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New User</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Department</label>
                <select
                  className={styles.input}
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                >
                  <option value="">Select department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add User
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}