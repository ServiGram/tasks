from django.urls import path
from .views import (
    CurrentUserView,
    UpdateCurrentUserView,
    ChangePasswordWithoutCurrentView,
    check_email,
    check_username,
)

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("me/update/", UpdateCurrentUserView.as_view(), name="update-current-user"),
    path("check-email/", check_email, name="check-email"),
    path("check-username/", check_username, name="check-username"),
    path(
        "change-password/",
        ChangePasswordWithoutCurrentView.as_view(),
        name="change-password",
    ),
]
