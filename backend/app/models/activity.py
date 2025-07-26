from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ActivityLog(BaseModel):
    user_id: str
    timestamp: datetime
    type: str
    duration_minutes: Optional[int] = None
    intensity_metric: Optional[float] = None
    notes: Optional[str] = None
