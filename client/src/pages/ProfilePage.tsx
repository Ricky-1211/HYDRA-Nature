import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  MapPin,
  Lock,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { checkAuth } from '../store/authSlice';
import { authService } from '../services/authService';
import { Address } from '../types';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressActionMsg, setAddressActionMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    fullName: user?.name || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: user?.phone || '',
    isDefault: false,
    label: 'Home',
  });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  if (!loading && !isAuthenticated) {
    navigate('/auth?redirect=/profile');
    return null;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');

    try {
      await authService.updateProfile({ name, phone });
      await dispatch(checkAuth());
      setProfileMsg('Profile information updated successfully!');
    } catch (err: any) {
      setProfileMsg(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressActionMsg(null);

    const currentCount = user?.addresses?.length || 0;
    if (currentCount >= 4) {
      setAddressActionMsg({
        type: 'error',
        text: 'Maximum limit of 4 addresses (1 Primary + 3 Extra) reached. Please delete an address before adding a new one.',
      });
      return;
    }

    setAddressLoading(true);
    try {
      await authService.addAddress(newAddress);
      await dispatch(checkAuth());
      setShowAddressModal(false);
      setAddressActionMsg({ type: 'success', text: 'Address added successfully!' });
      setNewAddress({
        fullName: user?.name || '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: user?.phone || '',
        isDefault: false,
        label: 'Home',
      });
    } catch (err: any) {
      setAddressActionMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to add address',
      });
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId?: string, indexToDelete?: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setAddressActionMsg(null);
    try {
      if (addressId) {
        await authService.deleteAddress(addressId);
      } else if (indexToDelete !== undefined) {
        const updated = (user?.addresses || []).filter((_, idx) => idx !== indexToDelete);
        await authService.updateProfile({ addresses: updated });
      }
      await dispatch(checkAuth());
      setAddressActionMsg({ type: 'success', text: 'Address removed successfully.' });
    } catch (err: any) {
      setAddressActionMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to delete address',
      });
    }
  };

  const handleSetPrimaryAddress = async (addressId?: string, indexToPrimary?: number) => {
    setAddressActionMsg(null);
    try {
      if (addressId) {
        await authService.setDefaultAddress(addressId);
      } else if (indexToPrimary !== undefined) {
        const updated = (user?.addresses || []).map((addr, idx) => ({
          ...addr,
          isDefault: idx === indexToPrimary,
        }));
        await authService.updateProfile({ addresses: updated });
      }
      await dispatch(checkAuth());
      setAddressActionMsg({ type: 'success', text: 'Primary shipping address updated.' });
    } catch (err: any) {
      setAddressActionMsg({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to set primary address',
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError('');
    setSecurityMsg('');

    if (newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match');
      return;
    }

    setSecurityLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setSecurityMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSecurityError(err.message || 'Failed to update password');
    } finally {
      setSecurityLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#EDE8E1] py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-bold text-[#13382B]">Customer Portal</h1>
          <Link
            to="/orders"
            className="text-xs font-semibold text-[#13382B] flex items-center gap-1.5 hover:underline"
          >
            <Package className="w-4 h-4" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Nav Menu */}
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EDE8E1] shadow-sm text-center">
              <div className="w-20 h-20 rounded-full bg-[#13382B] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-3 shadow-md">
                {user?.name?.charAt(0) || 'H'}
              </div>
              <h2 className="font-serif text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-[#EAF1EB] text-[#2E6B48] text-[11px] font-bold rounded-full capitalize">
                Hydra {user?.role || 'Customer'}
              </span>
            </div>

            <div className="bg-white rounded-2xl p-2 border border-[#EDE8E1] shadow-sm space-y-1 text-xs font-medium">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#13382B] text-white font-bold'
                    : 'text-gray-700 hover:bg-[#FAF8F5]'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span>Personal Information</span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === 'addresses'
                    ? 'bg-[#13382B] text-white font-bold'
                    : 'text-gray-700 hover:bg-[#FAF8F5]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Address Book ({user?.addresses?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all ${
                  activeTab === 'security'
                    ? 'bg-[#13382B] text-white font-bold'
                    : 'text-gray-700 hover:bg-[#FAF8F5]'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Security & Password</span>
              </button>
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="md:col-span-8">
            {/* Tab 1: Profile Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#13382B] border-b border-gray-100 pb-3">
                  Personal Information
                </h3>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full px-4 py-2.5 text-xs border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>

                  {profileMsg && (
                    <div className="p-3 bg-[#EAF1EB] text-[#2E6B48] rounded-xl text-xs font-medium">
                      {profileMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-bold hover:bg-[#1E4D3B] disabled:opacity-50"
                  >
                    {profileLoading ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 2: Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#13382B]">Address Book</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      1 Primary Address + up to 3 extra addresses ({user?.addresses?.length || 0} / 4 saved)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if ((user?.addresses?.length || 0) >= 4) {
                        setAddressActionMsg({
                          type: 'error',
                          text: 'Maximum of 4 addresses (1 Primary + 3 Extra) reached. Please delete an address first.',
                        });
                        return;
                      }
                      setShowAddressModal(true);
                    }}
                    disabled={(user?.addresses?.length || 0) >= 4}
                    className="px-4 py-2 bg-[#13382B] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 hover:bg-[#1E4D3B] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {/* Feedback Message */}
                {addressActionMsg && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between ${
                      addressActionMsg.type === 'success'
                        ? 'bg-[#EAF1EB] text-[#2E6B48] border border-[#B8DAC2]'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    <span>{addressActionMsg.text}</span>
                    <button
                      onClick={() => setAddressActionMsg(null)}
                      className="text-xs opacity-60 hover:opacity-100 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Addresses List */}
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr, idx) => {
                      const isPrimary = addr.isDefault;
                      return (
                        <div
                          key={addr._id || idx}
                          className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                            isPrimary
                              ? 'border-[#13382B] bg-[#F7FAF8] shadow-sm ring-1 ring-[#13382B]/20'
                              : 'border-[#EDE8E1] bg-[#FAF8F5]'
                          }`}
                        >
                          <div>
                            {/* Header: Label and Primary Tag */}
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white px-2 py-0.5 rounded-md border border-[#EDE8E1]">
                                {addr.label || 'Address'}
                              </span>
                              {isPrimary ? (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-[#2E6B48] bg-[#EAF1EB] px-2.5 py-0.5 rounded-full border border-[#B8DAC2]">
                                  <CheckCircle2 className="w-3 h-3 text-[#2E6B48]" />
                                  <span>PRIMARY ADDRESS</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-gray-400 font-medium">
                                  Extra Address
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-xs pt-1">
                              <p className="font-bold text-gray-900 text-sm">{addr.fullName}</p>
                              <p className="text-gray-700">{addr.street}</p>
                              {addr.apartment && <p className="text-gray-600">{addr.apartment}</p>}
                              <p className="text-gray-700">
                                {addr.city}, {addr.state} - {addr.postalCode}
                              </p>
                              <p className="text-gray-500">{addr.country || 'India'}</p>
                              <p className="text-gray-800 font-semibold pt-1">
                                Phone: {addr.phone}
                              </p>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-4 mt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                            {!isPrimary ? (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryAddress(addr._id, idx)}
                                className="text-xs font-semibold text-[#13382B] hover:underline flex items-center gap-1"
                              >
                                <span>Set as Primary</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-[#2E6B48] font-bold">
                                Default for Checkout
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr._id, idx)}
                              className="text-gray-400 hover:text-red-600 text-xs flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-[#FAF8F5] rounded-2xl border border-dashed border-[#EDE8E1]">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-gray-700">No saved addresses</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Add your primary shipping address for instant 1-click checkout.
                    </p>
                  </div>
                )}

                {/* Modal to Add New Address */}
                {showAddressModal && (
                  <form onSubmit={handleAddAddress} className="pt-5 border-t border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-base font-bold text-[#13382B]">
                        Add Delivery Address (Max 4)
                      </h4>
                      <span className="text-[11px] text-gray-500 font-medium">
                        Slot { (user?.addresses?.length || 0) + 1 } of 4
                      </span>
                    </div>

                    {/* Address Type / Label */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Address Type
                      </label>
                      <div className="flex gap-2">
                        {['Home', 'Office', 'Other'].map((l) => (
                          <button
                            key={l}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, label: l })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                              newAddress.label === l
                                ? 'bg-[#13382B] text-white border-[#13382B]'
                                : 'bg-[#FAF8F5] text-gray-700 border-[#EDE8E1] hover:border-gray-400'
                            }`}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Recipient Name"
                          value={newAddress.fullName}
                          onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Phone Number (10 Digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Flat / House No., Building Name, Street"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Apartment / Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Suite, Landmark, Area"
                          value={newAddress.apartment || ''}
                          onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Postal PIN Code *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="6-digit PIN"
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          disabled
                          value="India"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
                        />
                      </div>
                    </div>

                    {/* Set as Primary Checkbox */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={newAddress.isDefault || (user?.addresses?.length || 0) === 0}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                        className="w-4 h-4 rounded text-[#13382B] focus:ring-[#13382B]"
                      />
                      <label htmlFor="isDefault" className="text-xs font-semibold text-gray-800 cursor-pointer">
                        Set as Primary Address for future orders
                      </label>
                    </div>

                    <div className="flex gap-2.5 justify-end pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-5 py-2.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressLoading}
                        className="px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-semibold hover:bg-[#1E4D3B] disabled:opacity-50"
                      >
                        {addressLoading ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Tab 3: Security & Password */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE8E1] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#13382B] border-b border-gray-100 pb-3">
                  Change Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      New Password (Min. 6 Characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs border border-[#EDE8E1] rounded-xl focus:outline-none focus:border-[#13382B]"
                    />
                  </div>

                  {securityMsg && (
                    <div className="p-3 bg-[#EAF1EB] text-[#2E6B48] rounded-xl text-xs font-medium">
                      {securityMsg}
                    </div>
                  )}
                  {securityError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                      {securityError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={securityLoading}
                    className="px-6 py-2.5 bg-[#13382B] text-white rounded-full text-xs font-bold hover:bg-[#1E4D3B] disabled:opacity-50"
                  >
                    {securityLoading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
