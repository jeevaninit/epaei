import React from 'react'

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = React.useState('login')
  const [form, setForm] = React.useState({ name: '', email: '', password: '' })
  const [status, setStatus] = React.useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isCreatingAccount = mode === 'register'

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/${isCreatingAccount ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong.')
      }

      onLogin(result.user)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode(isCreatingAccount ? 'login' : 'register')
    setForm({ name: '', email: '', password: '' })
    setStatus({ type: '', message: '' })
  }

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <p className="eyebrow">Epaei / Student records</p>
        <h1>JeevanIT</h1>
        <p className="intro-copy">A calm, focused workspace for the details that help students move forward.</p>
        <div className="intro-mark" aria-hidden="true"><span /><span /><span /></div>
      </section>


      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h2 id="auth-title">{isCreatingAccount ? 'Create your account' : 'Sign in to Epaei'}</h2>
          <p>{isCreatingAccount ? 'Start building your student workspace.' : 'Enter your details to continue.'}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isCreatingAccount && (
            <label>
              Full name
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Alex Morgan" required />
            </label>
          )}
          <label>
            Email address
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="alex@example.com" autoComplete="email" required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="At least 8 characters" minLength="8" autoComplete={isCreatingAccount ? 'new-password' : 'current-password'} required />
          </label>
          {status.message && <p className="form-message error" role="alert">{status.message}</p>}
          <button className="submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : isCreatingAccount ? 'Create account' : 'Sign in'}</button>
        </form>

        <p className="mode-switch">{isCreatingAccount ? 'Already have an account?' : 'New to Epaei?'}{' '}<button type="button" onClick={switchMode}>{isCreatingAccount ? 'Sign in' : 'Create an account'}</button></p>
      </section>
    </main>
  )
}

export default LoginPage