import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, LogOut, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(user?.email);
    setCopied(true);
    toast.success('Email copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-primary">Profile</h2>
        <p className="text-sm text-text-muted mt-0.5">Your account information</p>
      </div>

      {/* Avatar card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-primary text-accent flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>

            <div>
              <h3 className="text-lg font-bold text-primary">{user?.username}</h3>
              <p className="text-sm text-text-muted">{user?.email}</p>
              {user?.systemUser && (
                <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-accent">
                  <Shield size={11} />
                  System Operator
                </span>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Info rows */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <Card padding={false}>
          <div className="px-5 py-4 border-b border-border">
            <h4 className="text-sm font-semibold text-primary">Account Details</h4>
          </div>

          {[
            { icon: User, label: 'Username', value: user?.username },
            { icon: Mail, label: 'Email', value: user?.email, action: copyEmail, actionIcon: copied ? Check : Copy },
            {
              icon: Shield,
              label: 'Role',
              value: user?.systemUser ? 'System Operator' : 'Standard User',
            },
          ].map(({ icon: Icon, label, value, action, actionIcon: ActionIcon }) => (
            <div
              key={label}
              className="flex items-center gap-4 px-5 py-4 border-b last:border-b-0 border-border hover:bg-surface/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted">{label}</p>
                <p className="text-sm font-medium text-primary truncate">{value}</p>
              </div>
              {action && ActionIcon && (
                <button onClick={action} className="text-text-muted hover:text-primary transition-colors">
                  <ActionIcon size={15} />
                </button>
              )}
            </div>
          ))}
        </Card>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="border-red-100">
          <h4 className="text-sm font-semibold text-primary mb-4">Session</h4>
          <Button
            variant="danger"
            icon={LogOut}
            onClick={() => setLogoutConfirm(true)}
            fullWidth
          >
            Sign Out
          </Button>
        </Card>
      </motion.div>

      {/* Logout confirm modal */}
      <Modal
        isOpen={logoutConfirm}
        onClose={() => setLogoutConfirm(false)}
        title="Sign Out"
      >
        <div className="space-y-5">
          <p className="text-sm text-text-muted">
            Are you sure you want to sign out of LedgerX? You'll need to log in again to access
            your accounts.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
