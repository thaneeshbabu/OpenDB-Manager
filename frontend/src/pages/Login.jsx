import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { 
  FiLock, 
  FiMail, 
  FiEye, 
  FiEyeOff, 
  FiCpu, 
  FiArrowRight 
} from "react-icons/fi";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // State controls for explicit local visual feedback features
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      
      // Call authentication schema interface endpoint
      const data = await loginUser(formData);

      // Save contextual tokens inside volatile state engines
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Authentication credentials failed verification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-screen-wrapper">
      {/* 1. Structural Animated Micro Particles and Glowing Blobs */}
      <div className="background-blob blob-one"></div>
      <div className="background-blob blob-two"></div>
      <div className="background-blob blob-three"></div>

      {/* 2. Glassmorphic Core Interactive Shell Component */}
      <div className="login-card-container">
        
        {/* 3. Corporate Visual Brand Identifier Module */}
        <header className="brand-identity-block">
          <div className="brand-icon-node">
            <FiCpu />
          </div>
          <h1>OpenDB Manager</h1>
          <p>Secure Database Management System</p>
        </header>

        {/* Core Submission Interface Framework */}
        <form onSubmit={handleSubmit} className="login-form-element">
          
          {/* 4. Functional Interactive Input Elements with Floating Tracking */}
          <div className="input-field-group">
            <FiMail className="input-icon-left" />
            <input
              type="email"
              name="email"
              id="email"
              className="form-input-control"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={isSubmitting}
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-field-group">
            <FiLock className="input-icon-left" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              className={`form-input-control ${isPasswordVisible ? "password-field" : ""}`}
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <label htmlFor="password">Security Password</label>
            
            {/* 6. Dynamic Visual Toggler Trigger Switch */}
            <button 
              type="button" 
              className="input-icon-right" 
              onClick={togglePasswordVisibility}
              aria-label={isPasswordVisible ? "Hide system password" : "Show plaintext password"}
            >
              {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* 6. Remember Me and Forget Core Logic Block */}
          <div className="form-auxiliary-row">
            <label className="remember-me-checkbox-label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isSubmitting}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="forgot-password-anchor" onClick={(e) => { e.preventDefault(); alert("Initialization route for credential restoration sequence requested."); }}>
              Forgot Password?
            </a>
          </div>

          {/* 5. Form Submission System Action Trigger */}
          <button 
            type="submit" 
            className="btn-submit-action" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner-element"></div>
                <span>Authenticating Node...</span>
              </>
            ) : (
              <>
                <span>Secure Access Portal</span>
                <FiArrowRight />
              </>
            )}
          </button>

          <div className="divider-line-break"></div>

          {/* 6. External Redirection Secondary Routing Component */}
          <footer className="navigation-footer-block">
            <span>New cluster administrator? </span>
            <a href="#register" onClick={(e) => { e.preventDefault(); alert("System registration endpoint initialization sequence."); }}>
              Create Account
            </a>
          </footer>

        </form>
      </div>
    </div>
  );
}

export default Login;