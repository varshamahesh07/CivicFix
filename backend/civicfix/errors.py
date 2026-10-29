class ApiError(Exception):
    """An error with a user-facing message. The frontend shows `message` directly."""

    def __init__(self, message, status=400, errors=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.errors = errors or {}


def validation_error(errors):
    """Build a 400 from a field->message dict. The first message becomes the top-level message."""
    return ApiError(next(iter(errors.values())), 400, errors)
