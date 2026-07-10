# Database Schema

## Users
- id
- full_name
- email
- password
- role
- created_at

## Athletes
- id
- user_id
- sport_type
- position
- age
- height
- weight
- training_load

## Injury History
- id
- athlete_id
- injury_name
- injury_date
- recovery_status
- notes

## Videos
- id
- athlete_id
- video_name
- video_path
- upload_date
- status