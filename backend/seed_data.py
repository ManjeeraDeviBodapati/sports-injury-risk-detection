import datetime
from app.database import engine, Base, SessionLocal
from app.models import User, Athlete, InjuryHistory, PhysicalAssessment, DatasetReference
from app.utils.security import hash_password

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed System Users (All 5 Roles)
        users_data = [
            ("Admin User", "admin@sportsinjury.org", "admin123", "Administrator"),
            ("Head Coach John", "coach@sportsinjury.org", "coach123", "Coach"),
            ("Dr. Sarah (Physio)", "physio@sportsinjury.org", "physio123", "Physiotherapist"),
            ("Dr. Alex (Scientist)", "scientist@sportsinjury.org", "scientist123", "Sports Scientist"),
            ("Alex Morgan (Athlete)", "athlete@sportsinjury.org", "athlete123", "Athlete"),
        ]

        print("Seeding Users...")
        user_objects = {}
        for name, email, raw_password, role in users_data:
            existing = db.query(User).filter(User.email == email).first()
            if not existing:
                user = User(
                    full_name=name,
                    email=email,
                    password=hash_password(raw_password),
                    role=role
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                user_objects[role] = user
                print(f" -> Created User: {name} ({role})")
            else:
                user_objects[role] = existing

        # 2. Seed Athletes
        athletes_data = [
            ("ATH-1001", "Marcus Rashford", "Football", "Forward", 26, 180.0, 75.0, "High", user_objects.get("Athlete").id if "Athlete" in user_objects else None),
            ("ATH-1002", "Elena Rostova", "Track & Field", "Sprinter", 24, 172.0, 62.0, "Very High", None),
            ("ATH-1003", "Kobe Bryant", "Basketball", "Guard", 28, 198.0, 96.0, "High", None),
            ("ATH-1004", "Simone Biles", "Gymnastics", "All-Rounder", 25, 142.0, 47.0, "High", None),
            ("ATH-1005", "Michael Phelps", "Swimming", "Butterfly", 29, 193.0, 88.0, "Moderate", None),
        ]

        print("Seeding Athletes...")
        athlete_objects = []
        for code, name, sport, pos, age, h, w, load, uid in athletes_data:
            existing = db.query(Athlete).filter(Athlete.athlete_code == code).first()
            if not existing:
                ath = Athlete(
                    athlete_code=code,
                    full_name=name,
                    sport_type=sport,
                    position=pos,
                    age=age,
                    height=h,
                    weight=w,
                    training_load=load,
                    user_id=uid
                )
                db.add(ath)
                db.commit()
                db.refresh(ath)
                athlete_objects.append(ath)
                print(f" -> Created Athlete: {name} ({code})")
            else:
                athlete_objects.append(existing)

        # 3. Seed Injury History
        if athlete_objects:
            print("Seeding Injury History...")
            injuries = [
                (athlete_objects[0].id, "ACL Tear (Left Knee)", "Left Knee", datetime.date(2025, 4, 12), "Rehab In Progress", "Severe", "Post-op ACL reconstruction week 16. Working on quad activation."),
                (athlete_objects[0].id, "Hamstring Strain", "Right Thigh", datetime.date(2024, 9, 5), "Fully Recovered", "Mild", "Grade 1 hamstring strain resolved with 3 weeks rest."),
                (athlete_objects[1].id, "Ankle Sprain (Lateral)", "Right Ankle", datetime.date(2025, 11, 20), "Rehab In Progress", "Moderate", "Lateral ligament strain during sprint decel drills."),
                (athlete_objects[2].id, "Patellar Tendonitis", "Right Knee", datetime.date(2025, 8, 14), "Active Pain", "Moderate", "Jumper's knee symptoms after back-to-back games."),
                (athlete_objects[3].id, "Shoulder Impingement", "Right Shoulder", datetime.date(2025, 2, 10), "Fully Recovered", "Mild", "Subacromial bursitis treated with targeted mobility exercises.")
            ]
            for ath_id, name, part, dt, status, val, notes in injuries:
                existing = db.query(InjuryHistory).filter(
                    InjuryHistory.athlete_id == ath_id, InjuryHistory.injury_name == name
                ).first()
                if not existing:
                    inj = InjuryHistory(
                        athlete_id=ath_id,
                        injury_name=name,
                        affected_body_part=part,
                        injury_date=dt,
                        recovery_status=status,
                        severity=val,
                        notes=notes
                    )
                    db.add(inj)

        # 4. Seed Physical Assessments
        if athlete_objects:
            print("Seeding Physical Assessments...")
            assessments = [
                (athlete_objects[0].id, datetime.date(2026, 1, 15), 68.5, 74.0, 82.0, "Left knee valgus asymmetry observed during single-leg landing.", "Dr. Sarah (Physio)"),
                (athlete_objects[1].id, datetime.date(2026, 1, 20), 88.0, 91.5, 95.0, "Excellent hip extension symmetry, minor ankle dorsiflexion stiffness.", "Dr. Alex (Scientist)"),
                (athlete_objects[2].id, datetime.date(2026, 2, 1), 72.0, 85.0, 89.0, "Trunk lean detected towards right side during maximum jump takeoff.", "Dr. Sarah (Physio)"),
            ]
            for ath_id, dt, flex, strg, end, notes, by in assessments:
                existing = db.query(PhysicalAssessment).filter(
                    PhysicalAssessment.athlete_id == ath_id, PhysicalAssessment.assessment_date == dt
                ).first()
                if not existing:
                    pas = PhysicalAssessment(
                        athlete_id=ath_id,
                        assessment_date=dt,
                        flexibility_score=flex,
                        strength_score=strg,
                        endurance_score=end,
                        movement_screening_notes=notes,
                        assessed_by=by
                    )
                    db.add(pas)

        # 5. Seed Dataset References
        print("Seeding Biomechanics Dataset References...")
        datasets_list = [
            ("Human3.6M", "3D Pose & Motion Analysis", "3.6 Million 3D human pose frames captured using high-speed optical motion capture system across 15 dynamic activities.", 32, 3600000, "http://vision.imar.ro/human3.6m/description.php"),
            ("MPII Human Pose", "2D Keypoint & Activity Recognition", "Comprehensive 2D human pose dataset with 25,000 images covering 410 everyday and athletic activities.", 16, 25000, "http://human-pose.mpi-inf.mpg.de/"),
            ("COCO Keypoints", "Foundation 2D Skeleton Extraction", "Industry-standard benchmark dataset with 17 keypoint body joint annotations over 200,000 images.", 17, 200000, "https://cocodataset.org/#keypoints-2017"),
            ("SportsPose", "Sports Biomechanics & Posture", "Large-scale 3D sports biomechanics dataset focusing on sprinting, cutting, jumping, and landing mechanics.", 17, 100000, "https://sportspose.github.io/"),
            ("FIFA Injury Reference", "Epidemiological Risk Factor Benchmark", "Comprehensive historical sports injury reference dataset used for calculating weighted injury risk scoring weights.", 0, 15000, "https://www.fifa.com/medical/")
        ]
        for name, cat, desc, keypoints, samples, url in datasets_list:
            existing = db.query(DatasetReference).filter(DatasetReference.name == name).first()
            if not existing:
                ds = DatasetReference(
                    name=name,
                    category=cat,
                    description=desc,
                    keypoint_count=keypoints,
                    sample_count=samples,
                    source_url=url
                )
                db.add(ds)

        db.commit()
        print("Database Seeding Completed Successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
