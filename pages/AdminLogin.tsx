import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, CarFront, AlertTriangle, Loader2, Key, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabase';
import { getEnv } from '../lib/env';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');
  
  // Reset states
  const [resetCode, setResetCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const navigate = useNavigate();

  // Check if already locked in this session
  useEffect(() => {
    // Persistent lock removed to allow manual unlock via refresh if needed by owner
  }, []);

  const sendSecurityAlert = async (type: 'lock' | 'reset', code?: string) => {
    const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID');
    const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY');
    
    // Use a specific template for resets if available, otherwise fallback to the requested one
    const resetTemplateId = getEnv('VITE_EMAILJS_RESET_TEMPLATE_ID');
    const mainTemplateId = getEnv('VITE_EMAILJS_TEMPLATE_ID');
    
    const isReset = type === 'reset';
    const templateId = isReset ? (resetTemplateId || 'template_jy6cxrf') : mainTemplateId;

    if (serviceId && templateId && publicKey) {
      const message = isReset 
        ? `Your password reset code is: ${code}. \n\nIf you didn't request this, please ignore this email.`
        : `SECURITY ALERT: Someone tried to access the admin dashboard with username: "${username}". They failed 3 times. Access is now locked for this session. \n\nPASSWORD RESET INSTRUCTIONS: \nIf you have forgotten your password, you can click "Forgot Password" on the login page to receive a reset code.`;

      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            // Standard fields for the booking template (backward compatibility)
            user_name: isReset ? 'Admin Recovery' : 'SECURITY SYSTEM',
            contact_number: 'N/A',
            facebook_account: 'N/A',
            car_name: isReset ? 'PASSWORD RESET REQUEST' : 'ADMIN LOGIN ALERT',
            pickup_location: 'Admin Portal',
            pickup_date: new Date().toLocaleString(),
            return_date: 'N/A',
            duration: isReset ? 'RESET CODE' : 'FAILED LOGIN ATTEMPT',
            total_price: isReset ? code : 'ALERT',
            passengers: '0',
            purpose: isReset ? 'PASSWORD RECOVERY' : 'UNAUTHORIZED ACCESS ATTEMPT',
            special_requests: message,
            
            // New generic fields for a dedicated reset template
            reset_code: code,
            alert_type: type,
            system_message: message,
            timestamp: new Date().toLocaleString()
          },
          publicKey
        );
        return true;
      } catch (err) {
        console.error('Failed to send email:', err);
        return false;
      }
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked || isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      // 1. Check Supabase for custom credentials first
      const { data: customPassData } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('id', 'admin_password')
        .maybeSingle();
      
      const { data: customUserData } = await supabase
        .from('admin_settings')
        .select('value')
        .eq('id', 'admin_username')
        .maybeSingle();

      const envUser = getEnv('VITE_ADMIN_USERNAME') || 'B&MC';
      const envPass = getEnv('VITE_ADMIN_PASSWORD') || 'makmak123';

      const validUser = customUserData?.value || envUser;
      const validPass = customPassData?.value || envPass;

      // Primary check: Hardcoded/Env values
      // Secondary check: Database overrides (from Forgot Password)
      const isHardcodedMatch = (username.trim() === 'B&MC' && password === 'makmak123');
      const isEnvMatch = (username.trim() === envUser && password === envPass);
      const isDbMatch = (username.trim() === validUser && password === validPass);

      if (isHardcodedMatch || isEnvMatch || isDbMatch) { 
        sessionStorage.setItem('isAdmin', 'true');
        navigate('/admin/dashboard');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          setError('Security Alert: Maximum attempts reached. This incident has been reported.');
          await sendSecurityAlert('lock');
        } else {
          setError(`Invalid Username or Password. Attempt ${newAttempts} of 3.`);
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const success = await sendSecurityAlert('reset', code);

    if (success) {
      setSentCode(code);
      setView('reset');
    } else {
      setError('Failed to send reset code. Please check your EmailJS configuration.');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (resetCode !== sentCode) {
      setError('Invalid reset code. Please check your email.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Save new password to Supabase
      const { error: upsertError } = await supabase
        .from('admin_settings')
        .upsert({ id: 'admin_password', value: newPassword, updated_at: new Date().toISOString() });

      if (upsertError) throw upsertError;

      setResetSuccess(true);
      setTimeout(() => {
        setView('login');
        setResetSuccess(false);
        setAttempts(0);
        setIsLocked(false);
      }, 3000);
    } catch (err: any) {
      console.error("Reset error:", err);
      setError(`Failed to save new password: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
            <div className={`${isLocked ? 'bg-red-600' : 'bg-orange-600'} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-colors`}>
                {isLocked ? <AlertTriangle className="text-white" size={32} /> : <CarFront className="text-white" size={32} />}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-sm">
              {view === 'login' ? 'Sign in to manage B&MC CAR RENTAL Tacloban' : 
               view === 'forgot' ? 'Reset your administrator access' : 
               'Enter the code sent to your email'}
            </p>
        </div>
        
        {resetSuccess ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
            <p className="text-green-800 font-bold text-lg">Password Reset!</p>
            <p className="text-green-600 text-sm">
              Your new password has been saved. Redirecting you to login...
            </p>
          </div>
        ) : isLocked && view === 'login' ? (
          <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center space-y-4">
            <p className="text-red-700 font-bold">Access Locked</p>
            <p className="text-red-600 text-sm">
              You have entered the wrong credentials too many times.
            </p>
            <button 
              onClick={() => setView('forgot')}
              className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Reset via Email
            </button>
            <p className="text-xs text-red-400 italic block mt-2">
              Incident reported to carrentalbmc@gmail.com
            </p>
          </div>
        ) : view === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-50"
                      placeholder="Enter username"
                  />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-xs text-orange-600 hover:underline font-medium"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-50"
                      placeholder="Enter admin password"
                  />
              </div>
            </div>
            {error && <p className="text-sm text-center font-medium py-2 rounded-lg text-red-500 bg-red-50">{error}</p>}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Access Dashboard'}
            </button>
          </form>
        ) : view === 'forgot' ? (
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3">
              <Mail className="text-orange-600 shrink-0" size={20} />
              <p className="text-xs text-orange-800 leading-relaxed">
                We will send a 6-digit verification code to your registered email <strong>carrentalbmc@gmail.com</strong> to verify your identity.
              </p>
            </div>
            
            {error && <p className="text-sm text-center font-medium py-2 rounded-lg text-red-500 bg-red-50">{error}</p>}
            
            <div className="flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Code'}
              </button>
              <button 
                type="button"
                onClick={() => setView('login')}
                className="w-full text-slate-500 font-bold py-2 text-sm hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
              <div className="relative">
                  <Key className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                  />
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all mb-4"
                  placeholder="At least 4 characters"
              />
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
              <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="Repeat new password"
              />
            </div>

            {error && <p className="text-sm text-center font-medium py-2 rounded-lg text-red-500 bg-red-50">{error}</p>}
            
            <div className="flex flex-col gap-3 pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
              </button>
              <button 
                type="button"
                onClick={() => setView('forgot')}
                className="text-sm text-slate-500 hover:text-slate-800"
              >
                Resend Code?
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                ← Back to Website
            </button>
        </div>
      </div>
    </div>
  );
};
