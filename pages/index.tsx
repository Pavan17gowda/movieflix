import Head from 'next/head';
import Image from 'next/image';
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react';

import styles from '../styles/Login.module.scss';
import { ROUTES } from '../config/route';

export default function Home(): React.ReactElement {
  const router: NextRouter = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<{email: string, password: string, name: string}[]>([]);
  const [error, setError] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Sign Up logic
      if (password !== confirmPassword) {
        setError('Passwords do not match!');
        return;
      }
      if (registeredUsers.some(user => user.email === email)) {
        setError('Email already registered. Please sign in.');
        return;
      }
      // Register the user
      setRegisteredUsers([...registeredUsers, { email, password, name }]);
      alert('Registration successful! Please sign in with your credentials.');
      // Switch to sign in form and clear fields
      setIsSignUp(false);
      setName('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Sign In logic
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      if (user) {
        router.push(ROUTES.BROWSE);
      } else {
        setError('Invalid credentials. Please sign up first if you don\'t have an account.');
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix</title>
        <meta name='description' content='Netflix clone, made using Next.js' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Image src="/assets/loginBg.jpg" alt='background image' layout='fill' className={styles.main__bgImage} />
        <div className={styles.main__card}>
          <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
          <form onSubmit={onSubmit} className={styles.form}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email or phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
            )}
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>
              {isSignUp ? 'Register' : 'Sign In'}
            </button>
          </form>
          <div className={styles.toggle}>
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <span onClick={() => { setIsSignUp(false); setError(''); }} className={styles.link}>
                  Sign In
                </span>
              </p>
            ) : (
              <p>
                New to Nextflix?{' '}
                <span onClick={() => { setIsSignUp(true); setError(''); }} className={styles.link}>
                  Sign Up now
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
