# Generated by Django 5.1.3 on 2024-12-08 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0007_alter_task_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('pending', 'Pendiente'), ('in_progress', 'En Progreso'), ('completed', 'Completada')], default='Pendiente', max_length=50),
        ),
    ]
