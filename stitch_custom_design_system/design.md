Software Requirements Specification (SRS)
IBVAP – Intelligent Border Video Analytics Platform
SIH Problem Statement: SIH26187 – AI-Based Intelligent Video Analytics Platform for Border Surveillance using Existing CCTV Infrastructure Organization: Ministry of Home Affairs, Government of India Track: Software Theme/Domain: Smart Automation Proposed System: IBVAP – Intelligent Border Video Analytics Platform
1. Introduction
1.1 Purpose
This Software Requirements Specification defines the functional, non-functional, technical, security, AI, database, interface, and deployment requirements for IBVAP – Intelligent Border Video Analytics Platform.
The purpose of IBVAP is to transform conventional IP-based CCTV infrastructure into an intelligent, software-defined surveillance system capable of automatically analyzing live video streams and generating actionable security alerts.
The platform is designed around the SIH26187 problem statement, which asks for AI-powered video analytics over existing CCTV infrastructure without requiring dedicated Facial Recognition Systems, ANPR cameras, smart cameras, or other specialized surveillance hardware.
1.2 Problem Statement
Border Security Forces deploy CCTV cameras at:


Border Out Posts (BOPs)

Border roads

Check posts

Strategic installations

Access/control points

Sensitive perimeter locations
Traditional CCTV systems primarily provide video recording and live viewing. Human operators must continuously monitor multiple camera feeds, which can result in fatigue, delayed detection, missed events, and inefficient use of personnel.
Advanced capabilities such as:


Human detection

Object tracking

Vehicle classification

Face detection/recognition

ANPR

Intrusion detection

Night-time movement detection

Suspicious activity detection
often require dedicated hardware or specialized systems.
IBVAP addresses this problem by providing these capabilities through an AI-driven software platform that can consume video streams from existing IP cameras.
1.3 Project Vision
"Convert existing CCTV cameras into an intelligent, real-time border surveillance network using AI, Computer Vision and Video Analytics."
The system should move surveillance from:
Camera → Human Operator → Manual Decision
to:
Camera → AI Analytics → Detection → Risk Assessment → Alert → Operator Verification → Response
2. Background and Motivation
The SIH problem specifically identifies the need for a software-based solution that can work with existing CCTV infrastructure while improving situational awareness, reducing dependence on specialized hardware, generating real-time alerts, and supporting command-and-control integration.
The main motivation is to provide:


Low-cost modernization of existing CCTV infrastructure.

Automated surveillance instead of continuous manual observation.

Real-time incident detection.

Faster operator response.

Centralized monitoring of multiple camera feeds.

Historical event analysis.

Scalable deployment across multiple locations.

Integration with future sensors and command-and-control systems.
3. Objectives
3.1 Primary Objectives
IBVAP shall:


Ingest live streams from existing IP-based CCTV cameras.

Detect and classify people and vehicles.

Track objects across video frames.

Detect faces.

Perform software-based ANPR.

Detect intrusion into predefined virtual zones.

Detect movement during configured night-time periods.

Identify configurable suspicious activities/anomalies.

Generate real-time alerts.

Store security events and associated evidence.

Provide dashboards for monitoring and investigation.

Support multiple cameras and locations.

Provide APIs for integration with external command-and-control systems.

Operate in remote or bandwidth-constrained environments.

Minimize dependence on specialized camera hardware.
3.2 Secondary Objectives
The system should also support:


Camera health monitoring

AI model health monitoring

Alert prioritization

Historical search

Video evidence retrieval

Heatmaps

Event statistics

Role-based access

Audit logging

Report generation

System configuration

Model/configuration updates
4. Scope
4.1 In Scope
Video Management


IP camera registration

RTSP stream ingestion

Multiple camera management

Live viewing

Camera grouping

Camera health monitoring

Recording/event clip management
AI Video Analytics


Person detection

Vehicle detection

Vehicle classification

Object tracking

Face detection

ANPR

Virtual fence detection

Line crossing detection

Loitering detection

Crowd detection

Night movement detection

Configurable anomaly/suspicious activity detection
Alert Management


Real-time alerts

Alert severity

Alert acknowledgment

Alert escalation

Alert assignment

Alert history

Evidence snapshots/video clips
Monitoring


Command dashboard

Multi-camera monitoring

Map/location view

Camera status

Active alerts

Incident timeline

Statistics
Administration


User management

Role management

Camera configuration

Detection-zone configuration

Alert rules

AI configuration

System settings

Audit logs

Reports
5. Out of Scope for the Initial MVP
The following capabilities should be treated as optional or future-stage features:


Autonomous physical intervention

Automated decisions that directly trigger force or physical action

Fully autonomous drone deployment

Military-grade sensor fusion without available sensor interfaces

Unverified identity attribution

Large-scale unrestricted biometric identification

Fully autonomous threat determination
The platform should assist authorized operators rather than replace human command responsibility.
6. Stakeholders
StakeholderResponsibilityBorder Security OperatorMonitor cameras and respond to alertsSupervisorReview incidents and manage operationsSystem AdministratorManage users, cameras and configurationSecurity OfficerInvestigate incidentsCommand CenterMonitor multiple border locationsIT AdministratorMaintain infrastructureAI/ML AdministratorManage models and analyticsGovernment/Agency AuthorityGovernance, policy and oversightDevelopment TeamBuild and maintain system
7. User Roles
7.1 Administrator
Permissions:


Create/update/delete users

Configure cameras

Configure AI modules

Manage locations

Configure alerts

View reports

View audit logs

Manage system settings
7.2 Security Operator
Permissions:


View live cameras

View detections

Receive alerts

Acknowledge alerts

Review evidence

Search incidents

Add incident comments
7.3 Supervisor
Permissions:


All operator capabilities

Assign alerts

Escalate incidents

View advanced reports

Review historical incidents

Monitor performance
7.4 Investigator
Permissions:


Search historical events

Search plates

Search tracked objects

Review snapshots/clips

Generate investigation reports
7.5 AI/ML Administrator
Permissions:


Manage AI models

Configure confidence thresholds

Review model performance

Manage analytics pipelines

Monitor inference performance
8. System Overview
8.1 High-Level Architecture
                    EXISTING CCTV CAMERAS
                            |
                      RTSP / IP Stream
                            |
                            v
                +------------------------+
                | Video Stream Gateway   |
                | RTSP / ONVIF / Buffer  |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Video Processing Layer |
                | Frame Decode / Resize  |
                | FPS Control / Tracking  |
                +-----------+------------+
                            |
                            v
              +----------------------------+
              | AI / Computer Vision Layer |
              +----------------------------+
              | Person Detection           |
              | Vehicle Detection          |
              | Object Tracking            |
              | Face Detection             |
              | ANPR                       |
              | Intrusion Detection        |
              | Loitering                  |
              | Night Movement             |
              | Anomaly Detection           |
              +-------------+--------------+
                            |
                            v
                 +----------------------+
                 | Event / Risk Engine  |
                 +----------+-----------+
                            |
                 +----------+-----------+
                 |                      |
                 v                      v
        +----------------+      +----------------+
        | Alert Service  |      | Event Service  |
        +-------+--------+      +-------+--------+
                |                       |
                +----------+------------+
                           |
                           v
                  +--------------------+
                  | Backend/API Layer  |
                  +----------+---------+
                             |
          +------------------+-------------------+
          |                  |                   |
          v                  v                   v
    Web Dashboard       Database           Evidence Storage
          |
          v
 Authorized Operators / Command Center

9. Proposed Technology Stack
9.1 Frontend
Recommended:


React.js

TypeScript

Tailwind CSS

Bootstrap or Material UI

WebSocket client

Map visualization

Charting library
Alternative:


Next.js
9.2 Backend
Recommended:


Python

FastAPI

WebSocket

REST APIs

JWT/OAuth-based authentication
Alternative:


Node.js + Express.js
9.3 AI/Computer Vision
Recommended:


Python

OpenCV

PyTorch

Ultralytics YOLO or equivalent object detector

ByteTrack/DeepSORT or equivalent tracker

PaddleOCR/EasyOCR for ANPR prototype

ONNX Runtime/TensorRT for optimized inference
9.4 Database
Recommended:


PostgreSQL
Optional:


PostGIS for geographic data

Redis for event queues/cache
9.5 Video Infrastructure


RTSP

FFmpeg

OpenCV/GStreamer

ONVIF where supported
9.6 Storage


Local evidence storage for prototype

MinIO/S3-compatible object storage for scalable deployment
9.7 Deployment
Prototype:


Docker

Docker Compose
Production:


Docker/Kubernetes

Edge GPU server

Central command server
10. Major Functional Modules
10.1 Camera Management Module
The system shall allow administrators to register and manage existing CCTV cameras.
Features


Add camera

Edit camera

Delete/deactivate camera

IP/hostname configuration

RTSP URL configuration

Authentication credentials

Location assignment

Camera type

Resolution

FPS

Health status

Last-seen timestamp
Camera Status
Possible states:


Online

Offline

Connecting

Stream Error

AI Processing Error

Maintenance
10.2 Live Video Monitoring Module
The system shall provide a centralized live video dashboard.
Features


Single-camera view

Multi-camera grid

Full-screen mode

Camera search

Camera grouping

Detection overlay

Bounding boxes

Object labels

Confidence scores

Tracking IDs

FPS information

Alert overlay
Example:
+---------------------------------------------------+
| CAMERA: BOP-07                   STATUS: ONLINE   |
+---------------------------------------------------+
|                                                   |
|                  LIVE VIDEO                       |
|                                                   |
|       [PERSON]                                     |
|       ID: P-104                                    |
|       Confidence: 94%                              |
|                                                   |
|                     [VEHICLE]                      |
|                     ID: V-22                       |
|                                                   |
+---------------------------------------------------+
| ALERT: Unauthorized Zone Intrusion   HIGH         |
+---------------------------------------------------+

10.3 Human Detection and Tracking
The system shall detect human subjects in video frames.
Output


Bounding box

Confidence

Tracking ID

Timestamp

Camera ID

Position

Movement trajectory
Example Event
Camera: BOP-04
Object: Person
Track ID: P-1028
Confidence: 96%
Direction: North-East
Duration: 21 seconds
Zone: Restricted Zone

10.4 Vehicle Detection and Classification
The system shall identify vehicles and classify them.
Possible categories:


Car

SUV

Truck

Bus

Motorcycle

Bicycle

Other
Output


Vehicle bounding box

Vehicle class

Confidence

Tracking ID

Timestamp

Direction

Location
10.5 Object Tracking
The tracking system shall maintain object identity across frames.
Example:
Frame 1 → Person ID 17
Frame 2 → Person ID 17
Frame 3 → Person ID 17
Frame 4 → Person ID 17

This allows the system to calculate:


Direction

Speed approximation

Dwell time

Path

Zone transitions

Line crossings
10.6 Face Detection
The system shall detect faces present in video frames.
The system should provide:


Face bounding box

Detection confidence

Timestamp

Camera ID

Snapshot reference
Face recognition/identification should be enabled only for authorized operational use cases and according to applicable policies, approvals, retention rules and access controls.
For the SIH prototype, a safer demonstration approach is to implement face detection first, with authorized watchlist matching presented as an optional module.
10.7 ANPR Module
Automatic Number Plate Recognition shall identify vehicle registration plates from compatible camera streams.
Pipeline:
Video Frame
     |
Vehicle Detection
     |
Plate Detection
     |
Perspective Correction
     |
Image Enhancement
     |
OCR
     |
Plate Validation
     |
Plate Number
     |
Event Database

Example
Plate: MH12AB1234
Confidence: 91%
Vehicle Type: SUV
Camera: CHECKPOST-03
Time: 22:14:31

The system should distinguish between:


High-confidence plate recognition

Low-confidence recognition

Unreadable plate
Operators should be able to review the source image before acting on an uncertain recognition.
10.8 Virtual Fence / Geofencing Module
Operators shall be able to draw restricted regions directly on the camera view.
Example:
+--------------------------------+
|                                |
|   NORMAL AREA                  |
|                                |
|         +----------------+     |
|         | RESTRICTED     |     |
|         |     ZONE       |     |
|         +----------------+     |
|                                |
+--------------------------------+

When an unauthorized object enters the region:
Person detected
        ↓
Restricted zone entered
        ↓
Rule satisfied
        ↓
High-priority alert

10.9 Line-Crossing Detection
The operator shall define a virtual line.
Examples:


Border crossing line

Entry gate

Restricted road

Perimeter boundary
The system shall create an event whenever an object crosses that line according to the configured direction/rule.
10.10 Loitering Detection
The system shall identify objects remaining within a defined region beyond a configured duration.
Example:
Allowed dwell time = 30 seconds
Observed duration = 94 seconds

→ LOITERING ALERT

10.11 Night-Time Movement Detection
The system shall support configurable night surveillance.
Example configuration:
Night Mode:
Start: 20:00
End: 05:30

During configured hours, the system can:


Detect movement

Detect person/vehicle

Increase alert priority

Use enhanced low-light processing

Trigger night intrusion rules
For cameras with suitable sensors, thermal or low-light feeds can be integrated as future extensions.
10.12 Suspicious Activity Detection
The system shall provide configurable activity/anomaly detection.
Possible prototype rules:


Loitering

Restricted-zone presence

Repeated line crossing

Unauthorized entry

Unusual vehicle movement

Person-vehicle proximity

Abandoned object

Crowd formation

Unusual activity during restricted hours
The term "suspicious" should not be implemented as an unexplained AI judgment. Each alert should ideally show the observable rule or model signal that caused it.
Example:
Alert: Suspicious Activity

Reason:
Person remained inside restricted zone
for 87 seconds during configured restricted hours.

Evidence:
Camera: BOP-09
Track ID: P-345
Confidence: 93%

10.13 Alert Management
The alert engine is one of the most important components of IBVAP.
Alert Severity
Critical
Examples:


Confirmed restricted-zone intrusion

Multiple simultaneous intrusions

High-priority watchlist match

Major security event
High
Examples:


Human intrusion

Vehicle entering restricted area

Unauthorized line crossing

Night intrusion
Medium
Examples:


Loitering

Unknown vehicle

Suspicious movement pattern
Low
Examples:


System warning

Camera degradation

Low-confidence AI detection
10.14 Alert Lifecycle
AI Detection
     ↓
Rule/Model Evaluation
     ↓
Risk Score
     ↓
Alert Created
     ↓
Operator Notification
     ↓
Acknowledged
     ↓
Investigating
     ↓
Resolved / Escalated

Alert statuses:


New

Acknowledged

Investigating

Escalated

Resolved

False Positive
11. Risk Scoring Engine
Each event may receive a risk score based on configurable factors.
Example conceptual model:
Risk Score =
    Detection Confidence
  + Zone Sensitivity
  + Time Sensitivity
  + Object Type
  + Event Severity
  + Rule Priority

Example:
Person + Restricted Zone + Night
                 ↓
          HIGH PRIORITY

The score should be explainable to operators rather than appearing as an unexplained number.
12. Real-Time Notification System
Notifications may be generated through:


Dashboard alert

Browser notification

WebSocket

Email (optional)

SMS gateway (optional)

Command-system API

Audible alarm at operator console
Example:
🚨 HIGH PRIORITY ALERT

Camera: Border Sector 7
Event: Human Intrusion
Time: 22:17:42
Zone: Restricted Area
Track ID: P-78
Confidence: 95%

13. Event Logging and Evidence
Every security event should contain:


Event ID

Camera ID

Location

Timestamp

Event type

Object type

Tracking ID

AI confidence

Rule triggered

Alert severity

Snapshot

Video clip reference

Operator status

Resolution

Comments
Example database record:
Event ID: EVT-2026-00182
Camera: CAM-17
Type: INTRUSION
Severity: HIGH
Object: PERSON
Confidence: 0.95
Timestamp: 2026-08-25 22:17:42
Status: ACKNOWLEDGED

14. Dashboard Requirements
14.1 Main Command Dashboard
The dashboard should contain:
------------------------------------------------------
 IBVAP COMMAND CENTER
------------------------------------------------------
 Cameras Online       Active Alerts       Events Today
      42                   03                 186
------------------------------------------------------

             LIVE CAMERA GRID

 [CAM-01]     [CAM-02]     [CAM-03]
 [CAM-04]     [CAM-05]     [CAM-06]

------------------------------------------------------
 ACTIVE ALERTS

 🔴 Critical | Intrusion | CAM-07
 🟠 High     | Vehicle   | CAM-12
 🟡 Medium   | Loitering | CAM-03

------------------------------------------------------
 MAP / BORDER LOCATION VIEW
------------------------------------------------------

15. Geographic Monitoring
A map-based interface should allow authorized users to visualize:


BOP locations

Camera locations

Active alerts

Security zones

Incident locations

Camera status
Color coding can indicate:


Normal

Warning

Alert

Critical
For a larger deployment, PostGIS can maintain geographic relationships between cameras, sectors, checkpoints and events.
16. Historical Investigation Module
Investigators shall be able to search by:


Date

Time

Camera

Location

Object type

Vehicle type

Plate number

Event type

Severity

Tracking ID

Alert status
Example:
Search:
Camera = CHECKPOST-04
Date = 25 Aug 2026
Object = Vehicle
Plate = MH12AB1234

Result:
17 matching events

17. Reports Module
The system should generate:


Daily surveillance report

Incident report

Camera health report

Alert summary

Vehicle activity report

Intrusion report

ANPR report

Night movement report

Operator response report

False-positive report

Monthly analytics report
Formats:


PDF

CSV

Excel
18. AI Pipeline
18.1 Processing Pipeline
RTSP Stream
    ↓
Frame Extraction
    ↓
Preprocessing
    ↓
Object Detection
    ↓
Object Tracking
    ↓
Specialized Analytics
    ├── Person
    ├── Vehicle
    ├── Face
    ├── Plate
    └── Other Objects
    ↓
Behavior / Zone Rules
    ↓
Risk Scoring
    ↓
Event Generation
    ↓
Alert
    ↓
Database + Evidence Storage

19. AI Model Architecture
19.1 Object Detection
A YOLO-family detector or another appropriately licensed object detector may be used.
Input:
640 × 640 image

Output:
class
bounding box
confidence

Example:
Person → 0.94
Car → 0.91
Truck → 0.89

19.2 Tracking
The detector output is passed to a multi-object tracker.
Example:
Person → Track ID 17
Person → Track ID 18
Vehicle → Track ID 45

Tracking allows movement analysis across frames.
20. AI Model Optimization
For deployment on constrained infrastructure:


Frame skipping

Resolution optimization

Batch processing where appropriate

ONNX optimization

TensorRT optimization on NVIDIA hardware

GPU acceleration

CPU fallback

ROI processing

Dynamic FPS

Model quantization where suitable
The objective is to avoid processing every possible frame at maximum resolution when it is unnecessary.
21. Edge Computing Architecture
A key design choice is to process video near the cameras rather than transmitting all raw video to a central cloud.
CCTV
  ↓
Edge Server
  ↓
AI Detection
  ↓
Events / Metadata
  ↓
Central Server

Advantages:


Lower bandwidth use

Lower latency

Better operation in remote areas

Reduced raw-video transmission

More resilient connectivity
The system can transmit event metadata and selected evidence clips while retaining configurable local buffering.
22. Centralized Architecture
For larger installations:
BOP-01 Edge
BOP-02 Edge
BOP-03 Edge
      |
      v
Secure Network
      |
      v
Central IBVAP Server
      |
      +---- Dashboard
      +---- Database
      +---- Event Store
      +---- Analytics
      +---- Reports
      +---- Command System API

This provides centralized situational awareness while preserving distributed processing.
23. Database Design
23.1 Users
users
-----
id
name
email
password_hash
role_id
status
last_login
created_at

23.2 Roles
roles
-----
id
name
permissions

23.3 Cameras
cameras
-------
id
camera_name
ip_address
rtsp_url
location_id
status
resolution
fps
created_at
updated_at

23.4 Locations
locations
---------
id
name
sector
latitude
longitude
description

23.5 Detection Zones
zones
-----
id
camera_id
zone_name
zone_type
polygon_coordinates
severity
active

23.6 Events
events
------
id
camera_id
event_type
object_type
track_id
confidence
severity
timestamp
zone_id
status
evidence_url

23.7 Alerts
alerts
------
id
event_id
priority
status
assigned_to
acknowledged_at
resolved_at
resolution_notes

23.8 Vehicles
vehicles
--------
id
event_id
plate_number
plate_confidence
vehicle_type

23.9 Audit Logs
audit_logs
----------
id
user_id
action
resource
timestamp
ip_address
details

24. API Requirements
Authentication
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

Cameras
GET    /api/cameras
POST   /api/cameras
GET    /api/cameras/{id}
PUT    /api/cameras/{id}
DELETE /api/cameras/{id}

Events
GET /api/events
GET /api/events/{id}
POST /api/events/{id}/acknowledge
POST /api/events/{id}/resolve

Alerts
GET /api/alerts
GET /api/alerts/active
POST /api/alerts/{id}/acknowledge
POST /api/alerts/{id}/escalate

Analytics
GET /api/analytics/summary
GET /api/analytics/camera/{id}
GET /api/analytics/events

ANPR
GET /api/anpr/search?plate=MH12AB1234

WebSocket
/ws/alerts
/ws/cameras
/ws/events

WebSockets should provide real-time event updates to the dashboard.
25. Security Requirements
Because the system handles security-sensitive surveillance information, security shall be a first-class requirement.
Authentication


Strong authentication

Password hashing

Session/token management

Optional MFA

Account lockout/rate limiting
Authorization
Role-based access control shall restrict:


Camera access

Video access

Investigation tools

Biometric-related features

Administrative functions
Data Protection


TLS for network communications

Encryption at rest where appropriate

Secure credential storage

Secrets stored outside source code

Database access controls

Secure API authentication
Auditability
Every sensitive operation should be logged:
User
Action
Timestamp
Resource
Result
IP

Evidence Integrity
Evidence files should use:


Cryptographic hashes

Access controls

Immutable or protected audit records

Controlled retention/deletion
26. Privacy and Responsible AI
The system should be designed for authorized security operations and should apply least-privilege access and purpose limitation.
Important controls include:


Restricted biometric access

Watchlist access control

Configurable retention

Audit trails

Human verification for consequential matches

Confidence thresholds

False-positive handling

Model monitoring

Evidence traceability

Role-based access
A face or plate match should be treated as an AI-generated signal requiring authorized operational verification, not as infallible identity proof.
27. Non-Functional Requirements
27.1 Performance
Target prototype requirements:


Near-real-time detection

Dashboard alert latency preferably below a few seconds under normal test conditions

Stable multi-camera processing

Configurable FPS

Efficient GPU/CPU utilization
Actual throughput shall depend on camera resolution, model size, hardware and number of simultaneous streams.
27.2 Scalability
The architecture should support:
1 camera
   ↓
10 cameras
   ↓
50 cameras
   ↓
100+ cameras

without requiring fundamental architectural redesign.
27.3 Availability
The system should:


Automatically reconnect dropped streams

Recover failed AI workers

Preserve event logs during temporary outages

Provide health monitoring
27.4 Reliability
The system should not silently lose events.
Failed processing operations should generate system-level warnings.
27.5 Usability
The UI should prioritize:


Active alerts

Live surveillance

Critical events

Camera health

Investigation
28. Camera Failure Handling
The platform shall detect:


Camera offline

RTSP unavailable

Authentication failure

Frozen stream

Low FPS

Excessive latency

Video corruption
Example:
⚠ CAMERA OFFLINE

Camera: BOP-11
Last frame: 22:13:04
Status: CONNECTION LOST

[Retry] [View Diagnostics]

29. Network Failure Handling
In remote areas connectivity may be unreliable.
The edge system should therefore support:


Local event buffering

Local evidence buffering

Automatic reconnection

Store-and-forward synchronization

Reduced metadata transmission

Central server synchronization after reconnection
30. AI False Positive Handling
Operators must be able to mark alerts as:


True Positive

False Positive

Duplicate

Inconclusive
This information may later be used to improve:


Thresholds

Rules

Camera-specific configurations

Model evaluation
31. System Monitoring
The administrator dashboard should monitor:
CPU
GPU
RAM
Disk
Network
Camera Streams
AI FPS
Inference Latency
Alert Rate
Error Rate

Example:
System Health: 96%

Cameras:
42 Online
2 Offline

GPU:
73%

AI Inference:
28 FPS

Alerts:
3 Active

32. Testing Requirements
32.1 Unit Testing
Test:


Authentication

API services

Database operations

Alert rules

Zone calculations

Event processing
32.2 Integration Testing
Test:
Camera → Stream Service → AI → Event Engine → API → Dashboard

32.3 AI Testing
Measure:


Precision

Recall

F1-score

Detection accuracy

Tracking consistency

ANPR accuracy

False-positive rate

False-negative rate
32.4 Performance Testing
Test:


Number of simultaneous cameras

FPS

GPU memory

CPU usage

Network bandwidth

Alert latency
32.5 Security Testing
Test:


Authentication bypass

Authorization bypass

SQL injection

API abuse

Credential exposure

Session security

File access

Evidence tampering
33. Acceptance Criteria
The prototype should demonstrate at minimum:
AC-01
The system successfully receives a live RTSP/IP camera stream.
AC-02
The system detects people in real time.
AC-03
The system detects and classifies vehicles.
AC-04
The system tracks detected objects.
AC-05
The operator can configure a virtual restricted zone.
AC-06
Entering the restricted zone generates an alert.
AC-07
Night-time movement generates an alert according to configured rules.
AC-08
The system can detect license plates from suitable test video.
AC-09
Events are stored in the database.
AC-10
The dashboard displays real-time alerts.
AC-11
Operators can acknowledge and resolve alerts.
AC-12
Historical events can be searched.
AC-13
Camera failures are detected.
AC-14
User permissions restrict unauthorized actions.
AC-15
The complete system can run using standard IP CCTV input without requiring smart-camera-specific analytics.
34. MVP for SIH Prototype
To avoid overengineering the hackathon prototype, the recommended MVP is:
Phase 1 – Core Infrastructure


React dashboard

FastAPI backend

PostgreSQL

RTSP input

Docker deployment
Phase 2 – AI Detection


Person detection

Vehicle detection

Object tracking
Phase 3 – Security Analytics


Virtual fence

Line crossing

Loitering

Night movement
Phase 4 – ANPR


Vehicle detection

Plate detection

OCR

Plate event storage
Phase 5 – Alert System


Real-time WebSocket alerts

Severity classification

Alert acknowledgment

Evidence snapshots
Phase 6 – Command Dashboard


Multi-camera grid

Alert panel

Map

Event timeline

Analytics
Phase 7 – Demo & Hardening


Authentication

RBAC

Audit logging

Camera failure handling

Performance optimization
35. Recommended SIH Demo Scenario
A strong demonstration should simulate a realistic border checkpoint.
Scenario
Three camera feeds:
CAM-01 → Border Road
CAM-02 → Restricted Zone
CAM-03 → Check Post

Event 1 – Human Intrusion
A person enters the virtual restricted zone.
System:
Person Detected
       ↓
Zone Violation
       ↓
HIGH Alert
       ↓
Dashboard Notification
       ↓
Snapshot + Video Evidence

Event 2 – Vehicle Detection
A vehicle enters the checkpoint.
System:
Vehicle Detected
       ↓
Vehicle Classification
       ↓
Plate Detection
       ↓
OCR
       ↓
Plate Number
       ↓
Event Logged

Event 3 – Night Movement
A person appears during restricted nighttime hours.
System:
Night Mode
    ↓
Person Detection
    ↓
Movement Confirmed
    ↓
HIGH Alert

Event 4 – Investigation
Operator searches the event timeline.
Filter:
Date
Camera
Event
Object

→ Results
→ Snapshot
→ Video Clip
→ Timeline
→ Resolution

This makes the demo visibly demonstrate the problem statement rather than only showing a generic AI detection model.
36. Suggested UI Pages
Authentication


Login

MFA

Forgot Password
Main Application


Command Dashboard

Live Monitoring

Camera Management

Alerts

Events

Investigation

ANPR Search

Map/Situation View

Reports

Analytics

User Management

System Health

AI Configuration

Audit Logs

Settings
37. Suggested Dashboard Design
Visual Theme
Recommended security-oriented theme:


Dark navy background

White text

Red critical alerts

Orange warning

Green normal

Blue informational elements
Layout
┌────────────────────────────────────────────────────┐
│ IBVAP        SYSTEM STATUS       USER              │
├──────────────┬─────────────────────────────────────┤
│ Dashboard    │  CAMERAS ONLINE     ACTIVE ALERTS  │
│ Live View    │       42                  03        │
│ Cameras      ├─────────────────────────────────────┤
│ Alerts       │                                     │
│ Events       │         LIVE CAMERA GRID            │
│ Map          │                                     │
│ ANPR         │                                     │
│ Reports      ├─────────────────────────────────────┤
│ Analytics    │       ACTIVE ALERT TIMELINE         │
│ Settings     │                                     │
└──────────────┴─────────────────────────────────────┘

38. Event Timeline
A timeline should show security events chronologically.
Example:
22:10  Camera online
22:12  Vehicle detected
22:13  Plate recognized
22:17  Person detected
22:17  Restricted-zone intrusion
22:18  Operator acknowledged
22:21  Incident resolved

This creates a clear operational story for investigators.
39. Integration Requirements
The system should expose APIs for future integration with:


Command and Control Systems

Existing VMS

Access-control systems

GIS platforms

External alerting systems

Authorized identity/vehicle systems

Other sensor platforms
The integration layer should use secure REST/WebSocket APIs and configurable authentication.
40. Future Scope
Phase 2


Thermal camera support

Advanced night vision analytics

Cross-camera tracking

Improved ANPR

Watchlist workflows

Advanced anomaly detection

Camera tampering detection
Phase 3


Multi-sensor fusion

Drone/UAV video integration

Radar integration

Ground sensor integration

Advanced geospatial analytics

Predictive risk analytics
Phase 4


Distributed nationwide-scale architecture

AI model federation

Advanced edge orchestration

Automated infrastructure health optimization
41. Key Innovation of IBVAP
The major innovation should not be presented simply as:
"We detect people using AI."
That is too generic.
The stronger innovation is:
IBVAP converts legacy CCTV infrastructure into a software-defined intelligent surveillance network by combining real-time computer vision, tracking, geofencing, ANPR, event intelligence, edge processing, and centralized command dashboards without requiring replacement of existing cameras.
The value comes from integrating the complete operational chain:
EXISTING CAMERA
      ↓
AI UNDERSTANDING
      ↓
EVENT DETECTION
      ↓
RISK ASSESSMENT
      ↓
REAL-TIME ALERT
      ↓
OPERATOR ACTION
      ↓
EVIDENCE
      ↓
INVESTIGATION
      ↓
REPORTING

42. Cost-Effectiveness Strategy
The platform should avoid requiring replacement of every deployed camera.
Instead:
Existing CCTV
      +
Edge AI Server
      +
IBVAP Software
      =
Intelligent Surveillance

This supports the core problem requirement of reducing dependence on specialized smart-camera hardware.
However, the presentation should accurately state that specialized camera hardware is not required for the analytics itself, but compute infrastructure is still required somewhere—such as an edge GPU server, local workstation, or central processing cluster.
43. Major Risks and Mitigations
RiskMitigationLow-light videoNight-specific preprocessing/modelPoor camera angleCamera calibration and ROINetwork failureEdge bufferingFalse detectionsConfidence thresholds + operator verificationANPR failureImage enhancement + multiple framesToo many alertsAlert aggregation and severity rulesGPU limitationsModel optimizationCamera failureHealth monitoringPrivacy/security riskRBAC + encryption + audit logsModel driftContinuous evaluationExcessive bandwidthEdge analytics + metadata transmission
44. Key Performance Indicators
For the prototype, measure:
Detection


Person detection precision/recall

Vehicle detection precision/recall
Tracking


ID consistency

Track loss rate
ANPR


Plate detection rate

OCR recognition rate
Alerts


Alert latency

False-positive rate

False-negative rate
Infrastructure


Cameras per edge server

Average FPS

GPU utilization

CPU utilization

Network bandwidth
Operations


Mean alert acknowledgment time

Mean investigation time

Number of events processed
45. Development Roadmap
Week/Phase 1 — Foundation
Project setup
Database
Authentication
UI architecture
API architecture
Docker

Phase 2 — CCTV Integration
RTSP
Camera registration
Live stream
Stream reconnect
Camera health

Phase 3 — AI
Person detection
Vehicle detection
Tracking
Detection overlays

Phase 4 — Security Intelligence
Virtual fence
Line crossing
Loitering
Night movement

Phase 5 — ANPR
Vehicle crop
Plate detection
OCR
Plate search

Phase 6 — Alert Engine
Rules
Risk score
WebSocket
Alert dashboard
Evidence storage

Phase 7 — Analytics
Reports
Charts
Timeline
Map
Investigation

Phase 8 — Security & Optimization
RBAC
Audit logs
Encryption
Model optimization
Performance testing
Failure recovery

Phase 9 — SIH Demonstration
Demo scenarios
Dataset/video preparation
Dashboard polish
Architecture explanation
Metrics
Pitch

46. Recommended Project Folder Structure
IBVAP/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── charts/
│   │   └── maps/
│   │
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── websocket/
│   │   ├── auth/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── ai_engine/
│   ├── detectors/
│   │   ├── person.py
│   │   ├── vehicle.py
│   │   └── face.py
│   │
│   ├── tracking/
│   ├── anpr/
│   ├── analytics/
│   ├── rules/
│   └── inference/
│
├── video_engine/
│   ├── rtsp/
│   ├── stream_manager/
│   └── recording/
│
├── database/
│   ├── migrations/
│   └── schema.sql
│
├── storage/
│   ├── snapshots/
│   └── clips/
│
├── deployment/
│   ├── docker/
│   └── docker-compose.yml
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── ai/
│   └── performance/
│
└── docs/
    ├── SRS.md
    ├── architecture.md
    ├── api.md
    └── deployment.md

47. Proposed Final System
The final IBVAP platform should provide the following complete capability:
                    IBVAP
                      |
      +---------------+---------------+
      |               |               |
   CCTV Streams     Sensors        External APIs
      |
      v
+-------------------------------------------+
|          VIDEO INTELLIGENCE               |
|                                           |
| Person Detection                          |
| Vehicle Detection                         |
| Tracking                                  |
| Face Detection                            |
| ANPR                                      |
| Intrusion Detection                       |
| Loitering                                 |
| Line Crossing                             |
| Night Movement                            |
| Anomaly Rules                             |
+--------------------+----------------------+
                     |
                     v
            EVENT INTELLIGENCE
                     |
              +------+------+
              |             |
          Risk Engine    Event Logger
              |             |
              v             v
         ALERT SYSTEM   EVIDENCE STORE
              |
              v
+-------------------------------------------+
|            COMMAND DASHBOARD              |
|                                           |
| Live Video | Alerts | Map | Analytics     |
| Events     | ANPR   | Reports | Health    |
+-------------------------------------------+
                     |
                     v
             AUTHORIZED OPERATOR
                     |
                     v
             RESPONSE / ACTION

48. SIH Pitch: One-Line Definition
IBVAP is a software-defined AI surveillance platform that upgrades existing CCTV cameras into an intelligent border monitoring network capable of detecting, tracking, analyzing and reporting security events in real time.
49. SIH Pitch: Problem → Solution
Problem
Traditional CCTV requires continuous human monitoring and often needs specialized hardware for advanced analytics.
Solution
IBVAP uses AI and Computer Vision software on existing IP-camera streams to automatically detect people, vehicles, plates, intrusions and abnormal activities and notify authorized operators in real time.
Impact
Existing CCTV
      ↓
No Major Camera Replacement
      ↓
AI Processing
      ↓
Automated Detection
      ↓
Real-Time Alerts
      ↓
Faster Response
      ↓
Better Situational Awareness

50. Core Innovation Statement for Presentation
"We are not replacing the CCTV infrastructure. We are giving existing CCTV intelligence."
This is the central idea that should remain consistent across the SRS, architecture diagram, UI, prototype and SIH pitch.
51. Recommended SIH Feature Prioritization
Must Have


RTSP CCTV streaming

Person detection

Vehicle detection

Object tracking

Virtual fence

Intrusion alert

Night movement

Alert dashboard

Event logging

Evidence snapshot

Camera health

User authentication
Strong Differentiators


ANPR

Cross-camera tracking

Edge AI

Risk-based alert prioritization

Interactive border map

Investigation timeline

Explainable alert reasons

Store-and-forward edge architecture
Future Enhancements


Advanced face recognition workflows

Thermal analytics

Sensor fusion

Drone integration

Predictive analytics

Large-scale distributed deployment
52. Final SRS Summary
IBVAP is designed as a software-first intelligent surveillance platform for border security organizations. It uses existing IP CCTV streams as the primary data source and applies AI, Computer Vision, object tracking, rule-based analytics, ANPR and event intelligence to transform raw video into actionable security information.
The solution is intended to provide:
Input
Existing CCTV

Processing
AI + Computer Vision + Tracking + Analytics

Output
Detection + Alert + Evidence + Intelligence

Operational Result
Faster detection
+
Faster operator awareness
+
Improved situational awareness
+
Better utilization of existing CCTV infrastructure

The SIH problem statement identifies this as SIH26187, under the Ministry of Home Affairs, Software track and Smart Automation domain.
For an SIH implementation, the strongest strategy is to build a reliable end-to-end MVP first—CCTV → AI detection → virtual fence → alert → evidence → dashboard → investigation—and then add ANPR, advanced analytics and optional biometric workflows as differentiators.