from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class WellnessLog(BaseModel):
    user_id: str
    timestamp: datetime
    log_type: str
    level: int
    description: Optional[str] = None
    location: Optional[str] = None
    sleep_hours: Optional[float] = None
