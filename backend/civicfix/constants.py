# Must match src/utils/constants.js in the frontend.
STATUSES = ("Registered", "Ongoing", "Resolved", "Denied", "Waiting List")
PRIORITIES = ("Critical", "High", "Medium", "Low")

CATEGORIES = (
    "Roads and Potholes",
    "Garbage and Waste",
    "Water Supply",
    "Drainage and Sewage",
    "Streetlights",
    "Public Safety",
    "Public Infrastructure",
    "Other",
)

DEPARTMENTS = {
    "Roads and Potholes": "Roads & Infrastructure",
    "Garbage and Waste": "Solid Waste Management",
    "Water Supply": "Water Works",
    "Drainage and Sewage": "Drainage & Sewerage",
    "Streetlights": "Electrical & Street Lighting",
    "Public Safety": "Public Safety Office",
    "Public Infrastructure": "Public Works",
    "Other": "General Administration",
}
DEFAULT_DEPARTMENT = "General Administration"
AUTHORITY_DEPARTMENTS = tuple(dict.fromkeys(DEPARTMENTS.values()))
