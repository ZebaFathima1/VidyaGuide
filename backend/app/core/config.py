"""
VidyaMitra Backend Configuration
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==================== Application Settings ====================
APP_TITLE = "VidyaMitra API"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ==================== Database Configuration ====================
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///vidyamitra.db")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# ==================== API Keys ====================
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "")
PEXELS_API_KEY = os.getenv("PEXELS_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")
EXCHANGE_API_KEY = os.getenv("EXCHANGE_API_KEY", "")

# ==================== Security ====================
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# ==================== CORS Configuration ====================
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

# ==================== File Upload ====================
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", "10485760"))  # 10MB default
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads/")

# Create upload directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ==================== Logging ====================
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "logs/vidyamitra.log")

# Create logs directory if it doesn't exist
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

# ==================== Email Configuration (Optional) ====================
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")

# ==================== Feature Flags ====================
ENABLE_RESUME_PARSING = True
ENABLE_SKILL_EVALUATION = True
ENABLE_TRAINING_PLANS = True
ENABLE_QUIZ_FEATURE = True
ENABLE_INTERVIEWS = True
ENABLE_JOB_RECOMMENDATIONS = True
ENABLE_PROGRESS_TRACKING = True

# ==================== API Endpoints ====================
OPENAI_BASE_URL = "https://api.openai.com/v1"
YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3"
PEXELS_BASE_URL = "https://api.pexels.com/v1"
NEWS_BASE_URL = "https://newsapi.org/v2"


# ==================== Helper Functions ====================
def validate_config():
    """Validate critical configuration"""
    required_keys = [
        "OPENAI_API_KEY",
        "GOOGLE_API_KEY",
        "YOUTUBE_API_KEY",
        "SUPABASE_URL",
        "SUPABASE_KEY",
    ]
    
    missing_keys = []
    for key in required_keys:
        if not globals().get(key):
            missing_keys.append(key)
    
    if missing_keys and ENVIRONMENT == "production":
        raise ValueError(f"Missing required API keys: {', '.join(missing_keys)}")
    
    if missing_keys and DEBUG:
        print(f"⚠️  Warning: Missing API keys: {', '.join(missing_keys)}")
        print("   Some features may not work correctly")


# Validate configuration on import
validate_config()
