from django.db import models
from django.conf import settings


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(default="Descripción no proporcionada")
    priority = models.CharField(
        max_length=50,
        choices=[("baja", "Baja"), ("media", "Media"), ("alta", "Alta")],
        default="baja",
    )
    completed = models.BooleanField(default=False)
    create_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=50,
        default="pending",
        choices=[
            ("pending", "Pendiente"),
            ("in_progress", "En Progreso"),
            ("completed", "Completada"),
        ],
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
