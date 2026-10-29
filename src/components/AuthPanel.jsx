import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  LockKeyhole,
  Mail,
  FlaskConical,
  LoaderCircle,
} from 'lucide-react';
import {
  demoMode,
  supabase,
  supabaseConfigured,
} from '../lib/supabase';

export function AuthPanel({ onClose, onSignIn }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const normalizedEmail = email.trim().toLowerCase();
    const validCollegeEmail =
      /^[^\s@]+@rguktn\.ac\.in$/.test(normalizedEmail);

    if (!validCollegeEmail) {
      setError(
        'Please use your official college email ending in @rguktn.ac.in.'
      );
      return;
    }

    if (demoMode && !supabaseConfigured) {
      onSignIn?.(normalizedEmail, { demo: true });
      return;
    }

    if (!supabaseConfigured || !supabase) {
      setError(
        'Email verification is not configured yet. Check your Supabase URL and publishable/anon key in the .env file.'
      );
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: true,
        },
      });

      if (authError) throw authError;

      setOtpSent(true);
      setMessage(
        `Check your inbox for a secure verification link sent to ${normalizedEmail}.`
      );
    } catch (authError) {
      setError(
        authError?.message ||
          'We could not send the verification code. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!supabaseConfigured || !supabase) {
      setError('Supabase email verification is not configured.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: otp.trim(),
        type: 'email',
      });

      if (authError) throw authError;

      if (!data?.session) {
        setMessage(
          'Verification completed, but no active session was returned. Please try signing in again.'
        );
        return;
      }

      setMessage('Email verified successfully! You are signed in.');
      onSignIn?.(normalizedEmail, { session: data.session });
    } catch (authError) {
      setError(
        authError?.message ||
          'The code could not be verified. Check the code and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setMessage('');
  };

  return (
    <div className="auth-screen">
      <section className="auth-card" aria-labelledby="auth-title">
        <button className="auth-back" type="button" onClick={onClose}>
          <ArrowLeft size={16} /> Back to browsing
        </button>

        <div className="auth-icon">
          <ShieldCheck size={28} />
        </div>

        <span className="auth-eyebrow">BACK2U LOST &amp; FOUND</span>

        <h1 id="auth-title">
          {otpSent ? 'Check your email.' : 'Welcome back.'}
        </h1>

        <p className="auth-intro">
          {otpSent
            ? `Open the secure link sent to ${email.trim().toLowerCase()} to verify your email and sign in.`
            : 'Sign in with your college email to report an item, manage your reports, and verify an ownership claim.'}
        </p>

        {demoMode && !supabaseConfigured ? (
          <div className="auth-success" role="note">
            <FlaskConical size={21} />
            <div>
              <strong>Demo mode is enabled</strong>
              <p>
                This session uses sample data and does not verify email
                ownership. Configure Supabase and turn demo mode off before
                launch.
              </p>
            </div>
          </div>
        ) : (
          <div className="auth-security-note" role="note">
            <ShieldCheck size={20} />
            <div>
              <strong>Secure email verification</strong>
              <p>
                {otpSent
                  ? 'Check your college inbox and click the verification link. Never share that link with anyone.'
                  : 'We will ask you to verify your college email before signing in.'}
              </p>
            </div>
          </div>
        )}

        {!otpSent ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field-label" htmlFor="account-email">
              College email address
            </label>

            <div className="auth-input-wrap">
              <Mail size={17} />
              <input
                id="account-email"
                className="field"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="yourname@rguktn.ac.in"
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <div className="auth-message" role="status">
                <CheckCircle2 size={19} />
                <span>{message}</span>
              </div>
            )}

            <button
              className="button button-dark button-full"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderCircle className="auth-spinner" size={16} />
                  Sending link…
                </>
              ) : demoMode && !supabaseConfigured ? (
                <>
                  Continue in demo <LockKeyhole size={16} />
                </>
              ) : (
                <>
                  Send verification link{' '}
                  <ArrowLeft
                    className="auth-arrow-forward"
                    size={16}
                  />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="auth-form">
            <div className="auth-message" role="status">
              <Mail size={19} />
              <span>
                Check your college email and click the secure verification
                link. After verification, BACK2U should sign you in
                automatically when the link opens this website.
              </span>
            </div>

            <button
              className="auth-back"
              type="button"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              <ArrowLeft size={16} /> Use a different email
            </button>
          </div>
        )}

        <div className="auth-privacy">
          <ShieldCheck size={17} />
          <span>
            Your email is used for sign-in and claim updates. Private
            ownership clues should only be visible to authorized reviewers.
          </span>
        </div>

        <p className="auth-setup-note">
          {supabaseConfigured
            ? 'Email verification powered by Supabase.'
            : demoMode
              ? 'Local demonstration only · not for real personal data.'
              : 'Administrator setup required before email sign-in is available.'}
        </p>
      </section>
    </div>
  );
}
