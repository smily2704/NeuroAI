from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "Frontend Neonatal EEG"
    database_url: str = "sqlite:///./frontend.db"
    jwt_secret: str = "replace-this-with-a-long-random-secret"
    jwt_expire_minutes: int = 60
    upload_dir: str = "uploads"
    report_dir: str = "reports"
    max_upload_size_mb: int = 30
    seed_demo_user: bool = False
    frontend_origins: str = "http://localhost:5173"
    model_path: str = ""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
