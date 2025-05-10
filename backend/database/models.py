from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base

class Submission(Base):
    __tablename__ = 'submissions'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    problem_id = Column(String)  # Format: "contestId-index"
    code = Column(Text)
    language = Column(String)
    status = Column(String)  # 'pending', 'accepted', 'rejected'
    execution_time = Column(String)
    memory_used = Column(String)
    submitted_at = Column(DateTime)
