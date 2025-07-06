# Little Flower International School Election System

## Overview

This is a web-based voting system for Little Flower International School's Head Boy and Head Girl elections. The system is built with Flask (Python) and provides a complete election management platform with separate interfaces for students to vote and administrators to manage candidates, students, and view results.

## System Architecture

### Backend Architecture
- **Framework**: Flask (Python web framework)
- **Database**: SQLAlchemy ORM with SQLite (default) or PostgreSQL support
- **Authentication**: Session-based authentication for admin users
- **Password Security**: Werkzeug password hashing for admin accounts

### Frontend Architecture
- **Template Engine**: Jinja2 (Flask's built-in templating)
- **CSS Framework**: Bootstrap 5.3.0
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter, Poppins)
- **JavaScript**: Vanilla JavaScript with Bootstrap components

### Database Schema
The system uses four main database models:
- **Admin**: Administrator accounts with hashed passwords
- **Student**: Student records with voting status tracking
- **Candidate**: Candidate information for Head Boy/Girl positions
- **Vote**: Vote records linking students to their chosen candidates

## Key Components

### Core Models
1. **Admin Model**: Manages administrator authentication with username/password
2. **Student Model**: Tracks student information and voting status
3. **Candidate Model**: Stores candidate details including position, photo, and achievements
4. **Vote Model**: Records individual votes with foreign key relationships

### Main Routes
- **Public Routes**: Index page, voting interface, vote submission
- **Admin Routes**: Dashboard, candidate management, student management, results viewing
- **Authentication**: Admin login/logout functionality

### Frontend Templates
- **Base Template**: Common layout with navigation and Bootstrap integration
- **Voting Interface**: Student voting form with candidate selection
- **Admin Dashboard**: Statistics and management overview
- **Management Pages**: Separate pages for candidates, students, and detailed results

## Data Flow

1. **Student Voting Process**:
   - Student enters admission number on voting page
   - System checks if admission number has already voted
   - Student selects Head Boy and Head Girl candidates (two votes total)
   - Student record is created automatically with admission number
   - Vote is recorded with foreign key relationships
   - Student's voting status is updated to prevent duplicate votes

2. **Admin Management**:
   - Admin logs in with username/password
   - Can add/edit/delete candidates and students
   - View real-time voting statistics and results
   - Export results to Excel format

3. **Results Processing**:
   - Vote counts calculated through database relationships
   - Real-time statistics displayed on admin dashboard
   - Detailed results exportable for analysis

## External Dependencies

### Python Packages
- **Flask**: Web framework
- **Flask-SQLAlchemy**: Database ORM
- **Werkzeug**: Password hashing and WSGI utilities
- **openpyxl**: Excel file generation for results export

### Frontend Dependencies (CDN)
- **Bootstrap 5.3.0**: UI framework
- **Font Awesome 6.4.0**: Icons
- **Google Fonts**: Typography (Inter, Poppins)

### Database Support
- **SQLite**: Default database (file-based)
- **PostgreSQL**: Production database option via DATABASE_URL environment variable

## Deployment Strategy

### Environment Configuration
- **Development**: SQLite database with debug mode enabled
- **Production**: PostgreSQL database with environment variables
- **Session Management**: Configurable secret key via SESSION_SECRET environment variable

### Database Setup
- Automatic table creation on application startup
- Migration-friendly SQLAlchemy models
- Connection pooling and ping configuration for production

### Security Considerations
- Password hashing for admin accounts
- Session-based authentication
- CSRF protection through Flask's built-in mechanisms
- Proxy fix middleware for deployment behind reverse proxies

### File Structure
```
/
├── app.py (Main application setup)
├── main.py (Entry point)
├── models.py (Database models)
├── routes.py (URL handlers)
├── templates/ (HTML templates)
├── static/ (CSS, JavaScript, images)
└── requirements.txt (Python dependencies)
```

## Changelog

```
Changelog:
- July 06, 2025. Initial setup
- July 06, 2025. Added admission number-based voting system
- July 06, 2025. Enhanced admin features: social media sharing, interactive progress visualization, photo upload, mobile responsive design
- July 06, 2025. Implemented voting schedule system with countdown timers (9:00 AM - 2:00 PM, July 7, 2025)
- July 06, 2025. Fixed candidate editing issues: expanded photo_url field to TEXT, added JavaScript for edit/delete functionality, and added reset vote buttons
- July 06, 2025. Enhanced countdown timer with visual cards layout, animated transitions, progress ring, milestone notifications, and responsive design
- July 06, 2025. Added admin voting control system: manual start/stop voting with override capabilities beyond scheduled time restrictions
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## Notes for Development

- The system currently uses SQLAlchemy with SQLite by default, but PostgreSQL can be easily configured
- Vote counting is handled through database relationships and property methods
- The admin interface includes comprehensive management tools for both candidates and students
- Results can be exported to Excel format for external analysis
- The system prevents duplicate voting through database constraints and status tracking