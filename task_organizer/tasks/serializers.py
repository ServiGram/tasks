from rest_framework import serializers
from .models import Task
from datetime import datetime


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "priority",
            "completed",
            "create_date",
            "end_date",
            "status",
            "user",
        ]
        read_only_fields = ["id", "user"]

    def get_status_display(self, obj):
        return obj.get_status_display()

    def get_priority_display(self, obj):
        return obj.get_priority_display()

    def validate_end_date(self, value):
        # Convertir create_date a un objeto datetime
        create_date_str = self.initial_data.get("create_date")
        try:
            create_date = (
                datetime.fromisoformat(create_date_str) if create_date_str else None
            )
        except ValueError:
            raise serializers.ValidationError(
                "create_date tiene un formato inválido. Debe ser ISO 8601."
            )

        # Validar que end_date sea mayor o igual a create_date
        if value and create_date and value < create_date:
            raise serializers.ValidationError(
                "La fecha de finalización no puede ser anterior a la fecha de creación."
            )
        return value
