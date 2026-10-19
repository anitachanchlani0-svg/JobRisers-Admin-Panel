import { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Building,
  Key,
  Lock,
  Clock,
  Globe,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Calendar,
  Layers,
  ArrowRight,
  Download,
  Eye,
  EyeOff,
  History,
  FileText,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Modal, StatusPill } from '@/components/ui';
import { initialAdminUserProfile, type AdminUserProfile } from '@/mock-data';

interface AdminProfilePageProps {
  currentRoleName?: string;
}

export function AdminProfilePage({ currentRoleName }: AdminProfilePageProps) {
  const [profile, setProfile] = useState<AdminUserProfile>(initialAdminUserProfile);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState(profile.name);
  const [editDepartment, setEditDepartment] = useState(profile.department);
  const [editTimezone, setEditTimezone] = useState(profile.timezone);
  const [editBio, setEditBio] = useState(profile.bio);

  // Change Password Form State (UI Only)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const displayRole = currentRoleName || profile.role;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setProfile((prev) => ({
      ...prev,
      name: editName.trim(),
      department: editDepartment.trim(),
      timezone: editTimezone.trim(),
      bio: editBio.trim(),
    }));
    setIsEditModalOpen(false);
    showToast('Admin profile details updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current administrative password.');
      return;
    }
    if (newPassword.length < 12) {
      setPasswordError('New password must contain at least 12 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password updated (Mock UI demonstration). No live credentials stored.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-card p-3.5 shadow-2xl text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
          <span className="font-semibold text-foreground">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Profile Header Hero Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-extrabold text-2xl shadow-lg shadow-primary/25">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card shadow-sm" title="Active Platform Administrator">
                <Check size={12} strokeWidth={3} />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
                  {profile.name}
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">
                  {displayRole}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  {profile.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} className="text-primary" />
                  {profile.email}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Building size={13} className="text-muted-foreground" />
                  Staff ID: {profile.staffId}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              type="button"
              data-testid="btn-edit-admin-profile"
              onClick={() => {
                setEditName(profile.name);
                setEditDepartment(profile.department);
                setEditTimezone(profile.timezone);
                setEditBio(profile.bio);
                setIsEditModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-sm"
            >
              <Edit2 size={14} className="text-muted-foreground" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              data-testid="btn-change-admin-password"
              onClick={() => {
                setPasswordError(null);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setIsPasswordModalOpen(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-sm"
            >
              <Lock size={14} />
              <span>Change Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Information & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Account Information */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <User size={16} className="text-primary" />
                Administrative Account Information
              </h3>
              <span className="text-[10px] text-muted-foreground font-medium">
                DPDP Act 2023 Identity Managed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">Department / Team</div>
                <div className="font-semibold text-foreground">{profile.department}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">Administrative Role</div>
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Shield size={13} className="text-primary" />
                  {displayRole} (Platform Governance)
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">Account Created</div>
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar size={13} className="text-muted-foreground" />
                  {profile.accountCreated}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-muted-foreground">Operational Timezone</div>
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <Globe size={13} className="text-muted-foreground" />
                  {profile.timezone}
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="text-[11px] text-muted-foreground">Administrative Scope & Bio</div>
                <p className="text-foreground leading-relaxed mt-0.5 text-xs bg-muted/30 p-3 rounded-xl border border-border/50">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Recent Administrative Activity / Audit Ledger */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History size={16} className="text-primary" />
                  Recent Administrative Actions & Audit Ledger
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Immutable chronological log of platform operations performed by your identity.
                </p>
              </div>
              <button
                type="button"
                onClick={() => showToast('Audit trail CSV export initiated.')}
                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline px-2.5 py-1 rounded-lg border border-primary/20 bg-primary/5 cursor-pointer"
              >
                <Download size={12} />
                <span>Export Ledger</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/20">
                    <th className="py-2.5 px-3">Action Description</th>
                    <th className="py-2.5 px-3">Target Entity</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {profile.recentActivity.map((act) => (
                    <tr key={act.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-foreground">
                        {act.action}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                        {act.target}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground text-[11px]">
                        {act.timestamp}
                      </td>
                      <td className="py-2.5 px-3 text-muted-foreground font-mono text-[11px]">
                        {act.ipAddress}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          act.status === 'Audited'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300'
                        }`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Column 3: Security & Governance */}
        <div className="space-y-6">
          {/* Card: Security & Authentication */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
              <Shield size={16} className="text-primary" />
              Security & Credential Posture
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">Two-Factor Authentication</div>
                  <div className="text-[11px] text-muted-foreground">
                    {profile.twoFactorMethod}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                  Enforced
                </span>
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">Current Session IP</div>
                  <div className="text-[11px] font-mono text-muted-foreground">
                    {profile.lastActiveIp}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  Allowlisted
                </span>
              </div>

              <div className="flex items-start justify-between p-3 rounded-xl border border-border bg-muted/20">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">Last Session Login</div>
                  <div className="text-[11px] text-muted-foreground">
                    {profile.lastLogin}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Verified
                </span>
              </div>
            </div>

            <div className="pt-2">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-1.5">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <Sparkles size={14} className="text-primary" />
                  <span>DPDP Act 2023 Compliance Notice</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All administrative queries, PII unmasking events, and preview sessions originating from this account are permanently recorded to the platform compliance ledger.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Assigned Role Entitlements */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3.5">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border/80 pb-3">
              <Layers size={16} className="text-primary" />
              Assigned Persona Entitlements
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Root Platform Governance', desc: 'Full system configuration & role allocation' },
                { name: 'Safe View-as-User Preview', desc: 'Authorized read-only candidate & employer previews' },
                { name: 'Market Benchmark Operations', desc: 'Salary brackets & percentile configuration' },
                { name: 'DPDP Audit Ledger Access', desc: 'Inspection of unmasking justifications & logs' },
              ].map((ent, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-foreground">{ent.name}</div>
                    <div className="text-[11px] text-muted-foreground">{ent.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (UI Only) */}
      {isEditModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsEditModalOpen(false)}
          eyebrow="ADMINISTRATIVE PROFILE"
          title="Edit Profile Information"
          maxWidth="max-w-[500px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="btn-save-profile"
                onClick={handleSaveProfile}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
          }
        >
          <form onSubmit={handleSaveProfile} className="space-y-3.5 py-1 text-xs">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Full Display Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Department / Operational Division
              </label>
              <input
                type="text"
                value={editDepartment}
                onChange={(e) => setEditDepartment(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Operational Timezone
              </label>
              <input
                type="text"
                value={editTimezone}
                onChange={(e) => setEditTimezone(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Administrative Scope & Bio
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Change Password Modal (UI Only) */}
      {isPasswordModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsPasswordModalOpen(false)}
          eyebrow="CREDENTIAL SECURITY"
          title="Change Console Password"
          maxWidth="max-w-[480px]"
          footer={
            <div className="flex justify-end gap-2 w-full">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="btn-submit-change-password"
                onClick={handleChangePassword}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-sm"
              >
                Update Password
              </button>
            </div>
          }
        >
          <form onSubmit={handleChangePassword} className="space-y-3.5 py-1 text-xs">
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle size={14} className="text-amber-600 shrink-0" />
                UI Demonstration Mode
              </div>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                This password update interface demonstrates credential validation standards. No live backend account credentials will be mutated.
              </p>
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current console password"
                  className="w-full rounded-xl border border-border bg-background p-2.5 pr-10 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                New Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 12 characters with symbol"
                  className="w-full rounded-xl border border-border bg-background p-2.5 pr-10 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                <span className={newPassword.length >= 12 ? 'text-emerald-600 font-bold' : ''}>
                  &bull; Min 12 chars
                </span>
                <span className={/[0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : ''}>
                  &bull; Number
                </span>
                <span className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-emerald-600 font-bold' : ''}>
                  &bull; Special symbol
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                Confirm New Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
