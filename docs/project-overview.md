# Project Overview

The V2 student portal is the authenticated self-service workspace for Talent
Match students. It owns dashboard, profile, documents, opportunity discovery,
applications, counselors, appointments, and resources.

`../../api/api` owns authorization and business rules. `../../api/db` owns
database access. `../app` owns login, registration, verification, and recovery.
The student portal never accesses the database or implements admin workflows.

V1 behavior under `../../v1/app/src/app/student` is the feature-parity source.
The V2 admin portal is the visual and interaction-system source. Student
screens preserve V1 capabilities while matching admin layout, controls,
feedback, responsiveness, and loading behavior.
