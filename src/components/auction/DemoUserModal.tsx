'use client';

import React from 'react';
import { useAuth, UserData } from '../../contexts/AuthContext';
import { Shield, UserCheck, X } from 'lucide-react';

interface DemoUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoUserModal: React.FC<DemoUserModalProps> = ({ isOpen, onClose }) => {
  const { demoUsers, switchDemoUser, user: currentUser, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#18181f] border border-[#2c2c35] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-[#1e1e26] border border-[#2c2c35]"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-['Silkscreen',monospace] text-base font-bold text-white tracking-wide">
          SELECT PARTICIPANT ROLE
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Switch between the Chief Auctioneer or any franchise Club Manager with 1 click.
        </p>

        <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {demoUsers.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 font-mono">
              Loading demo accounts from server...
            </div>
          ) : (
            demoUsers.map((u) => {
              const isSelected = (currentUser?.id || currentUser?._id) === (u.id || u._id);
              const isLeadAdmin = u.role === 'admin';

              return (
                <button
                  key={u.id || u._id}
                  onClick={() => {
                    switchDemoUser(u);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-white'
                      : 'bg-[#121216] border-[#2c2c35] hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border"
                      style={{
                        borderColor: u.team?.color || (isLeadAdmin ? '#F59E0B' : '#74748B'),
                        backgroundColor: `${u.team?.color || (isLeadAdmin ? '#F59E0B' : '#74748B')}20`
                      }}
                    >
                      {isLeadAdmin ? <Shield className="w-4 h-4 text-amber-400" /> : u.team?.logo || '⚽'}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-white">
                          {u.team ? u.team.name : u.name}
                        </span>
                        {isLeadAdmin && (
                          <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {u.name} ({u.email})
                      </span>
                    </div>
                  </div>

                  {isSelected && <UserCheck className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })
          )}
        </div>

        {currentUser && (
          <div className="mt-4 pt-3 border-t border-[#2c2c35] flex justify-between items-center text-xs">
            <span className="text-slate-400">Current: {currentUser.name}</span>
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="text-rose-400 hover:underline font-mono text-[11px]"
            >
              Sign Out (Spectate)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
