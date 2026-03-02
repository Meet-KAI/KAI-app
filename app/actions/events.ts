"use server";

import { Event } from "../types/events";
import { ApiEvent } from "../types/api";

const API_BASE_URL = process.env.API_BASE_URL;
const USER_ID = "00000000-0000-0000-0000-000000000001";

// --- snake_case <-> camelCase helpers ---
// API uses snake_case (max_capacity, meeting_url), frontend uses camelCase

function apiEventToFrontend(api: ApiEvent): Event {
  return {
    id: api.id,
    title: api.title,
    date: api.date,
    time: api.time,
    location: api.location,
    meetingUrl: api.meeting_url,
    type: api.type,
    attendees: api.attendees,
    maxCapacity: api.max_capacity,
    description: api.description,
    tags: api.tags,
  };
}

function frontendEventToApi(event: Partial<Event>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (event.title !== undefined) result.title = event.title;
  if (event.date !== undefined) result.date = event.date;
  if (event.time !== undefined) result.time = event.time;
  if (event.location !== undefined) result.location = event.location;
  if (event.meetingUrl !== undefined) result.meeting_url = event.meetingUrl;
  if (event.type !== undefined) result.type = event.type;
  if (event.attendees !== undefined) result.attendees = event.attendees;
  if (event.maxCapacity !== undefined) result.max_capacity = event.maxCapacity;
  if (event.description !== undefined) result.description = event.description;
  if (event.tags !== undefined) result.tags = event.tags;
  return result;
}

// --- Server actions ---

export async function seedEvents(): Promise<void> {
  await fetch(`${API_BASE_URL}/events/seed`, { cache: "no-store" });
}

export async function fetchAllEvents(): Promise<Event[]> {
  const res = await fetch(`${API_BASE_URL}/events/`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status}`);
  }
  const data: ApiEvent[] = await res.json();
  return data.map(apiEventToFrontend);
}

export async function fetchEventsByUser(
  userId: string = USER_ID
): Promise<Event[]> {
  const res = await fetch(`${API_BASE_URL}/events/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch user events: ${res.status}`);
  }
  const data: ApiEvent[] = await res.json();
  return data.map(apiEventToFrontend);
}

export async function createEvent(
  eventData: Partial<Event>
): Promise<Event> {
  const body = frontendEventToApi(eventData);
  const res = await fetch(`${API_BASE_URL}/events/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to create event: ${res.status}`);
  }
  const data: ApiEvent = await res.json();
  const event = apiEventToFrontend(data);

  // Auto-register the creator
  const regRes = await fetch(`${API_BASE_URL}/registrations/${event.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": USER_ID,
    },
  });
  if (!regRes.ok) {
    console.error(`Auto-registration failed: ${regRes.status}`);
  }

  return event;
}

export async function updateEvent(
  eventId: number,
  eventData: Partial<Event>
): Promise<Event> {
  const body = frontendEventToApi(eventData);
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Failed to update event: ${res.status}`);
  }
  const data: ApiEvent = await res.json();
  return apiEventToFrontend(data);
}

export async function registerForEvent(
  eventId: number
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/registrations/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": USER_ID,
    },
  });

  if (res.status === 409) {
    const data = await res.json();
    return { success: false, message: data.detail || "Already registered or event at capacity" };
  }
  if (res.status === 404) {
    return { success: false, message: "Event not found" };
  }
  if (!res.ok) {
    return { success: false, message: `Registration failed: ${res.status}` };
  }

  return { success: true, message: "Successfully registered!" };
}

export async function unregisterFromEvent(
  eventId: number
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/registrations/${eventId}`, {
    method: "DELETE",
    headers: {
      "X-User-Id": USER_ID,
    },
  });

  if (res.status === 404) {
    return { success: false, message: "Registration not found" };
  }
  if (!res.ok) {
    return { success: false, message: `Unregistration failed: ${res.status}` };
  }

  return { success: true, message: "Successfully unregistered" };
}
