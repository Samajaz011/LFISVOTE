from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100))
    class_name = db.Column(db.String(20))
    has_voted = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with votes
    votes = db.relationship('Vote', backref='student', lazy=True)

class Candidate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    class_name = db.Column(db.String(20), nullable=False)
    position = db.Column(db.String(20), nullable=False)  # 'head_boy' or 'head_girl'
    photo_url = db.Column(db.Text)
    description = db.Column(db.Text)
    achievements = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship with votes
    votes = db.relationship('Vote', backref='candidate', lazy=True)
    
    @property
    def vote_count(self):
        return Vote.query.filter_by(candidate_id=self.id).count()

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    candidate_id = db.Column(db.Integer, db.ForeignKey('candidate.id'), nullable=False)
    position = db.Column(db.String(20), nullable=False)  # 'head_boy' or 'head_girl'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure unique vote per student per position
    __table_args__ = (db.UniqueConstraint('student_id', 'position', name='unique_vote_per_position'),)

class VotingSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Admin manual control
    admin_override = db.Column(db.Boolean, default=False)  # Manual start/stop by admin
    override_status = db.Column(db.String(20), default='scheduled')  # 'scheduled', 'force_open', 'force_closed'
