# Reservations App README

This document provides an overview of the reservation system's API, intended for frontend developers.

## Reservation Flow Simplified

1.  **User Request:** 
    A user visits the website/app and fills out a reservation request form including:
    *   Desired Date
    *   Time
    *   Guest Count
    *   Preferred Room Type (`TABLE` or `KARAOKE_ROOM`)
    *   Guest Email (Required)
    *   Booking Duration (Optional - defaults to 1 hour if not specified)
    *   Special Requests (Optional)

2.  **Request Saved:** 
    The system saves this request with a `PENDING` status. No specific room (e.g., "Table 5") is assigned yet.

3.  **Admin Review:** 
    An administrator reviews the `PENDING` requests.

4.  **Admin Assignment & Confirmation:** 
    The admin selects an available *specific* room (e.g., "Karaoke Room 1") matching the requested type and time. They update the reservation to assign the specific `room_id` and change the `status` to `CONFIRMED`.
    *   **Conflict Check:** The system prevents confirming a reservation if the selected room/time overlaps with another confirmed booking.
    *   **Karaoke Minimum:** Karaoke rooms must be booked for at least 1 hour.

5.  **User Notified/Sees Update:** 
    The user can view their reservation's updated status (`CONFIRMED`) and the assigned room details.

---

## API Endpoints for Frontend

**Base URL:** `/api/`

--- 

### 1. Create Reservation Request

*   **Purpose:** Submits a new reservation request.
*   **Method:** `POST`
*   **Endpoint:** `/api/reservations/`
*   **Authentication:** None required.
*   **Request Body:** `JSON`
    ```json
    {
        "guest_name": "Bob",
        "guest_email": "bob@example.com",
        "reservation_date": "2024-12-25",
        "reservation_time": "18:00:00",
        "duration": "01:00:00",
        "number_of_guests": 2,
        "room_type": "TABLE",
        "special_requests": "Near window."
    }
    ```
    **Fields:**
    *   `guest_email`: Required.
    *   `duration`: Optional (defaults to 1hr backend). Format `HH:MM:SS`.
    *   `room_type`: Required (`TABLE` or `KARAOKE_ROOM`).
    *   `special_requests`: Optional.
*   **Success Response (`201 Created`):** 
    The created reservation object (status=`PENDING`, room=`null`).
*   **Error Response (`400 Bad Request`):** 
    Contains validation errors (e.g., date invalid, duration too short).
    ```json
    { "duration": ["Karaoke room bookings must be for at least 1 hour."] }
    ```

--- 

### 2. List/View User's Reservations

*   **Purpose:** Get reservations linked to the authenticated user.
*   **Method:** `GET`
*   **Endpoint (List):** `/api/reservations/`
*   **Endpoint (Detail):** `/api/reservations/{id}/`
*   **Authentication:** Required (Token/Session).
*   **Response (List):** `200 OK` with an array `[...]` of the user's reservation objects.
*   **Response (Detail):** `200 OK` with a single reservation object. `404 Not Found` if not found or not owned by the user.

--- 

### 3. Confirm/Update Reservation (Admin Action)

*   **Purpose:** Allows an Admin/Staff user to confirm a pending reservation by assigning a room and changing the status. Can also be used to update status, room, or duration of existing reservations.
*   **Method:** `PATCH` (Recommended for partial updates)
*   **Endpoint:** `/api/reservations/{id}/` (Replace `{id}` with the reservation ID)
*   **Authentication:** Required (Admin/Staff Token/Session).
*   **Request Body (`JSON`):** 
    *   *Example - Confirming and Assigning Room:*
        ```json
        {
            "status": "CONFIRMED",
            "room_id": 5 
        }
        ```
    *   *Example - Changing Duration:*
        ```json
        {
            "duration": "03:00:00"
        }
        ```
*   **Success Response (`200 OK`):** The fully updated reservation object.
*   **Error Response (`400 Bad Request`):** 
    Contains validation errors (e.g., double-booking conflict, duration rules).
    *   *Example (Conflict):*
        ```json
        {
            "non_field_errors": [
                "Karaoke Room 1 is already booked between 19:00 and 21:00 on 2024-12-25. Requested slot: 20:00 to 22:00."
            ]
        }
        ```
    *   *Example (Duration):*
        ```json
        { "duration": ["Karaoke room bookings must be for at least 1 hour."] }
        ```

--- 

### 4. Check Daily Availability Summary

*   **Purpose:** Get a summary of availability status (Available, Limited, Unavailable) for each room type for a specific day (based on 4 PM - 1 AM window).
*   **Method:** `GET`
*   **Endpoint:** `/api/availability/summary/`
*   **Query Parameter:** `date=YYYY-MM-DD` (e.g., `?date=2024-12-25`)
*   **Authentication:** None required.
*   **Response (`200 OK`):
    ```json
    {
        "date": "2024-12-25",
        "availability_by_type": {
            "TABLE": {
                "room_type_display": "Table",
                "percentage_booked": 25.00,
                "availability_status": "AVAILABLE"
            },
            "KARAOKE_ROOM": {
                "room_type_display": "Karaoke Room",
                "percentage_booked": 95.00,
                "availability_status": "LIMITED_AVAILABILITY"
            }
        }
    }
    ```

--- 

### 5. Get Specific Booked Time Slots (Table / Karaoke)

*   **Purpose:** Get the exact list of confirmed bookings for a specific room type on a given date. Useful for disabling specific time slots in the UI.
*   **Method:** `GET`
*   **Endpoint:** `/api/reservations/`
*   **Query Parameters (ALL Required for this purpose):**
    *   `reservation_date=YYYY-MM-DD` 
    *   `status=CONFIRMED` 
    *   `room__room_type=[TABLE | KARAOKE_ROOM]` 
    *   *Example:* `?reservation_date=2025-11-10&status=CONFIRMED&room__room_type=KARAOKE_ROOM`
*   **Authentication:** None required (when using *all* the above query parameters).
*   **Response (`200 OK`):** 
    An array `[...]` containing minimal details of confirmed reservation slots matching the filters. *Note: The system prevents conflicting bookings, so the slots listed here will not overlap for the same specific room.*
    ```json
    [
        {
            "room": {
                "id": 1,
                "room_name": "Karaoke Room 1",
                "room_type": "KARAOKE_ROOM"
            },
            "reservation_date": "2025-11-10",
            "reservation_time": "16:00:00", // 4 PM - 6 PM slot
            "duration": "02:00:00"
        },
        {
            "room": {
                "id": 1,
                "room_name": "Karaoke Room 1",
                "room_type": "KARAOKE_ROOM"
            },
            "reservation_date": "2025-11-10",
            "reservation_time": "19:00:00", // 7 PM - 9 PM slot (Example - does not conflict)
            "duration": "02:00:00" 
        },
        {
            "room": {
                "id": 2, // Example for a DIFFERENT Karaoke Room
                "room_name": "Karaoke Room 2",
                "room_type": "KARAOKE_ROOM"
            },
            "reservation_date": "2025-11-10",
            "reservation_time": "17:00:00", // 5 PM - 7 PM slot (Okay, different room)
            "duration": "02:00:00" 
        }
        // ... other non-conflicting booked slots ...
    ]
    ```

--- 

### 6. Delete Reservation

*   **Purpose:** Deletes a specific reservation.
*   **Method:** `DELETE`
*   **Endpoint:** `/api/reservations/{id}/`
*   **Authentication:** Required (Admin/Staff or Owner of reservation).
*   **Success Response (`204 No Content`):** Empty response body.
*   **Error Response (`404 Not Found`):** If reservation not found or user lacks permission.

---

*Remember to include authentication tokens in the `Authorization` header for protected endpoints (like viewing full user reservation details or admin actions).*