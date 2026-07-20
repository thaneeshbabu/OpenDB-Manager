import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { 
  FiUser, FiMail, FiPhone, FiHome, FiShield, 
  FiLock, FiEye, FiEyeOff, FiCheckCircle, FiDatabase, FiUserPlus 
} from "react-icons/fi";
import "./Register.css";


function Register() {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "Viewer",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ text: "Empty", score: 0, color: "#cbd5e1" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time password strength analyzer
  useEffect(() => {
    const pass = formData.password;
    if (!pass) {
      setPasswordStrength({ text: "Empty", score: 0, color: "#cbd5e1" });
      return;
    }
    
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) {
      setPasswordStrength({ text: "Weak", score: 33, color: "#EF4444" });
    } else if (score <= 3) {
      setPasswordStrength({ text: "Medium", score: 66, color: "#f59e0b" });
    } else {
      setPasswordStrength({ text: "Strong", score: 100, color: "#10B981" });
    }
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  
    const handleRegisterSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!formData.acceptTerms) {
    alert("Please accept the Terms and Conditions.");
    return;
  }

  try {
    setIsSubmitting(true);

    await registerUser({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      role: formData.role,
      password: formData.password,
    });

    alert("Registration Successful!");

    navigate("/");

  } catch (error) {
    alert(error.response?.data?.message || "Registration Failed");
  } finally {
    setIsSubmitting(false);
  }
};

  if (isSuccess) {
    return (
      <div className="register-universe-bg">
        <div className="success-glass-card">
          <div className="success-icon-badge">
            <FiCheckCircle />
          </div>
          <h2>Registration Request Received!</h2>
          <p className="notice-text">
            An email verification link has been dispatched to <strong>{formData.email}</strong>. 
            Please verify your credentials to initialize your node access.
          </p>
          <div className="success-divider"></div>
          <p className="sub-notice">Standard cluster sync completes inside 60 seconds.</p>
          <button className="btn-success-redirect" onClick={() => window.location.reload()}>
            Return to Gateway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-universe-bg">
      {/* Animated Matrix Spheres Background */}
      <div className="sphere sphere-one"></div>
      <div className="sphere sphere-two"></div>
      <div className="sphere sphere-three"></div>

      <div className="split-viewport-container">
        
        {/* Left Side: Modern Interactive Authentication Module */}
        <div className="auth-card-panel">
          <div className="glass-register-card">
            <header className="auth-header">
              <h1 className="brand-logo">🚀 OpenDB Manager</h1>
              <h2>Create your secure account</h2>
              <p>Register to access the enterprise database management platform.</p>
            </header>

            <form onSubmit={handleRegisterSubmit} className="register-form-flow">
              
              <div className="form-input-row">
                <div className="premium-input-box">
                  <input type="text" name="fullName" required placeholder=" " value={formData.fullName} onChange={handleChange} />
                  <label><FiUser className="input-field-icon" /> Full Name</label>
                </div>

                <div className="premium-input-box">
                  <input type="email" name="email" required placeholder=" " value={formData.email} onChange={handleChange} />
                  <label><FiMail className="input-field-icon" /> Email Address</label>
                </div>
              </div>

              <div className="form-input-row">
                <div className="premium-input-box">
                  <input type="tel" name="phone" required placeholder=" " value={formData.phone} onChange={handleChange} />
                  <label><FiPhone className="input-field-icon" /> Phone Number</label>
                </div>

                <div className="premium-input-box">
                  <div className="select-container-wrapper">
                    <select name="role" value={formData.role} onChange={handleChange} className="premium-select-node">
                      <option value="Admin">Admin (Full Control)</option>
                      <option value="Editor">Editor (Read/Write)</option>
                      <option value="Viewer">Viewer (Read-Only)</option>
                    </select>
                    <label className="select-floated-label"><FiShield className="input-field-icon" /> Access Role</label>
                  </div>
                </div>
              </div>

              <div className="premium-input-box">
                <input type="text" name="address" required placeholder=" " value={formData.address} onChange={handleChange} />
                <label><FiHome className="input-field-icon" /> Physical / Node Address</label>
              </div>

              {/* Password Area */}
              <div className="form-input-row">
                <div className="premium-input-box">
                  <input type={showPassword ? "text" : "password"} name="password" required placeholder=" " value={formData.password} onChange={handleChange} />
                  <label><FiLock className="input-field-icon" /> Password</label>
                  <button type="button" className="btn-toggle-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <div className="premium-input-box">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" required placeholder=" " value={formData.confirmPassword} onChange={handleChange} />
                  <label><FiLock className="input-field-icon" /> Confirm Password</label>
                  <button type="button" className="btn-toggle-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              {/* Password Strength Tracking Layout */}
              {formData.password && (
                <div className="strength-meter-block">
                  <div className="strength-labels">
                    <span>Identity Cryptography Matrix:</span>
                    <span style={{ color: passwordStrength.color, fontWeight: "600" }}>{passwordStrength.text}</span>
                  </div>
                  <div className="meter-track-bar">
                    <div className="meter-fill-progress" style={{ width: `${passwordStrength.score}%`, backgroundColor: passwordStrength.color }}></div>
                  </div>
                </div>
              )}

              {/* Terms and Notification Wrapper */}
              <div className="legal-notice-box">
                <label className="checkbox-label-wrapper">
                  <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />
                  <span className="checkbox-custom-box"></span>
                  <span className="checkbox-text-info">I accept the standard Cloud Operations Terms of Service.</span>
                </label>
                <div className="info-banner">
                  🛡️ <strong>Note:</strong> Multi-region verification email routing will initiate upon submission.
                </div>
              </div>

              {/* Submit Control Action */}
              <button type="submit" disabled={isSubmitting} className="btn-premium-register">
                {isSubmitting ? (
                  <div className="spinner-loader"></div>
                ) : (
                  <>
                    <FiUserPlus className="btn-inline-icon" /> Create Enterprise Account
                  </>
                )}
              </button>

              <div className="auth-footer-redirect">
                <span>Already have an account?</span>
                <button type="button" className="btn-inline-login" onClick={() => alert("Redirecting to authorized login gateway...")}>Login</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Marketing/Enterprise Showcase Screen */}
        <div className="showcase-display-panel">
          <div className="showcase-hero-overlay">
            <div className="showcase-header-content">
              <span className="pillar-badge">CLUSTER ARCHITECTURE</span>
              <h2>Distributed Node Management Framework</h2>
              <p>Maximize availability metrics via real-time synchronization pipelines, zero-trust cryptographic access controls, and integrated metrics instrumentation panels.</p>
            </div>

            {/* Micro Floating Cards Grid */}
            <div className="floating-cards-grid">
              <div className="glass-float-card card-anim-1">
                <div className="float-icon">🔐</div>
                <div className="float-info"><h4>Secure Authentication</h4><p>FIDO2 Hardware Tokens</p></div>
              </div>
              <div className="glass-float-card card-anim-2">
                <div className="float-icon">📂</div>
                <div className="float-info"><h4>Role Based Access</h4><p>RBAC Directory Controls</p></div>
              </div>
              <div className="glass-float-card card-anim-3">
                <div className="float-icon"><FiDatabase /></div>
                <div className="float-info"><h4>PostgreSQL Database</h4><p>Native Core Drivers</p></div>
              </div>
              <div className="glass-float-card card-anim-4">
                <div className="float-icon">☁️</div>
                <div className="float-info"><h4>Cloud Storage</h4><p>S3 Standard Buckets</p></div>
              </div>
              <div className="glass-float-card card-anim-5">
                <div className="float-icon">🛡️</div>
                <div className="float-info"><h4>JWT Security</h4><p>Encrypted Payload Tokens</p></div>
              </div>
            </div>

            {/* Bottom Linear Row Indicators */}
            <div className="linear-features-row">
              <div className="feature-pill">✔ Enterprise Security</div>
              <div className="feature-pill">✔ Role Management</div>
              <div className="feature-pill">✔ Database Analytics</div>
              <div className="feature-pill">✔ Cloud Ready</div>
              <div className="feature-pill">✔ Fast Performance</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;